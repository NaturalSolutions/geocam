from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session

from src.connectors.database import get_db
from src.models.project import (
    ProjectBase,
    ProjectSheet,
    ProjectWithDeployment,
    ProjectWithDeploymentAndFiles,
    ReadProject,
)
from src.schemas.schemas import FirstUntreated, StatsProject
from src.services import project
from src.connectors import s3

router = APIRouter(
    prefix="/projects",
    tags=["projects"],
    responses={404: {"description": "Not found"}},
)


@router.get("/", response_model=List[ReadProject])
def read_projects(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    projects = project.get_projects(db, skip=skip, limit=limit)
    return projects


@router.get("/{project_id}", response_model=ReadProject)
def read_project(project_id: int, db: Session = Depends(get_db)):
    db_project = project.get_project(db, project_id=project_id)
    if db_project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    return db_project


@router.post("/", response_model=ReadProject)
def create_project(new_project: ProjectBase, db: Session = Depends(get_db)):
    db_project = project.get_project_by_name(db, name_project=new_project.name)
    if db_project:
        raise HTTPException(status_code=400, detail="Name already registered")
    return project.create_project(db=db, project=new_project)


@router.put("/{project_id}", response_model=ReadProject)
def update_project(project_id: int, data_project: ProjectBase, db: Session = Depends(get_db)):
    return project.update_project(db=db, project=data_project, id=project_id)


@router.delete("/{project_id}")
def delete_project(project_id: int, db: Session = Depends(get_db)):
    return project.delete_project(db=db, id=project_id)


@router.get("/deployments/", response_model=List[ProjectWithDeployment])
def read_projects_with_deployments(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return project.get_projects(db, skip=skip, limit=limit)


@router.get("/deployments_and_files/", response_model=List[ProjectWithDeploymentAndFiles])
def read_projects_with_deployments(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return project.get_projects(db, skip=skip, limit=limit)


@router.get("/stats_projects/", response_model=List[StatsProject])
def get_stats_projects(db: Session = Depends(get_db), skip: int = 0, limit: int = 100):
    return project.get_projects_stats(db, skip=skip, limit=limit)

@router.get("/length/", response_model=int)
def length_projects(db: Session = Depends(get_db), skip: int = 0, limit: int = 100):
    return project.get_projects_length(db, skip=skip, limit=limit)

@router.get("/project_informations/{project_id}", response_model=ProjectSheet)
def get_informations_project(project_id: int, db: Session = Depends(get_db)):
    return project.get_informations(db=db, id=project_id)


@router.get("/next_annotation/", response_model=FirstUntreated)
def get_first_untreated_file(project_id: int, db: Session = Depends(get_db)):
    return project.first_untreated_file(db=db, project_id=project_id)

@router.get("/fetch_project_thumbnail/{project_id}")
def fetch_project_thumbnail(
    project_id: int,
    db: Session = Depends(get_db)
):
    current_project = project.get_project(db=db, project_id=project_id)
    res = []
    new_f = current_project.dict()
    if current_project.image != None:
        url = s3.get_url(current_project.image)
        new_f["url"] = url
        res.append(new_f)
        return res
