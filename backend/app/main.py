"""
Main application file for Inventory Management System
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import product_routes, customer_routes, order_routes

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
