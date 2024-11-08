from typing import List
from pydantic import UUID4
from fastapi import APIRouter

from src.models.image import Image
from src.worker.app import process_images, get_task_from_id

router = APIRouter()

@router.post("/compute")
async def compute_images(images: List[Image]):
    id_ = process_images(urls=[image.path for image in images])
    return {"id": id_}

@router.get("/result/{task_id}")
async def get_result(task_id: UUID4):
    res = get_task_from_id(id_=task_id)
    state = res.state
    value = None
    if state == "SUCCESS":
        value = res.get(timeout=1)
    return {"state": res.state, "value": value}
