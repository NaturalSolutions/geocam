from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session

from src.connectors import s3
from src.connectors.database import get_db
from src.models.site import SiteBase, Sites
from src.services import site

router = APIRouter(
    prefix="/sites",
    tags=["sites"],
    # dependencies=[Depends(get_token_header)],
    responses={404: {"description": "Not found"}},
)


@router.get("/", response_model=List[Sites])
def read_sites(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    sites = site.get_sites(db, skip=skip, limit=limit)
    return sites


@router.get("/length", response_model=int)
def length_sites(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    sites = len(site.get_sites(db, skip=skip, limit=limit))
    return sites


@router.get("/{site_id}", response_model=Sites)
def read_site(site_id: int, db: Session = Depends(get_db)):
    db_site = site.get_site(db, site_id=site_id)
    if db_site is None:
        raise HTTPException(status_code=404, detail="site not found")
    return db_site


@router.post("/", response_model=Sites)
def create_site(new_site: SiteBase, db: Session = Depends(get_db)):
    db_site = site.get_site_by_name(db, name_site=new_site.name)
    if db_site:
        raise HTTPException(status_code=400, detail="Name already registered")
    return site.create_site(db=db, site=new_site)


@router.put("/{site_id}", response_model=Sites)
def update_site(site_id: int, data_site: SiteBase, db: Session = Depends(get_db)):
    return site.update_site(db=db, site=data_site, id=site_id)


@router.delete("/{site_id}")
def delete_site(site_id: int, db: Session = Depends(get_db)):
    return site.delete_site(db=db, id=site_id)


@router.get("/fetch_site_thumbnail/{site_id}")
def fetch_site_thumbnail(site_id: int, db: Session = Depends(get_db)):
    print(site_id)
    current_site = site.get_site(db=db, site_id=site_id)
    res = []
    print(current_site)
    new_f = current_site.dict()
    if current_site.image != None:
        url = s3.get_url(current_site.image)
        new_f["url"] = url
        res.append(new_f)
        return res
