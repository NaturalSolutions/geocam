from fastapi import APIRouter

from src.api.v1 import annotations

api_router = APIRouter()
api_router.include_router(annotations.router, tags=["deepfaune"])
