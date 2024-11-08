from fastapi import FastAPI

from src.api.v1.api import api_router
from src.core.config import settings
from src.worker.app import celery_app as app

if __name__ == '__main__':
    args = ['worker', '--loglevel=DEBUG']
    app.worker_main(argv=args)

# app = FastAPI(
#     root_path=settings.ROOT_PATH,
#     openapi_url="/deepfaune/openapi.json",
#     swagger_ui_parameters={"persistAuthorization": True},
#     docs_url="/deepfaune/docs", 
#     redoc_url=None
# )
# app.include_router(api_router)

