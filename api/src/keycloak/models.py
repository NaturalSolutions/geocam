from typing import List

from pydantic import BaseModel

from fastapi_keycloak import KeycloakGroup, OIDCUser


class UserGroup(BaseModel):
    user: OIDCUser
    groups: List[KeycloakGroup]
