from datetime import datetime
import tempfile

from fastapi import HTTPException
from sqlalchemy import desc

from sqlmodel import Session
from src.config import settings
from src.models.device import DeviceBase, Devices
from src.models.file import Files
from src.services import deployment


def get_devices(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Devices).order_by(Devices.name).offset(skip).limit(limit).all()


def get_device(db: Session, device_id: int):
    return db.query(Devices).filter(Devices.id == device_id).first()


def get_device_by_name(db: Session, name_device: str):
    return db.query(Devices).filter(Devices.name == name_device).first()


def create_device(db: Session, device: DeviceBase):
    db_device = Devices(**device.dict())
    db.add(db_device)
    db.commit()
    db.refresh(db_device)
    return db_device


def update_device(db: Session, device: DeviceBase, id: int):
    db_device = db.query(Devices).filter(Devices.id == id).first()
    db_device.name = device.name
    db_device.description = device.description
    db_device.status = device.status
    db_device.model = device.model
    db_device.purchase_date = device.purchase_date
    db_device.price = device.price
    db_device.detection_area = device.detection_area
    db_device.operating_life = device.operating_life
    db.commit()
    db.refresh(db_device)
    return db_device


def upload_image_device_id(db: Session, device_hash: str, id: int):
    db_device = db.query(Devices).filter(Devices.id == id).first()
    db_device.image = device_hash
    db.commit()
    db.refresh(db_device)
    return db_device


def delete_image_device_id(db: Session, id: int):
    db_device = db.query(Devices).filter(Devices.id == id).first()
    db_device.image = ""
    db.commit()
    db.refresh(db_device)
    return db_device


def delete_device(db: Session, id: int):
    db_device = db.query(Devices).filter(Devices.id == id).first()
    db.delete(db_device)
    db.commit()
    return db_device


def get_menu_devices(db: Session, skip: int = 0, limit: int = 100):
    current_date = datetime.now()
    db_devices = db.query(Devices).order_by(Devices.id).offset(skip).limit(limit).all()
    devices = []
    for d in db_devices:
        device = d.dict()
        deployments = deployment.get_device_deployments(
            db=db, device_id=d.id, skip=skip, limit=limit
        )
        deployment_list = []
        for deploy in deployments:
            deployment_list.append(deploy.id)
            if current_date >= deploy.start_date:
                if deploy.end_date is None or current_date <= deploy.end_date:  # provisoire
                    device["status"] = "Déployé"
        nb_images = db.query(Files).filter(Files.deployment_id.in_(deployment_list)).count()
        if nb_images > 0:
            last_image = (
                db.query(Files)
                .filter(Files.deployment_id.in_(deployment_list))
                .order_by(desc(Files.date))
                .first()
            )
            last_image_date = last_image.date
            device["last_image_date"] = last_image_date
        device["nb_images"] = nb_images
        devices.append(device)
    return devices
