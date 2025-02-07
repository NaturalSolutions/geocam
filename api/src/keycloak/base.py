import functools

from fastapi.security import OAuth2PasswordBearer

from fastapi_keycloak import FastAPIKeycloak


class Keycloak(FastAPIKeycloak):
    def __init__(self, token_uri, **kwargs) -> None:
        self._token_uri = token_uri
        super().__init__(**kwargs)

    @functools.cached_property
    def user_auth_scheme(self) -> OAuth2PasswordBearer:
        """Returns the auth scheme to register the endpoints with swagger
        Returns:
            OAuth2PasswordBearer: Auth scheme for swagger
        """
        return OAuth2PasswordBearer(tokenUrl=self._token_uri)
