import pytest

from src.models.image import Image


@pytest.fixture()
def images():
    urls = [
        "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Ibizea.jpg/1280px-Ibizea.jpg"
    ]

    return [Image(path=url) for url in urls]
