from typing import Generator

import pytest
from fastapi.testclient import TestClient

from src.main import app


@pytest.fixture(scope="module")
def client() -> Generator:
    with TestClient(app) as test_client:
        yield test_client


# Add fixtures here
pytest_plugins = ["tests.fixtures.models.image"]
