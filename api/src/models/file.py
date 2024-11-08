import uuid as uuid_pkg
from datetime import datetime
from typing import TYPE_CHECKING, List, Optional

from pydantic import AnyHttpUrl, root_validator
from sqlalchemy.dialects.postgresql import JSONB
from sqlmodel import Column, Field, Relationship, SQLModel

from src.connectors.s3 import get_url_client

if TYPE_CHECKING:  # pragma: no cover
    from .deployment import Deployments


class BaseFiles(SQLModel):
    hash: str
    name: str
    extension: str
    bucket: str
    date: datetime

    @property
    def minio_filename(self):
        return f"{self.hash}.{self.extension}"

    # url: str


class Files(BaseFiles, table=True):
    id: Optional[uuid_pkg.UUID] = Field(
        default_factory=uuid_pkg.uuid4,
        primary_key=True,
        index=True,
        nullable=False,
    )
    hash: str = Field(index=True)
    name: str = Field(index=True)
    date: Optional[datetime] = Field(default_factory=datetime.utcnow)
    megadetector_id: Optional[int] = Field(foreign_key="megadetector.id")
    prediction_deepfaune: Optional[dict] = Field(sa_column=Column(JSONB), default={})
    deployment_id: int = Field(foreign_key="deployments.id")
    treated: bool = Field(default=False)
    annotations: Optional[List[dict]] = Field(sa_column=Column(JSONB), default=[])
    deployment: "Deployments" = Relationship(back_populates="files")


class CreateFiles(BaseFiles):
    deployment_id: int


class ReadFiles(BaseFiles):
    id: uuid_pkg.UUID
    url: Optional[AnyHttpUrl] = ""

    @root_validator
    def gen_url(cls, values):  # pylint: disable=no-self-argument,no-self-use
        filename = f"{values['hash']}.{values['ext']}"
        values["url"] = get_url_client(filename)
        return values
