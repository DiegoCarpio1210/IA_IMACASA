"""Servicio mock del checkpoint: exactamente dos rutas, sin inferencia."""
import os
import secrets
from datetime import datetime, timezone
from fastapi import FastAPI, Header, HTTPException

TOKEN = os.environ.get("API_TOKEN", "")
if not TOKEN:
    raise RuntimeError("Configura API_TOKEN antes de iniciar")
app = FastAPI(openapi_url=None, docs_url=None, redoc_url=None)

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/info")
def info(authorization: str = Header(default="")):
    scheme, _, value = authorization.partition(" ")
    if scheme.lower() != "bearer" or not secrets.compare_digest(value.encode(), TOKEN.encode()):
        raise HTTPException(401, "Credenciales ausentes o incorrectas", headers={"WWW-Authenticate": "Bearer"})
    return {"equipo": "Pimientero G2 — Equipo 01 (provisional)", "estacion": "PC08", "version": "1.0.0", "timestamp": datetime.now(timezone.utc).isoformat()}
