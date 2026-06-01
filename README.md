# Inventory Management System

A full-stack web application for managing inventory with a FastAPI backend and React frontend.

## Project Structure

```
inventory-management-system/
├── backend/          # FastAPI backend application
├── frontend/         # React frontend application
└── docker-compose.yml # Docker Compose configuration
```

## Prerequisites

- Docker and Docker Compose
- Python 3.11+ (for local development)
- Node.js 18+ (for local development)

## Getting Started

### Using Docker Compose

```bash
docker-compose up
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

### Local Development

#### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn app.main:app --reload
```

#### Frontend

```bash
cd frontend
npm install
npm start
```

## Features

- Inventory tracking
- Product management
- Stock monitoring
- RESTful API
- Responsive UI

## Environment Variables

Create a `.env` file in the backend directory:

```
DATABASE_URL=postgresql://user:password@localhost:5432/inventory_db
SECRET_KEY=your-secret-key
DEBUG=False
ENVIRONMENT=production
```

## License

MIT License
