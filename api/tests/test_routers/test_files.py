import json

from fastapi import status

from src.main import app
from src.services.files import get_file, get_files

FILENAME = "test.jpg"


def test_upload_files(client, deployment, pillow_image, admin_headers):
    url = app.url_path_for("upload_files", deployment_id=deployment.id)

    response = client.post(
        url, files={"list_files": (FILENAME, pillow_image, "image/jpeg")}, headers=admin_headers
    )

    assert response.status_code == status.HTTP_200_OK


def test_update_annotations(client, file_object, db, admin_headers):
    url = app.url_path_for("update_annotations", file_id=file_object.id)

    annotations = [
        {
            "id": "string",
            "id_annotation": "string",
            "id_group": "string",
            "classe": "string",
            "family": "string",
            "genus": "string",
            "order": "string",
            "species": "string",
            "number": 1,
            "biological_state": "string",
            "life_stage": "string",
            "sex": "string",
            "behaviour": "string",
            "comments": "string",
        }
    ]

    response = client.patch(url, json=annotations, headers=admin_headers)

    assert response.status_code == status.HTTP_200_OK

    content = response.json()
    assert content["id"] == str(file_object.id)
    db.expire_all()  ## Prevent SQLAlchemy from caching

    current_file = get_file(db=db, file_id=file_object.id)
    assert current_file.annotations == annotations


def test_get_files(client, file_object, admin_headers):
    url = app.url_path_for("get_files")

    response = client.get(url, headers=admin_headers)

    assert response.status_code == status.HTTP_200_OK

    content = response.json()

    # assert file_object.json() in content


def test_display_file(client, db, file_object, admin_headers):
    url = app.url_path_for("display_file")

    response = client.get(url, params={"name": file_object.minio_filename}, headers=admin_headers)
    print(response.json())

    assert response.status_code == status.HTTP_200_OK


def test_upload_file(client, deployment, pillow_image, db, admin_headers):
    url = app.url_path_for("upload_file", deployment_id=deployment.id)

    response = client.post(
        url, files={"file": (FILENAME, pillow_image, "image/jpeg")}, headers=admin_headers
    )

    assert response.status_code == status.HTTP_200_OK

    content = response.json()
    # f.json() dumps json in a string format but we want it in a
    # dict format so json.loads. f.dict() returns a dict but keeps
    # some values as objects such as datetime or uuid...
    list_files = [json.loads(f.json()) for f in get_files(db=db)]

    assert content in list_files
