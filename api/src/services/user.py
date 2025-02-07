from sqlmodel import Session

from src.models import models

# import schemas.schemas
from src.schemas import user


def get_user(db: Session, user_id: int):
    return db.query(models.Users).filter(models.Users.id == user_id).first()


def get_user_by_email(db: Session, email: str):
    return db.query(models.Users).filter(models.Users.email == email).first()


def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Users).offset(skip).limit(limit).all()


def create_user(db: Session, user: user.UserCreate):
    fake_hashed_password = user.password + "notreallyhashed"
    db_user = models.Users(email=user.email, name=user.name, hashed_password=fake_hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def update_user(db: Session, user: user.User, id: int):
    db_user = db.query(models.Users).filter(models.Users.id == id).first()
    db_user.email = user.email
    db_user.name = user.name
    db_user.is_active = user.is_active
    db.commit()
    db.refresh(db_user)
    return db_user


def delete_user(db: Session, id: int):
    # db_user=models.Users.delete().where(models.User.c.id==user.id)
    # db.execute(db_user)
    db_user = db.query(models.Users).filter(models.Users.id == id).first()
    db.delete(db_user)
    db.commit()
    return db_user


# def get_items(db: Session, skip: int = 0, limit: int = 100):
#     return db.query(models.Item).offset(skip).limit(limit).all()


# def create_user_item(db: Session, item: schemas.ItemCreate, user_id: int):
#     db_item = models.Item(**item.dict(), owner_id=user_id)
#     db.add(db_item)
#     db.commit()
#     db.refresh(db_item)
#     return db_item
