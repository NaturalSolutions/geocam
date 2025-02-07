# Service projet
from datetime import datetime
from typing import List

from sqlalchemy.orm import joinedload
from sqlmodel import Session

from src.models.file import Files
from src.models.project import ProjectBase, Projects
from src.schemas.schemas import FirstUntreated, StatsProject
from src.services import deployment
from src.connectors import s3


def get_projects(db: Session, skip: int = 0, limit: int = 100):
    return (
        db.query(Projects)
        .options(joinedload("deployments").options(joinedload("files")))
        .order_by(Projects.creation_date.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


def get_projects_length(db: Session, skip: int = 0, limit: int = 100):
    return len(db.query(Projects).offset(skip).limit(limit).all())


def get_project(db: Session, project_id: int):
    return db.query(Projects).filter(Projects.id == project_id).first()


def get_project_by_name(db: Session, name_project: str):
    return db.query(Projects).filter(Projects.name == name_project).first()


def create_project(db: Session, project: ProjectBase):
    db_project = Projects(**project.dict())
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project


def update_project(db: Session, project: ProjectBase, id: int):
    db_project = db.query(Projects).filter(Projects.id == id).first()
    db_project.name = project.name
    db_project.creation_date = project.creation_date
    db_project.start_date = project.start_date
    db_project.end_date = project.end_date
    db_project.protocol = project.protocol
    db_project.acquisition_framework = project.acquisition_framework
    db_project.targeted_species = project.targeted_species
    db_project.referential = project.referential
    db_project.timezone = project.timezone
    db_project.image = project.image
    db_project.owner_id = project.owner_id
    db_project.contact_id = project.contact_id
    db.commit()
    db.refresh(db_project)
    return db_project


def update_project_image(db: Session, file_name: str, project_id: int):
    db_project = db.query(Projects).filter(Projects.id == project_id).first()
    db_project.image = file_name
    db.commit()
    db.refresh(db_project)
    return db_project


def delete_image_project_id(db: Session, id: int):
    db_project = db.query(Projects).filter(Projects.id == id).first()
    db_project.image = ""
    db.commit()
    db.refresh(db_project)
    return db_project


def delete_project(db: Session, id: int):
    db_project = db.query(Projects).filter(Projects.id == id).first()
    db.delete(db_project)
    db.commit()
    return db_project


def number_treated_media(files: List[Files]):
    nb = 0
    for f in files:
        if f.treated == True:
            nb += 1
    return nb


def annotation_percentage_project(nb_media: int, nb_treated_media: int):
    if nb_treated_media != 0:
        return round((nb_treated_media / nb_media) * 100, 2)
    else:
        return 0


def get_informations(db: Session, id: int):
    project = (
        db.query(Projects)
        .filter(Projects.id == id)
        .options(joinedload("deployments").options(joinedload("files")))
        .first()
    )
    media_number = 0
    nb_treated_media = 0
    deploys = []
    print("IIIICIII", project.deployments)
    for d in project.deployments:
        media_number += len(d.files)
        deploys.append(d.dict())
        nb_treated_media += number_treated_media(d.files)

    project_data = project.dict()
    project_data["deployments"] = deploys

    annotation_percentage = annotation_percentage_project(media_number, nb_treated_media)
    project_data["stats"] = {
        "media_number": media_number,
        "annotation_percentage": annotation_percentage,
    }
    return project_data


def get_projects_stats(db: Session, skip: int = 0, limit: int = 100):
    projects_and_deployments_and_images = get_projects(db, skip, limit)
    current_date = datetime.now().date()

    result = []
    for project in projects_and_deployments_and_images:
        id = project.id
        name = project.name
        start_date = project.start_date
        end_date = project.end_date
        targeted_species = project.targeted_species
        deployment_number = len(project.deployments)
        unique_site = []
        site_number = 0
        unique_device = []
        device_number = 0
        media_number = 0
        nb_treated_media = 0
        if project.image != None:
            url = s3.get_url(project.image)
        else:
            url = project.image

        for deployment in project.deployments:
            if deployment.site_id not in unique_site:
                unique_site.append(deployment.site_id)
                site_number += 1
            if deployment.device_id not in unique_device:
                unique_device.append(deployment.device_id)
                device_number += 1
            media_number += len(deployment.files)
            nb_treated_media += number_treated_media(deployment.files)
        # TO ADD annotation%
        annotation_percentage = annotation_percentage_project(media_number, nb_treated_media)

        status = ""
        if start_date is None or end_date is None:
            status = "Inconnu"
        elif current_date < start_date:
            status = "A venir"
        elif current_date <= end_date:
            status = "En cours"
        elif annotation_percentage < 100:
            status = "A annoter"
        else:
            status = "Terminé"

        stats = StatsProject(
            id=id,
            name=name,
            start_date=start_date,
            end_date=end_date,
            status=status,
            media_number=media_number,
            deployment_number=deployment_number,
            site_number=site_number,
            device_number=device_number,
            targeted_species=targeted_species,
            annotation_percentage=annotation_percentage,
            url=url,
        )
        result.append(stats.dict())
    return result


def first_untreated_file(db: Session, project_id: int):
    deploys = deployment.get_project_deployments(db=db, id=project_id)
    untreated = False
    d = 0
    while untreated == False and d < len(deploys):
        f = 0
        files = deploys[d].files
        print(len(files))
        while untreated == False and f < len(files):
            file = files[f]
            if file.treated == False:
                first_file = str(file.id)
                print(file.id)
                deploy = deploys[d].id
                print(deploy)
                untreated = True
            f += 1
        d += 1
    return FirstUntreated(file_id=first_file, deploy_id=deploy)
