from typing import TYPE_CHECKING, Optional

from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:  # pragma: no cover
    from api.src.models.file import Files


class Annotations(SQLModel, table=True):
    id: Optional[int] = Field(primary_key=True, index=True)
    id_annotation: str
    id_group: str
    classe: str
    family: str
    genus: str
    order: str
    species: int
    number: int
    biological_state: str
    sex: str
    behaviour: str
    life_stage: str
    comments: str
    file_id: str = Field(foreign_key="files.id")
    file: "Files" = Relationship(back_populates="annotations")
