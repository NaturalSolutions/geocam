import hashlib
import tempfile
import uuid as uuid_pkg
from datetime import datetime
from typing import List

from fastapi import HTTPException
from sqlmodel import Session

from src.config import settings
from src.connectors import s3
from src.models.file import CreateFiles, Files

# import schemas.schemas
from src.schemas.schemas import Annotation
from src.utils import file_as_bytes

# async def stockage_image(file):
#     try :
#         contents = await file.read()
#         with open(f'{file.filename}',"wb") as f:
#             f.write(contents)
#     except Exception:
#         return {"message": "There was an error uploading the file"}
#     finally:
#         await file.close()

#     return {"message": f"Successfuly uploaded {file.filename}"}


def get_hash(file):
    return hashlib.sha256(file_as_bytes(file)).hexdigest()


def get_files(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Files).order_by(Files.name).offset(skip).limit(limit).all()


def get_file(db: Session, file_id: uuid_pkg.UUID):
    return db.query(Files).filter(Files.id == file_id).first()


def get_deployment_files(db: Session, id: int, skip: int = 0, limit: int = 100):
    return (
        db.query(Files)
        .filter(Files.deployment_id == id)
        .order_by(Files.name)
        .offset(skip)
        .limit(limit)
        .all()
    )


def create_file(db: Session, file: CreateFiles):
    db_file = Files(**file.dict(), annotations=[])
    db.add(db_file)
    db.commit()
    db.refresh(db_file)
    return db_file


def update_annotations(db: Session, file_id: int, data: List[Annotation]):
    db_file = get_file(db=db, file_id=file_id)
    if db_file is None:
        raise HTTPException(
            status_code=404,
            detail="No file found",
        )
    # update des annotations
    db_file.annotations = [d.dict() for d in data]
    # update du statut de traitement du média
    db_file.treated = True
    db.commit()
    db.refresh(db_file)
    return db_file


# def get_file_by_path(db: Session, path: str):
#     return db.query(File).filter(File.path == path).first()


# def update_file(db: Session, file: schemas.File):
#     db_file = db.query(File).filter(File.id == file.id).first()
#     db_file.name = file.name
#     db.commit()
#     db.refresh(db_file)
#     return db_file


def delete_file(db: Session, id: int):
    db_file = db.query(Files).filter(Files.id == id).first()
    db.delete(db_file)
    db.commit()
    return db_file


def upload_file(
    db: Session,
    hash: str,
    new_file: tempfile.SpooledTemporaryFile,
    filename: str,
    ext: str,
    deployment_id: int,
):
    try:
        extension = ext.split("/")[1]
        s3.upload_file_obj(new_file, f"{hash}.{extension}")
    except Exception as e:
        print(e)
        raise HTTPException(status_code=404, detail="Impossible to save the file in minio")
    metadata = CreateFiles(
        hash=hash,
        name=filename,
        extension=ext,
        bucket=settings.MINIO_BUCKET_NAME,
        date=datetime.now(),
        deployment_id=deployment_id,
    )
    try:
        return create_file(db=db, file=metadata)
    except Exception as e:
        raise HTTPException(status_code=404, detail="Impossible to save the file in bdd")
