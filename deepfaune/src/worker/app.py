from typing import List
from pydantic import UUID4, AnyHttpUrl
import logging

from celery import Celery, chord, shared_task

from src.core.config import settings
from src.worker.process import download_image
from src.worker.deepfaune import predict
from celery.result import allow_join_result

celery_app = Celery(
    settings.CELERY_APP, broker=settings.CELERY_BROKER, backend=settings.CELERY_BACKEND
)

# Need that otherwise: strategy = strategies[type_]\nKeyError:
@shared_task
def download_task(url: AnyHttpUrl):
    return download_image(url=url)

@celery_app.task()
def load_content(names):
    return predict(filenames=names)

@celery_app.task(name="deepfaune.pi")
def process_images(urls: List[AnyHttpUrl]) -> UUID4:
    res = chord((download_task.s(url) for url in urls), load_content.s()).apply_async()
    return res.id

def get_task_from_id(id_: UUID4):
    return celery_app.AsyncResult(str(id_))

@celery_app.task(name="deepfaune.gtfi")
def get_task_from_id2(id_: UUID4):
    res = get_task_from_id(id_)
    state = res.state
    value = None
    if state == "SUCCESS":
        with allow_join_result():
            value = res.get(timeout=1)
    return {"state": state, "value": value}
