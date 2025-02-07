import hashlib
import os
from datetime import datetime as dt
from pathlib import Path

from dateutil.relativedelta import relativedelta
from sqlmodel import Session, create_engine

import magic
from src.config import settings
from src.models.deployment import NewDeploymentWithTemplateSequence
from src.models.device import DeviceBase
from src.models.models import Roles
from src.models.project import ProjectBase
from src.models.site import SiteBase
from src.schemas.user import UserCreate
from src.services import deployment, device, files, project, site, user
from src.utils import file_as_bytes

DATABASE_URL = settings.DB_URL

engine = create_engine(DATABASE_URL, echo=True)

date = dt.today()


def init_db():
    with Session(engine) as session:
        role = Roles(role="user", description="default_user")
        session.add(role)
        session.commit()

        for curent_file in files.get_files(db=session):
            files.delete_file(db=session, id=curent_file.id)

        for curent_deployment in deployment.get_deployments(db=session):
            deployment.delete_deployment(db=session, id=curent_deployment.id)

        for curent_device in device.get_devices(db=session):
            device.delete_device(db=session, id=curent_device.id)

        for curent_site in site.get_sites(db=session):
            site.delete_site(db=session, id=curent_site.id)

        for curent_project in project.get_projects(db=session):
            project.delete_project(db=session, id=curent_project.id)

        for curent_user in user.get_users(db=session):
            user.delete_user(db=session, id=curent_user.id)

        project_example = project.create_project(
            db=session,
            project=ProjectBase(
                name="Demonstration project",
                protocol="The sampling protocol can be indicated in this field, but is not required.",
                creation_date=date,
                start_date=date,
                end_date=date + relativedelta(years=+1),
            ),
        )

        site_example = site.create_site(
            db=session,
            site=SiteBase(
                name="Natural Solutions Site",
                longitude=5.371927397059713,
                latitude=43.29208734554677,
                description="This site has been created to demonstrate the tool. Feel free to modify it or create your own!",
            ),
        )
        device_example = device.create_device(
            db=session,
            device=DeviceBase(
                name="Demonstration device",
                model="This field is used to indicate the model of the device used for the field survey.",
                purchase_date=date + relativedelta(months=-1),
                operating_life=2000,
                price=150,
                detection_area=1163,
                description="This site has been created to demonstrate the tool. Feel free to modify it or create your own!",
            ),
        )

        deployment_example = deployment.create_deployment(
            db=session,
            deployment=NewDeploymentWithTemplateSequence(
                name="Demonstration deployment",
                site_id=site_example.id,
                device_id=device_example.id,
                start_date=date,
                end_date=date + relativedelta(months=+3),
                support="This field indicates device support.",
                feature="This field indicates deployment feature.",
                height=50,
                bait="This field indicates bait used.",
                project_id=project_example.id,
                template_sequences=[],
                description="This deployment has been created to demonstrate the tool. Feel free to modify it or create your own!",
            ),
        )

        path = Path(__file__).parent.parent.parent
        img_dir = os.path.join(path, "img")

        if not os.path.isdir(img_dir):
            os.mkdir(img_dir)

        for filename_example in os.listdir(img_dir):
            with open(os.path.join(img_dir, filename_example), "rb") as f:
                file_content = f.read()
                f.seek(0)
                files.upload_file(
                    db=session,
                    hash=hashlib.sha256(file_content).hexdigest(),
                    ext=magic.from_buffer(file_content, mime=True),
                    filename=filename_example,
                    new_file=f,
                    deployment_id=deployment_example.id,
                )


# Dependency
def get_db():
    with Session(engine) as session:
        yield session
