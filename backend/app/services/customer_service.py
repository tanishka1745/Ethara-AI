from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.models.customer import Customer
from app.schemas import CustomerCreate, CustomerUpdate


class CustomerService:
    @staticmethod
    def create_customer(db: Session, customer: CustomerCreate):
        try:
            db_customer = Customer(
                full_name=customer.full_name,
                email=customer.email,
                phone=customer.phone
            )
            db.add(db_customer)
            db.commit()
            db.refresh(db_customer)
            return db_customer
        except IntegrityError:
            db.rollback()
            raise ValueError("Email already exists")

    @staticmethod
    def get_customer(db: Session, customer_id: int):
        return db.query(Customer).filter(Customer.id == customer_id).first()

    @staticmethod
    def get_customers(db: Session, skip: int = 0, limit: int = 100):
        return db.query(Customer).offset(skip).limit(limit).all()

    @staticmethod
    def update_customer(db: Session, customer_id: int, customer: CustomerUpdate):
        db_customer = db.query(Customer).filter(Customer.id == customer_id).first()
        if not db_customer:
            return None
        
        update_data = customer.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_customer, field, value)
        
        try:
            db.commit()
            db.refresh(db_customer)
            return db_customer
        except IntegrityError:
            db.rollback()
            raise ValueError("Email already exists")

    @staticmethod
    def delete_customer(db: Session, customer_id: int):
        db_customer = db.query(Customer).filter(Customer.id == customer_id).first()
        if db_customer:
            db.delete(db_customer)
            db.commit()
            return True
        return False
