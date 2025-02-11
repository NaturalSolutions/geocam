from typing import Optional

from sqlmodel import Field, SQLModel


class SiteBase(SQLModel):
    name: str
    latitude: float
    longitude: float
    habitat: Optional[str]
    description: Optional[str]
    image: Optional[str]


class Sites(SiteBase, table=True):
    id: Optional[int] = Field(primary_key=True, index=True)
