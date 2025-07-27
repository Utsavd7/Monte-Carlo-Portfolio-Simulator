# backend/config.py
from pydantic_settings import BaseSettings
from functools import lru_cache
import os

class Settings(BaseSettings):
    polygon_api_key: str = ""
    backend_port: int = 8000
    redis_url: str = "redis://localhost:6379"
    
    class Config:
        env_file = ".env"
        env_file_encoding = 'utf-8'

@lru_cache()
def get_settings():
    settings = Settings()
    # Debug print
    print(f"API Key loaded: {'Yes' if settings.polygon_api_key else 'No'}")
    print(f"API Key length: {len(settings.polygon_api_key)}")
    return settings