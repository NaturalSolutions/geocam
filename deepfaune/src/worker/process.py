import tempfile
from typing import List
from pydantic import AnyHttpUrl

import httpx

from src.models.image import Image


def download_images(urls: List[AnyHttpUrl]):
    for url in urls:
        yield download_image(url)


def download_image(url: AnyHttpUrl):
    request = httpx.get(url)
    # TODO: To be reingeneered later : do not store images as
    # files...
    with tempfile.NamedTemporaryFile("wb", delete=False) as f:
        f.write(request.content)
        return f.name


def process_images(images: List[Image]):
    names = list(download_images(images=images))
