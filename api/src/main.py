import os

from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.config import settings
from src.connectors.database import init_db
from src.connectors.s3 import get_bucket_name, init_bucket, remove_bucket
from src.keycloak.idp import idp
from src.routers import deployments, devices, files, home, projects, sites, templateSequences, users

ROOT_PATH = settings.API_ROOT_PATH

app = FastAPI(
    root_path=ROOT_PATH,
    swagger_ui_parameters={"persistAuthorization": True},
)  # dependencies=[Depends(get_query_token)]

USER_DEPENDS = Depends(idp.get_current_user())
app.include_router(users.router, dependencies=[USER_DEPENDS])
app.include_router(files.router, dependencies=[USER_DEPENDS])
app.include_router(projects.router, dependencies=[USER_DEPENDS])
app.include_router(deployments.router, dependencies=[USER_DEPENDS])
app.include_router(sites.router, dependencies=[USER_DEPENDS])
app.include_router(devices.router, dependencies=[USER_DEPENDS])
app.include_router(home.router, dependencies=[USER_DEPENDS])
app.include_router(templateSequences.router, dependencies=[USER_DEPENDS])

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
idp.add_swagger_config(app)


@app.get("/")
async def root():
    return {"message": "Hello Bigger Applications!"}


@app.on_event("startup")
def on_startup():
    init_bucket()

    is_demo_instance = os.environ.get("DEMO_INSTANCE", None) == "True"
    if is_demo_instance:
        init_db()
