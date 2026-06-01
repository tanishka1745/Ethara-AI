"""
Initialize database tables
Run this script to create all tables in the database
"""
from app.database import engine
from app.models.product import Product
from app.models.customer import Customer
from app.models.order import Order
from app.database import Base

# Create all tables
Base.metadata.create_all(bind=engine)
print("✓ Database tables created successfully!")
