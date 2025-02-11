from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session

from src.connectors.database import get_db
from src.models.deployment import (
    Deployments,
    DeploymentWithFile,
    DeploymentWithTemplateSequence,
    NewDeploymentWithTemplateSequence,
    ReadDeployment,
)
from src.services import deployment
from src.connectors import s3

router = APIRouter(
    prefix="/deployments",
    tags=["deployments"],
    # dependencies=[Depends(get_token_header)],
    responses={404: {"description": "Not found"}},
)


@router.get("/", response_model=List[Deployments])
def read_deployments(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    deployments = deployment.get_deployments(db, skip=skip, limit=limit)
    return deployments


@router.get("/{deployment_id}", response_model=Deployments)
def read_deployment(deployment_id: int, db: Session = Depends(get_db)):
    db_deployment = deployment.get_deployment(db, deployment_id=deployment_id)
    if db_deployment is None:
        raise HTTPException(status_code=404, detail="Deployment not found")
    return db_deployment


@router.post("/", response_model=Deployments)
def create_deployment(
    new_deployment: NewDeploymentWithTemplateSequence, db: Session = Depends(get_db)
):
    db_deployment = deployment.get_deployment_by_name(db, name_deployment=new_deployment.name)
    if db_deployment:
        raise HTTPException(status_code=400, detail="Name already registered")
    return deployment.create_deployment(db=db, deployment=new_deployment)


@router.put("/{deployment_id}", response_model=DeploymentWithTemplateSequence)
def update_deployment(
    data_deployment: DeploymentWithTemplateSequence,
    db: Session = Depends(get_db),
):
    return deployment.update_deployment(db=db, deployment=data_deployment)


@router.delete("/{deployment_id}", response_model=Deployments)
def delete_deployment(deployment_id: int, db: Session = Depends(get_db)):
    return deployment.delete_deployment(db=db, id=deployment_id)


@router.get("/project/{project_id}", response_model=List[Deployments])
def read_project_deployments(project_id: int, db: Session = Depends(get_db)):
    return deployment.get_project_deployments(db=db, id=project_id)


@router.get("/files/", response_model=List[DeploymentWithFile])
def read_deployments_with_files(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    deployments = deployment.get_deployments_files(db, skip=skip, limit=limit)
    return deployments


@router.get("/template_sequence/", response_model=List[DeploymentWithTemplateSequence])
def read_deployments_with_template_sequence(
    skip: int = 0, limit: int = 100, db: Session = Depends(get_db)
):
    deployments = deployment.get_deployments(db, skip=skip, limit=limit)
    return deployments


@router.get("/device/{device_id}", response_model=List[ReadDeployment])
def read_device_deployments(
    device_id: int, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)
):
    return deployment.get_device_deployments(db=db, device_id=device_id, skip=skip, limit=limit)


@router.get("/fetch_deployment_thumbnail/{deployment_id}")
def fetch_deployment_thumbnail(deployment_id: int, db: Session = Depends(get_db)):
    current_deployment = deployment.get_deployment(db=db, deployment_id=deployment_id)
    res = []
    new_f = current_deployment.dict()
    if current_deployment.image != None:
        url = s3.get_url(current_deployment.image)
        new_f["url"] = url
        res.append(new_f)
        return res
