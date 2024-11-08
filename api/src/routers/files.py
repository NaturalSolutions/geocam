from __future__ import annotations

import io
import tempfile
import time
import uuid as uuid_pkg
from copy import deepcopy
from datetime import datetime
from typing import List
from zipfile import ZipFile

import magic
from celery.result import AsyncResult
from fastapi import APIRouter, BackgroundTasks, Depends, File, Form, HTTPException, UploadFile
from fastapi.responses import StreamingResponse
from sqlmodel import Session

from src.config import settings
from src.connectors import s3
from src.connectors.celery import celery_app
from src.connectors.database import get_db
from src.models.file import CreateFiles, Files
from src.schemas.schemas import Annotation
from src.services import dependencies, files
from src.utils import check_mime, file_as_bytes

router = APIRouter(
    prefix="/files",
    tags=["files"],
    # dependencies=[Depends(get_token_header)],
    responses={404: {"description": "Not found"}},
)

# @router.get("/", response_model=List[schemas.File])
# def read_files(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
#     users = crud.get_files(db, skip=skip, limit=limit)
#     return files


# @router.get("/{file_id}", response_model=schemas.File)
# def read_file(file_id: int, db: Session = Depends(get_db)):
#     db_file = crud.get_file(db, file_id=file_id)
#     if db_file is None:
#         raise HTTPException(status_code=404, detail="File not found")
#     return db_file


@router.get("/")
def get_files(db: Session = Depends(get_db)):
    List_files = files.get_files(db)
    res = []
    for f in List_files:
        new_f = f.dict()
        ext = f.extension.split("/")[1]
        url = s3.get_url_client(f"{f.hash}.{ext}")
        new_f["url"] = url
        res.append(new_f)
    return res


@router.patch("/annotation/{file_id}", response_model=Files)
def update_annotations(
    file_id: uuid_pkg.UUID, data: List[Annotation], db: Session = Depends(get_db)
):
    return files.update_annotations(db, file_id=file_id, data=data)


@router.get("/urls/")
def display_file(name: str):
    return s3.get_url_client(name)


@router.post("/exif/")
def extract_exif(file: UploadFile = File(...), db: Session = Depends(get_db)):
    from exif import Image

    exif_data = Image(file_as_bytes(file.file))
    res = {}
    for key in exif_data.list_all():
        try:
            res[key] = exif_data[key]
        except Exception as e:
            res[key] = "Erreur inconnue pour le moment"
    return res


def ask_answers_celery(task_id, file_list, db):
    res = celery_app.AsyncResult(task_id)
    while res.state == "PENDING":
        pass
    try:
        final_res = res.get(timeout=2)
        for res, file in zip(final_res, file_list):
            db_file = files.get_file(db=db, file_id=file.id)
            db_file.prediction_deepfaune = res
            db.commit()
    except:
        print("failed")


@router.post("/upload/{deployment_id}")
def upload_file(
    deployment_id: int,
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    hash = dependencies.generate_checksum(file)

    mime = magic.from_buffer(file.file.read(), mime=True)
    file.file.seek(0)

    if not check_mime(mime):
        raise HTTPException(status_code=400, detail="Invalid type file")

    insert = files.upload_file(
        db=db,
        hash=hash,
        new_file=file.file,
        filename=file.filename,
        ext=mime,
        deployment_id=deployment_id,
    )

    ext = mime.split("/")[1]
    url = s3.get_url_server(f"{hash}.{ext}")
    task = celery_app.send_task("deepfaune.pi", [[url]])
    background_tasks.add_task(ask_answers_celery, task.get(), [insert], db)
    return insert


@router.post("/upload_files/{deployment_id}")
def upload_files(
    deployment_id: int,
    list_files: List[UploadFile] = File(...),
    db: Session = Depends(get_db),
):
    if len(list_files) < 20:
        print(list_files)
        for file in list_files:
            hash = dependencies.generate_checksum(file)
            ext = file.filename.split(".")[1]
            try:
                s3.upload_file_obj(file.file, f"{hash}.{ext}")
            except Exception as e:
                raise HTTPException(status_code=404, detail="Impossible to save the file in minio")

            metadata = CreateFiles(
                hash=hash,
                name=file.filename,
                extension=ext,
                bucket=settings.MINIO_BUCKET_NAME,
                date=datetime.fromisoformat("2022-01-22"),
                deployment_id=deployment_id,
            )
            try:
                files.create_file(db=db, file=metadata)
            except Exception as e:
                print(e)
                raise HTTPException(status_code=404, detail="Impossible to save the file in bdd")
        return "Files créés !"

    else:
        return "Erreur: le nombre de fichiers à importer est limité à 20"


@router.get("/download/{id}")
def download_file(id: str, db: Session = Depends(get_db)):
    f = files.get_file(db, id)
    my_file = s3.download_file_obj(f"{f.hash}.{f.extension}")

    response = StreamingResponse(my_file, media_type="application/x-zip-compressed")
    response.headers["Content-Disposition"] = f"attachment; filename={f.name}"
    response.headers["Content-Length"] = str(my_file.getbuffer().nbytes)
    return response


@router.post("/upload_zip/{deployment_id}")
def upload_zip(
    background_tasks: BackgroundTasks,
    deployment_id: int,
    zipFile: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    ext = zipFile.filename.split(".")[1]
    if ext == "zip":
        with ZipFile(io.BytesIO(zipFile.file.read()), "r") as myzip:
            res = []
            names = []
            for info in myzip.infolist():
                bytes = myzip.read(info.filename)
                with tempfile.SpooledTemporaryFile() as tf:
                    tf.write(bytes)
                    tf.seek(0)

                    hash = dependencies.generate_checksum_content(bytes)

                    mime = magic.from_buffer(tf.read(), mime=True)
                    tf.seek(0)

                    if not check_mime(mime):
                        raise HTTPException(status_code=400, detail="Invalid type file")
                    insert = files.upload_file(
                        db=db,
                        hash=hash,
                        new_file=tf,
                        filename=info.filename,
                        ext=mime,
                        deployment_id=deployment_id,
                    )
                    res.append(deepcopy(insert))
                    ext = mime.split("/")[1]
                    names.append(f"{hash}.{ext}")
            urls = []
            for name in names:
                url = s3.get_url_server(name)
                urls.append(url)
            task = celery_app.send_task("deepfaune.pi", [urls])
            background_tasks.add_task(ask_answers_celery, task.get(), res, db)
            return res
    else:
        raise HTTPException(status_code=500, detail="Vous ne pouvez déposer que des fichiers.zip")


@router.get("/{deployment_id}")
def read_deployment_files(deployment_id: int, db: Session = Depends(get_db)):
    List_files = files.get_deployment_files(db=db, id=deployment_id)
    res = []
    for f in List_files:
        new_f = f.dict()
        ext = f.extension.split("/")[1]
        url = s3.get_url_client(f"{f.hash}.{ext}")
        new_f["url"] = url
        res.append(new_f)
    return res
