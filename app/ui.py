"""UI y RBAC separados de la API mock de dos endpoints."""
import os
from pathlib import Path
from contextlib import asynccontextmanager
import httpx
from fastapi import FastAPI, Request
from fastapi.responses import Response, JSONResponse
from fastapi.staticfiles import StaticFiles
from . import store
from .rbac import router
ROOT=Path(__file__).parent
API=os.environ.get('API_URL','http://127.0.0.1:8000')
@asynccontextmanager
async def lifespan(app):
    store.migrate()
    yield
app=FastAPI(openapi_url=None,docs_url=None,redoc_url=None,lifespan=lifespan)
app.mount('/static',StaticFiles(directory=ROOT/'static'),name='static')
app.include_router(router)
@app.middleware("http")
async def headers(request, call_next):
    response = await call_next(request)
    response.headers["Cache-Control"] = "no-store"
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "same-origin"
    response.headers["Content-Security-Policy"] = "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'"
    return response

@app.get("/health")
@app.get("/info")
async def proxy(request: Request):
    # Forward authorization unchanged. Never inject a valid token on behalf of visitors.
    try:
        async with httpx.AsyncClient(timeout=5) as client:
            response = await client.get(API+request.url.path, headers={"Authorization": request.headers.get("authorization", "")})
        h = {"WWW-Authenticate": response.headers["www-authenticate"]} if "www-authenticate" in response.headers else {}
        return Response(response.content, status_code=response.status_code, media_type="application/json", headers=h)
    except httpx.HTTPError:
        return JSONResponse({"detail": "API no disponible"}, status_code=502)
