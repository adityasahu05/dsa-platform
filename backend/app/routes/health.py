"""
Health Check Route
Simple endpoint to verify server is running
"""

from fastapi import APIRouter
from datetime import datetime

router = APIRouter()


@router.get("/ping")
async def health_check():
    """
    Health check endpoint
    Returns server status and timestamp
    """
    return {
        "status": "ok",
        "message": "pong",
        "timestamp": datetime.utcnow().isoformat(),
        "service": "DSA Coding Assessment Platform"
    }