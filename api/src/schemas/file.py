from datetime import datetime
from typing import List
from sqlmodel import SQLModel
from src.schemas.schemas import Annotation

class FileInfo(SQLModel):
    hash: str


class File(SQLModel):
    id: str
    name: str
    extension: str
    bucket: str
    date: datetime
    url: str

class UpdateFile (SQLModel):
    date: datetime
    annotations: List[Annotation]