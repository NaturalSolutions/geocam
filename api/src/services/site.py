from sqlmodel import Session

from src.models.site import SiteBase, Sites


def get_sites(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Sites).offset(skip).limit(limit).all()


def get_site(db: Session, site_id: int):
    return db.query(Sites).filter(Sites.id == site_id).first()


def get_site_by_name(db: Session, name_site: str):
    return db.query(Sites).filter(Sites.name == name_site).first()


def create_site(db: Session, site: SiteBase):
    db_site = Sites(**site.dict())
    db.add(db_site)
    db.commit()
    db.refresh(db_site)
    return db_site


def update_site(db: Session, site: SiteBase, id: int):
    db_site = db.query(Sites).filter(Sites.id == id).first()
    db_site.name = site.name
    db_site.description = site.description
    db_site.habitat = site.habitat
    db_site.latitude = site.latitude
    db_site.longitude = site.longitude
    db.commit()
    db.refresh(db_site)
    return db_site


def update_site_image(db: Session, id: int, image: str):
    db_site = db.query(Sites).filter(Sites.id == id).first()
    db_site.image = image
    db.commit()
    db.refresh(db_site)
    return db_site


def delete_site(db: Session, id: int):
    db_site = db.query(Sites).filter(Sites.id == id).first()
    db.delete(db_site)
    db.commit()
    return db_site
