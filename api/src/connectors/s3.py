import io
from typing import Optional

import boto3
from botocore.client import Config
from botocore.exceptions import ClientError

from src.config import settings

MINIO_ENTRYPOINT_URL = settings.MINIO_ENTRYPOINT_URL
MINIO_ROOT_USER = settings.MINIO_ROOT_USER
MINIO_ROOT_PASSWORD = settings.MINIO_ROOT_PASSWORD
MINIO_BUCKET_NAME = settings.MINIO_BUCKET_NAME

config_dict = {
    "endpoint_url": "http://minio:9000",
    "aws_access_key_id": MINIO_ROOT_USER,
    "aws_secret_access_key": MINIO_ROOT_PASSWORD,
    "config": Config(
        signature_version="s3v4",
    ),
    "region_name": "fr",
}

config_dict_client = {
    "endpoint_url": MINIO_ENTRYPOINT_URL,
    "aws_access_key_id": MINIO_ROOT_USER,
    "aws_secret_access_key": MINIO_ROOT_PASSWORD,
    "config": Config(
        signature_version="s3v4",
        proxies={"http": "http://ecosecrets_minio:9000"},
    ),
    "region_name": "fr",
}

s3 = boto3.resource("s3", **config_dict)
s3_client = boto3.client("s3", **config_dict_client)


def get_bucket_name():
    return MINIO_BUCKET_NAME


def init_bucket():
    bucket = get_bucket_name()
    s3_bucket = s3.Bucket(bucket)
    if s3_bucket not in s3.buckets.all():
        s3.create_bucket(Bucket=bucket)


def remove_bucket(bucket_name: str):
    if s3.Bucket(bucket_name) in s3.buckets.all():
        bucket = s3.Bucket(bucket_name)
        # suggested by Jordon Philips
        bucket.objects.all().delete()
        bucket.delete()


def upload_file_obj(file_obj, filename: str, metadata: Optional[dict] = None):
    extra_args = None
    if metadata is not None:
        extra_args = {"Metadata": metadata}
    return s3.Bucket(get_bucket_name()).upload_fileobj(file_obj, filename, ExtraArgs=extra_args)


def download_file_obj(filename: str):
    file_io = io.BytesIO()
    try:
        s3.Bucket(get_bucket_name()).download_fileobj(filename, file_io)
    except ClientError as error:
        if error.response["Error"]["Code"] == "404":
            raise FileNotFoundError("File not found") from error
        raise
    file_io.seek(0)
    return file_io


def get_obj(filename: str):
    return s3.Object(get_bucket_name(), filename).get()


def get_url(filename: str, expiration: float = 3600):
    url = s3_client.generate_presigned_url(
        "get_object",
        Params={"Bucket": get_bucket_name(), "Key": filename},
        ExpiresIn=expiration,
    )
    return url


def delete_file_obj(filename: str):
    obj = s3.Object(get_bucket_name(), filename)
    return obj.delete()
