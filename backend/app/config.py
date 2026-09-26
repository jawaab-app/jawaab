from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    database_url: str = "postgresql+psycopg://jawaab:jawaab@localhost:5432/jawaab"
    redis_url: str = "redis://localhost:6379/0"

    jwt_secret: str = "dev-secret-change-me-this-is-only-for-local-development"
    jwt_access_ttl_min: int = 30
    jwt_refresh_ttl_days: int = 30
    jwt_algorithm: str = "HS256"

    google_client_id: str = ""
    apple_client_id: str = ""
    apple_issuer: str = "https://appleid.apple.com"

    public_cache_ttl: int = 86400
    api_domain: str = ""

    supabase_url: str = ""
    supabase_service_key: str = ""


@lru_cache
def get_settings() -> Settings:
    return Settings()
