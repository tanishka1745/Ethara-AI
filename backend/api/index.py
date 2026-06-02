"""
Vercel ASGI entrypoint for the Inventory Management System FastAPI app.

Vercel's Python runtime expects a WSGI/ASGI handler at api/index.py.
Mangum wraps the FastAPI (ASGI) app to make it Lambda/Vercel-compatible.
"""
import sys
import os

# Ensure the backend root is on the Python path so `app.*` imports work
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from dotenv import load_dotenv
load_dotenv()

from app.main import app  # noqa: E402 — must be after sys.path fix
from mangum import Mangum

# Mangum wraps the ASGI app for AWS Lambda / Vercel serverless
handler = Mangum(app, lifespan="off")
