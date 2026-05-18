from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Create tables
from app.db.base import Base
from app.db.session import engine
Base.metadata.create_all(bind=engine)


# Set up CORS
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin).rstrip("/") for origin in settings.BACKEND_CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

@app.get("/api/health")
def health_check():
    return {"status": "ok", "message": "Backend is running!"}

from app.api.api import api_router
app.include_router(api_router, prefix=settings.API_V1_STR)

