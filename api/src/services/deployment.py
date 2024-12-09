from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import joinedload
from sqlmodel import Session

from src.models.deployment import (
    Deployments,
    DeploymentWithTemplateSequence,
    NewDeploymentWithTemplateSequence,
)
from src.models.models import TemplateSequence
from src.services import files

def get_deployments(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Deployments).offset(skip).limit(limit).all()


def get_deployments_files(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Deployments).options(joinedload("files")).offset(skip).limit(limit).all()


def get_deployment(db: Session, deployment_id: int):
    return db.query(Deployments).filter(Deployments.id == deployment_id).first()


def get_deployment_by_name(db: Session, name_deployment: str):
    return db.query(Deployments).filter(Deployments.name == name_deployment).first()


def create_deployment(db: Session, deployment: NewDeploymentWithTemplateSequence):
    field = "template_sequences"
    create_data = deployment.dict()
    tmp_deployment = {**create_data, field: []}

    for template in create_data[field]:
        if "id" in template and template["id"] is not None:
            existing_template = (
                db.query(TemplateSequence).filter(TemplateSequence.id == template["id"]).one()
            )
            tmp_deployment[field].append(existing_template)
        if "id" in template and template["id"] is None:
            tmp_deployment[field].append(TemplateSequence(**template))

    db_deployment = Deployments(**tmp_deployment)
    db.add(db_deployment)
    db.commit()
    db.refresh(db_deployment)
    return db_deployment


def update_deployment(db: Session, deployment: DeploymentWithTemplateSequence):
    db_deployment = db.query(Deployments).filter(Deployments.id == deployment.id).first()

    obj_data = jsonable_encoder(db_deployment)
    update_data = deployment.dict()
    for field in update_data:
        if field in obj_data:
            setattr(db_deployment, field, update_data[field])
        if field == "template_sequences" and update_data[field] is not None:
            db_deployment.template_sequences = []

            for template in update_data[field]:
                if "id" in template and template["id"] is not None:
                    existing_template = (
                        db.query(TemplateSequence)
                        .filter(TemplateSequence.id == template["id"])
                        .one()
                    )
                    db_deployment.template_sequences.append(existing_template)
                if "id" in template and template["id"] is None:
                    db_deployment.template_sequences.append(TemplateSequence(**template))

    db.commit()
    db.refresh(db_deployment)
    return db_deployment

def update_image_deployment(db: Session, deployment_id: int, image: str):
    db_deployment = db.query(Deployments).filter(Deployments.id == deployment_id).first()
    db_deployment.image = image
    db.commit()
    db.refresh(db_deployment)
    return db_deployment

def delete_image_deployment_id(db: Session, id: int):
    db_deployment = db.query(Deployments).filter(Deployments.id == id).first()
    db_deployment.image = ""
    db.commit()
    db.refresh(db_deployment)
    return db_deployment 

def delete_deployment(db: Session, id: int):
    db_files_deployment = files.deleteAllFilesDeployment(db=db, id=id)
    db_deployment = db.query(Deployments).filter(Deployments.id == id).first()
    db.delete(db_deployment)
    db.commit()
    return db_deployment


def get_project_deployments(db: Session, id: int):
    return (
        db.query(Deployments)
        .filter(Deployments.project_id == id)
        .options(joinedload("files"))
        .order_by(Deployments.start_date)
        .all()
    )


def get_device_deployments(db: Session, device_id: int, skip: int = 0, limit: int = 100):
    return (
        db.query(Deployments)
        .filter(Deployments.device_id == device_id)
        .offset(skip)
        .limit(limit)
        .all()
    )
