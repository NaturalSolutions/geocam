import io
from datetime import datetime
from random import randrange

import pytest
from fastapi import UploadFile
from PIL import Image

from src.config import settings
from src.models.file import CreateFiles
from src.services.dependencies import generate_checksum
from src.services.files import create_file


def gen_img():
    width = 400
    height = 300
    red = randrange(0, 255)
    green = randrange(0, 255)
    blue = randrange(0, 255)

    # Different from init_data since we do not want to have the same md5 sum

    return Image.new(mode="RGB", size=(width, height), color=(red, green, blue))


def save_img(img: Image.Image, exif=Image.Exif()):
    img_bytes = io.BytesIO()
    img.save(img_bytes, "JPEG", exif=exif)
    img_bytes.seek(0)
    return img_bytes


@pytest.fixture
def pillow_image() -> io.BytesIO:
    """Creates a green image with pillow
    Returns:
        io.BytesIO: the image as BytesIO

    """
    img = gen_img()
    return save_img(img=img)


@pytest.fixture
def file_object(deployment, pillow_image, db):
    upload_file = UploadFile(filename="test.jpg", file=pillow_image)
    hash = generate_checksum(upload_file)
    metadata = CreateFiles(
        hash=hash,
        name=upload_file.filename,
        extension="jpg",
        bucket=settings.MINIO_BUCKET_NAME,
        import_date=datetime.fromisoformat("2022-01-22"),
        deployment_id=deployment.id,
    )
    return create_file(db=db, file=metadata)
