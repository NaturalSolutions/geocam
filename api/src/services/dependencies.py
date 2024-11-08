import hashlib

from fastapi.datastructures import UploadFile


def read_upload(upload: UploadFile) -> bytes:
    """
    Enables a file to be read then "rewind"
    Args:
        upload (UploadFile): Starlette UploadFile type
    Returns:
        bytes: content of the read file
    """

    file = upload.file
    file.seek(0)
    content = file.read()
    file.seek(0)
    return content


def generate_checksum(upload: UploadFile) -> str:
    contents = read_upload(upload)
    return generate_checksum_content(contents)

def generate_checksum_content(content: bytes) -> str:
    return hashlib.md5(content).hexdigest()
