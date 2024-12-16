from datetime import datetime
from typing import List, Optional
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
    date: Optional[datetime]=None
    annotations: List[Annotation]