from typing import List

from fastapi_keycloak import KeycloakUser, OIDCUser
from src.keycloak.idp import idp


def get_user_group_id(user: OIDCUser) -> int:
    group_id = [group.id for group in idp.get_user_groups(user_id=user.sub)]
    if group_id:
        group_id = group_id[0]  # FIXME: if several groups per user...*
    return group_id or None


def get_user_mails() -> List[str]:
    users: KeycloakUser = idp.get_all_users()
    return [user.email for user in users if user.email]
