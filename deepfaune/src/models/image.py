from pydantic import AnyHttpUrl, BaseModel, validator

from src.core.config import settings


class Image(BaseModel):
    # Restrict on HOST if set to avoid fuzzy images
    path: AnyHttpUrl

    @validator("path")
    def validate_path(cls, value):
        host = settings.HOST
        if host is not None:
            assert value.host == host
        return value
