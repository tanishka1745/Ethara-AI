from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.models.product import Product
from app.schemas import ProductCreate, ProductUpdate


class ProductService:
    @staticmethod
    def create_product(db: Session, product: ProductCreate):
        try:
            db_product = Product(
                name=product.name,
                sku=product.sku,
                price=product.price,
                quantity=product.quantity
            )
            db.add(db_product)
            db.commit()
            db.refresh(db_product)
            return db_product
        except IntegrityError:
            db.rollback()
            raise ValueError("SKU already exists")

    @staticmethod
    def get_product(db: Session, product_id: int):
        return db.query(Product).filter(Product.id == product_id).first()

    @staticmethod
    def get_products(db: Session, skip: int = 0, limit: int = 100):
        return db.query(Product).offset(skip).limit(limit).all()

    @staticmethod
    def update_product(db: Session, product_id: int, product: ProductUpdate):
        db_product = db.query(Product).filter(Product.id == product_id).first()
        if not db_product:
            return None
        
        update_data = product.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_product, field, value)
        
        try:
            db.commit()
            db.refresh(db_product)
            return db_product
        except IntegrityError:
            db.rollback()
            raise ValueError("SKU already exists")

    @staticmethod
    def delete_product(db: Session, product_id: int):
        db_product = db.query(Product).filter(Product.id == product_id).first()
        if db_product:
            db.delete(db_product)
            db.commit()
            return True
        return False

    @staticmethod
    def reduce_stock(db: Session, product_id: int, quantity: int):
        db_product = db.query(Product).filter(Product.id == product_id).first()
        if not db_product:
            return False
        if db_product.quantity < quantity:
            return False
        db_product.quantity -= quantity
        db.commit()
        return True
