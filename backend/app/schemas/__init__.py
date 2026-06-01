from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional
from datetime import datetime


# ============ PRODUCT SCHEMAS ============

class ProductCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    sku: str = Field(..., min_length=1, max_length=100)
    price: float = Field(..., gt=0)
    quantity: int = Field(..., ge=0)

    @validator('name')
    def name_must_not_be_empty(cls, v):
        if not v.strip():
            raise ValueError('Name cannot be empty')
        return v


class ProductUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    sku: Optional[str] = Field(None, min_length=1, max_length=100)
    price: Optional[float] = Field(None, gt=0)
    quantity: Optional[int] = Field(None, ge=0)


class ProductResponse(BaseModel):
    id: int
    name: str
    sku: str
    price: float
    quantity: int

    class Config:
        from_attributes = True


# ============ CUSTOMER SCHEMAS ============

class CustomerCreate(BaseModel):
    full_name: str = Field(..., min_length=1, max_length=255)
    email: EmailStr
    phone: str = Field(..., min_length=10, max_length=20)

    @validator('full_name')
    def full_name_must_not_be_empty(cls, v):
        if not v.strip():
            raise ValueError('Full name cannot be empty')
        return v


class CustomerUpdate(BaseModel):
    full_name: Optional[str] = Field(None, min_length=1, max_length=255)
    email: Optional[EmailStr] = None
    phone: Optional[str] = Field(None, min_length=10, max_length=20)


class CustomerResponse(BaseModel):
    id: int
    full_name: str
    email: str
    phone: str

    class Config:
        from_attributes = True


# ============ ORDER SCHEMAS ============

class OrderItemCreate(BaseModel):
    product_id: int = Field(..., gt=0)
    quantity: int = Field(..., gt=0)


class OrderCreate(BaseModel):
    customer_id: int = Field(..., gt=0)
    items: list[OrderItemCreate] = Field(..., min_items=1)


class OrderItemResponse(BaseModel):
    id: int
    order_id: int
    product_id: int
    quantity: int
    price: float

    class Config:
        from_attributes = True


class OrderResponse(BaseModel):
    id: int
    customer_id: int
    total_amount: float
    created_at: datetime
    items: list[OrderItemResponse] = []

    class Config:
        from_attributes = True
