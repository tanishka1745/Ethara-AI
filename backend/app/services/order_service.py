from sqlalchemy.orm import Session
from app.models.order import Order, OrderItem
from app.models.product import Product
from app.models.customer import Customer
from app.schemas import OrderCreate
from app.services.product_service import ProductService


class OrderService:
    @staticmethod
    def create_order(db: Session, order: OrderCreate):
        # Validate customer exists
        customer = db.query(Customer).filter(Customer.id == order.customer_id).first()
        if not customer:
            raise ValueError("Customer not found")

        # Validate and reserve stock
        total_amount = 0
        order_items_data = []

        for item in order.items:
            product = db.query(Product).filter(Product.id == item.product_id).first()
            if not product:
                raise ValueError(f"Product {item.product_id} not found")
            
            if product.quantity < item.quantity:
                raise ValueError(f"Insufficient stock for product {product.name}")
            
            order_items_data.append({
                'product': product,
                'quantity': item.quantity,
                'price': product.price
            })
            total_amount += product.price * item.quantity

        # Create order
        db_order = Order(
            customer_id=order.customer_id,
            total_amount=total_amount
        )
        db.add(db_order)
        db.flush()

        # Create order items and reduce stock
        for item_data in order_items_data:
            order_item = OrderItem(
                order_id=db_order.id,
                product_id=item_data['product'].id,
                quantity=item_data['quantity'],
                price=item_data['price']
            )
            db.add(order_item)
            
            # Reduce stock
            if not ProductService.reduce_stock(db, item_data['product'].id, item_data['quantity']):
                db.rollback()
                raise ValueError(f"Failed to reduce stock for product {item_data['product'].name}")

        db.commit()
        db.refresh(db_order)
        return db_order

    @staticmethod
    def get_order(db: Session, order_id: int):
        return db.query(Order).filter(Order.id == order_id).first()

    @staticmethod
    def get_orders(db: Session, skip: int = 0, limit: int = 100):
        return db.query(Order).offset(skip).limit(limit).all()

    @staticmethod
    def delete_order(db: Session, order_id: int):
        db_order = db.query(Order).filter(Order.id == order_id).first()
        if db_order:
            db.delete(db_order)
            db.commit()
            return True
        return False
