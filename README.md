# Inventory Management System

A full-stack web application for managing inventory with a FastAPI backend, React frontend, and PostgreSQL database. Includes product management, customer management, and order processing with automatic inventory reduction.


## Quick Start


### Option 1: Using Docker Compose (Recommended)

```bash
# Clone the repository
git clone <your-repo-url>
cd inventory-management-system

# Create environment files
cp backend/.env.example backend/.env

# Start all services
docker-compose up -d

# Access the application
Frontend: http://localhost:3000
Backend API: http://localhost:8000
API Docs: http://localhost:8000/docs
Database: localhost:5432
```

### Option 2: Local Development

#### Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env

# Run migrations (if needed)
# alembic upgrade head

# Start the server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Create .env file
echo "REACT_APP_API_URL=http://localhost:8000" > .env

# Start development server
npm start
```

The application will be available at `http://localhost:3000`

## 📁 Project Structure

```
inventory-management-system/
│
├── backend/
│   ├── app/
│   │   ├── main.py                 # FastAPI application & route setup
│   │   ├── database.py             # Database connection & session
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   ├── product.py          # Product SQLAlchemy model
│   │   │   ├── customer.py         # Customer SQLAlchemy model
│   │   │   └── order.py            # Order & OrderItem models
│   │   ├── schemas/
│   │   │   └── __init__.py         # Pydantic validation schemas
│   │   ├── routes/
│   │   │   ├── product_routes.py   # Product CRUD endpoints
│   │   │   ├── customer_routes.py  # Customer CRUD endpoints
│   │   │   └── order_routes.py     # Order management endpoints
│   │   ├── services/
│   │   │   ├── product_service.py  # Product business logic
│   │   │   ├── customer_service.py # Customer business logic
│   │   │   └── order_service.py    # Order processing logic
│   │   ├── utils/
│   │   │   ├── __init__.py
│   │   │   └── exceptions.py       # Custom exceptions & error handling
│   │   └── config/
│   │
│   ├── requirements.txt             # Python dependencies
│   ├── Dockerfile                   # Multi-stage Docker build
│   ├── .dockerignore
│   ├── .env                         # Environment variables (local)
│   └── .env.example                 # Example environment file
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── client.js           # Axios API client
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx       # Dashboard with analytics
│   │   │   ├── ProductList.jsx     # View all products
│   │   │   ├── AddProduct.jsx      # Add new product form
│   │   │   ├── CustomerList.jsx    # View all customers
│   │   │   ├── AddCustomer.jsx     # Add new customer form
│   │   │   ├── OrderPage.jsx       # Create and manage orders
│   │   │   └── *.css               # Component stylesheets
│   │   ├── components/             # Reusable components
│   │   ├── hooks/                  # Custom React hooks
│   │   ├── context/                # React context providers
│   │   ├── App.js                  # Main app component with routing
│   │   └── App.css                 # Global styles
│   │
│   ├── package.json
│   ├── Dockerfile                  # Multi-stage Docker build
│   ├── .dockerignore
│   ├── .env                        # Frontend environment variables
│   └── public/
│
├── docker-compose.yml              # Multi-container orchestration
├── .gitignore
└── README.md                        # This file
```

## 🔌 API Endpoints

### Products

```
POST   /products                     # Create product
GET    /products                     # List products (paginated)
GET    /products/{id}               # Get product by ID
PUT    /products/{id}               # Update product
DELETE /products/{id}               # Delete product
```



## Validation & Business Logic

### Product Validation
- Name: Required, non-empty string (1-255 chars)
- SKU: Unique, required (1-100 chars)
- Price: Must be > 0
- Quantity: Must be >= 0

### Customer Validation
- Full Name: Required, non-empty (1-255 chars)
- Email: Valid email format, unique
- Phone: Required (10-20 characters)

### Order Validation
- Customer must exist in database
- All products must exist
- Stock availability check (prevents overselling)
- Automatic inventory reduction on order creation
- Total amount auto-calculated from product prices

**Business Logic Flow:**
1. Customer selects products and quantities
2. System validates customer existence
3. System checks stock availability for each product
4. If validation passes:
   - Order is created
   - Order items are added
   - Inventory is reduced for each product
   - Total amount is calculated
5. If validation fails, detailed error message is returned

## 🌍 Environment Variables

### Backend (.env)
```
# Database
DATABASE_URL=sqlite:///./test.db
# For PostgreSQL: postgresql://user:password@localhost:5432/inventory_db

# Application
SECRET_KEY=your-secret-key-here
DEBUG=True
ENVIRONMENT=development

# Server
HOST=0.0.0.0
PORT=8000

# Postgres (Docker)
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=inventory_db
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:8000
```

## 🐳 Docker Deployment

### Build and Run with Docker Compose

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db

# Stop services
docker-compose down

# Remove volumes (careful - deletes database)
docker-compose down -v
```

### Manual Docker Build

```bash
# Build backend image
cd backend
docker build -t inventory-backend:latest .
docker run -p 8000:8000 -e DATABASE_URL=sqlite:///./test.db inventory-backend:latest

# Build frontend image
cd frontend
docker build -t inventory-frontend:latest .
docker run -p 3000:3000 inventory-frontend:latest
```

## 🚢 Deployment

### Backend Deployment (Render/Railway)

1. Push code to GitHub
2. Create new Web Service on Render/Railway
3. Set environment variable:
   ```
   DATABASE_URL=postgresql://user:password@host/dbname
   ```
4. Deploy from GitHub

**Example Render Setup:**
- Build Command: `pip install -r requirements.txt`
- Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

### Frontend Deployment (Vercel/Netlify)

1. Push code to GitHub
2. Connect repository to Vercel/Netlify
3. Set build settings:
   - Build Command: `npm run build`
   - Publish Directory: `build`
4. Set environment variable:
   ```
   REACT_APP_API_URL=https://your-backend-url.com
   ```
5. Deploy

## 📊 Database Schema

### Products Table
```sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  sku VARCHAR(100) UNIQUE NOT NULL,
  price FLOAT NOT NULL,
  quantity INTEGER NOT NULL
);
```

### Customers Table
```sql
CREATE TABLE customers (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20) NOT NULL
);
```

### Orders Table
```sql
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER NOT NULL REFERENCES customers(id),
  total_amount FLOAT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Order Items Table
```sql
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(id),
  product_id INTEGER NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price FLOAT NOT NULL
);
```

## 🧪 Testing

Run tests with pytest:
```bash
cd backend
pytest

# With coverage
pytest --cov=app tests/
```

## 🔧 Development Commands

### Backend
```bash
# Format code
black app/

# Lint
flake8 app/

# Type checking
mypy app/

# Run tests
pytest
```

### Frontend
```bash
# Format code
npx prettier --write src/

# Lint
npm run lint

# Build for production
npm run build

# Test
npm test
```

## 📝 API Documentation

Once the backend is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

The API documentation is automatically generated from FastAPI docstrings.

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check Python version
python --version  # Should be 3.11+

# Check dependencies
pip install -r requirements.txt

# Check database connection
# Verify DATABASE_URL in .env
```

### Frontend won't start
```bash
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules
npm install

# Check Node version
node --version  # Should be 18+
```

### Docker issues
```bash
# Remove all containers and volumes
docker-compose down -v

# Rebuild images
docker-compose up --build

# Check logs
docker-compose logs -f
```

### Database connection errors
```bash
# Verify PostgreSQL is running
# Check connection string in .env
# Ensure database exists
# Reset database: docker-compose down -v
```

ScreenSort of APIs

<img width="919" height="439" alt="product-api-ss" src="https://github.com/user-attachments/assets/b6291c3c-8ddb-4c85-b9ae-2de41488946c" />
<img width="902" height="373" alt="customer-api-ss" src="https://github.com/user-attachments/assets/1a1b6da0-478b-4891-a3d2-f32de18aaa36" />
<img width="933" height="217" alt="docker" src="https://github.com/user-attachments/assets/bdc76612-04ec-45a9-a6c4-38c4522f446e" />


