from pydantic import AnyHttpUrl, BaseSettings, PostgresDsn

class Settings(BaseSettings):
    API_ROOT_PATH: str = "/api/v1"
    DB_URL: PostgresDsn = "postgresql://annotation:password@db/annotation"

    KEYCLOAK_ADMIN_CLIENT_SECRET: str = "YLhpMEhYeN8CpdWClLgWZetxUEPD2u03"
    KEYCLOAK_CALLBACK_URI: str = "http://api:8000/callback"
    KEYCLOAK_CLIENT_ID: str = "backend"
    KEYCLOAK_CLIENT_SECRET: str = "Rm414Jw6krdbjhjpmHDBxCkof7RjguS0"
    KEYCLOAK_REALM: str = "geonature-annotation"
    KEYCLOAK_SERVER_URL: str = "http://keycloak:8080/auth"
    KEYCLOAK_TOKEN_URI: str = (
        "http://keycloak:8080/auth/realms/geonature-annotation/protocol/openid-connect/token"
    )

    MINIO_ENTRYPOINT_URL: AnyHttpUrl = "http://localhost:9000"
    MINIO_ROOT_USER: str = "test"
    MINIO_ROOT_PASSWORD: str = "password"
    MINIO_BUCKET_NAME: str = "bucket"

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
