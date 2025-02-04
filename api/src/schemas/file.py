from datetime import datetime
from typing import Dict, List, Optional, Tuple
from pydantic import BaseModel
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


class UpdateFile(SQLModel):
    date: Optional[datetime] = None
    annotations: List[Annotation]


class FilterResult(BaseModel):
    taxonomy_filters: Dict[str, str]
    date_ranges: Dict[str, Optional[datetime]]


class FilterParams(BaseModel):
    species: Optional[str] = None
    family: Optional[str] = None
    genus: Optional[str] = None
    classe: Optional[str] = None
    order: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None

    def get_filters(self) -> Tuple[Dict[str, str], Dict[str, datetime]]:
        """Transforme les valeurs en dictionnaire utilisable par SQLAlchemy."""
        taxonomy_filters = {}
        date_ranges = {}
        for key, value in self.dict(exclude_none=True).items():
            if value not in [None, ""]:
                if key in ["start_date", "end_date"] and value:
                    print("VALUE", value)
                    print("KEY", key)
                    try:
                        date_ranges[key] = datetime.fromisoformat(value)  # Nettoyage des guillemets
                    except ValueError:
                        raise ValueError(
                            f"Invalid date format for {key}. Expected ISO 8601 (YYYY-MM-DDTHH:MM:SS)"
                        )
                else:
                    taxonomy_filters[key] = value
            print(taxonomy_filters)
            print(date_ranges)
        return FilterResult(taxonomy_filters=taxonomy_filters, date_ranges=date_ranges)
