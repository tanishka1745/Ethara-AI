"""
Main application file for Inventory Management System
"""
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import ValidationError
from app.routes import product_routes, customer_routes, order_routes
from app.utils.exceptions import InventoryException, handle_inventory_exception

app = FastAPI(
    title="Inventory Management System",
    description="Full-stack inventory management API",
    version="1.0.0"
)

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global exception handlers
@app.exception_handler(InventoryException)
async def inventory_exception_handler(request: Request, exc: InventoryException):
    return JSONResponse(
        status_code=400,
        content={"detail": str(exc.message)},
    )

@app.exception_handler(ValidationError)
async def validation_exception_handler(request: Request, exc: ValidationError):
    return JSONResponse(
        status_code=422,
        content={"detail": exc.errors()},
    )

# Include routers
app.include_router(product_routes.router)
app.include_router(customer_routes.router)
app.include_router(order_routes.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to Inventory Management System API"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
