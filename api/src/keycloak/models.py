from typing import List

from fastapi_keycloak import KeycloakGroup, OIDCUser
from pydantic import BaseModel


class UserGroup(BaseModel):
    user: OIDCUser
    groups: List[KeycloakGroup]
