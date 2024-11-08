


class Settings():
    ROOT_PATH = "/deepfaune"
    HOST = None
    CELERY_BROKER = "redis://:broker_pwd@broker/0"
    CELERY_BACKEND = "redis://:broker_pwd@broker/0"
    CELERY_APP = "deepfaune"

settings = Settings()
