# Inventory Management System

Inventory management application with FastAPI backend, React frontend, and PostgreSQL database.

## 🚀 Live Deployments (Vercel)
- **Frontend App:** [https://frontend-green-chi-18.vercel.app](https://frontend-green-chi-18.vercel.app)
- **Backend API:** [https://backend-smoky-ten-12.vercel.app](https://backend-smoky-ten-12.vercel.app)
- **API Documentation (Swagger UI):** [https://backend-smoky-ten-12.vercel.app/docs](https://backend-smoky-ten-12.vercel.app/docs)

---

## 🚀 Quick Start

### Docker (Recommended)
```bash
git clone <repo-url> && cd inventory-management-system
cp .env.example .env
docker-compose up -d
docker-compose exec backend python -m app.init_db
```

Access:
- Frontend: http://localhost:3000
- API Docs: http://localhost:8000/docs

### Local Setup
```bash
# Backend
cd backend && python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt && python -m app.init_db
uvicorn app.main:app --reload

# Frontend (new terminal)
cd frontend && npm install && npm start
```

---

## 🔧 Commands

```bash
docker-compose logs -f backend     # View logs
docker-compose down                # Stop services
docker-compose down -v             # Stop & delete data
docker-compose exec db psql -U postgres -d inventory_db  # Database shell
```

---

## 📚 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /products | Create product |
| GET | /products | List products |
| GET | /products/{id} | Get product |
| PUT | /products/{id} | Update product |
| DELETE | /products/{id} | Delete product |
| POST | /customers | Create customer |
| GET | /customers | List customers |
| GET | /customers/{id} | Get customer |
| PUT | /customers/{id} | Update customer |
| DELETE | /customers/{id} | Delete customer |
| POST | /orders | Create order |
| GET | /orders | List orders |
| GET | /orders/{id} | Get order |
| DELETE | /orders/{id} | Delete order |

---

## 📝 Examples

### Create Product
```bash
curl -X POST "http://localhost:8000/products/" \
  -H "Content-Type: application/json" \
  -d '{"name":"Laptop","sku":"LAP-001","price":999.99,"quantity":50}'
```

### Create Customer
```bash
curl -X POST "http://localhost:8000/customers/" \
  -H "Content-Type: application/json" \
  -d '{"full_name":"John Doe","email":"john@example.com","phone":"1234567890"}'
```

### Create Order
```bash
curl -X POST "http://localhost:8000/orders/" \
  -H "Content-Type: application/json" \
  -d '{"customer_id":1,"items":[{"product_id":1,"quantity":2}]}'
```

---

## ⚙️ Environment

```bash
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=inventory_db
ENVIRONMENT=development
DEBUG=True
REACT_APP_API_URL=http://localhost:8000
```

---

## 🐛 Troubleshooting

```bash
# Check logs
docker-compose logs backend

# Reinitialize database
docker-compose exec backend python -m app.init_db

# Fresh restart
docker-compose down -v && docker-compose up -d && docker-compose exec backend python -m app.init_db
```

---

📖 API Docs: **http://localhost:8000/docs**

