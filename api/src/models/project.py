from datetime import date
from typing import TYPE_CHECKING, List, Optional

from pydantic import validator
from sqlmodel import Field, Relationship, SQLModel

from src.models.deployment import (DeploymentForProjectSheet, Deployments,
                                   DeploymentWithFile)
from src.schemas.schemas import DataProject

if TYPE_CHECKING:  # pragma: no cover
    from .deployment import Deployments


class ProjectBase(SQLModel):
    name: str
    creation_date: date
    start_date: Optional[date]
    end_date: Optional[date]
    protocol: Optional[str]
    acquisition_framework: Optional[str]
    targeted_species: Optional[str]
    referential: Optional[str]
    timezone: Optional[str]
    image: Optional[str]
    owner_id: Optional[int] = Field(foreign_key="users.id")
    contact_id: Optional[int] = Field(foreign_key="users.id")

    @validator("name")
    def check_storage_type(cls, value):
        if len(value) < 2:
            raise ValueError("Name project must be greater than > 2 characters")
        return value


class Projects(ProjectBase, table=True):
    id: Optional[int] = Field(primary_key=True, index=True)
    deployments: Optional[List["Deployments"]] = Relationship(
        back_populates="project", sa_relationship_kwargs={"lazy": "raise"}
    )


class ReadProject(ProjectBase):
    id: int


class ProjectWithDeployment(ReadProject):
    deployments: Optional[List[Deployments]]


class ProjectWithDeploymentAndFiles(ReadProject):
    deployments: Optional[List[DeploymentWithFile]]


class ProjectSheet(ReadProject):
    deployments: List[DeploymentForProjectSheet]
    stats: DataProject
