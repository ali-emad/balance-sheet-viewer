# Balance Sheet Viewer

A web application for viewing Xero balance sheet reports, built with React and FastAPI.

## Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)
- Python 3.11+ (for local development)

## Quick Start with Docker

1. Clone the repository:

   ```bash
   git clone [your-repo-url]
   cd balance-sheet-viewer
   ```

2. Start all services:

   ```bash
   docker-compose up --build
   ```

3. Access the application:
   - Frontend: http://localhost:3001
   - Backend API: http://localhost:4000
   - Mock API: http://localhost:3000

## Local Development Setup

### Backend

1. Set up Python environment:

   ```bash
   cd backend
   python -m venv venv

   # Windows
   .\venv\Scripts\activate

   # Unix/MacOS
   source venv/bin/activate
   ```

2. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

3. Start the backend server:
   ```bash
   uvicorn app.main:app --reload --port 4000
   ```

### Frontend

1. Install dependencies:

   ```bash
   cd frontend
   npm install
   ```

2. Start development server:
   ```bash
   npm start
   ```

## Testing

### Backend Tests

```bash
cd backend
pytest
```

### Frontend Tests

```bash
cd frontend
npm test
```

## Docker Services

The application consists of three Docker containers:

1. **Frontend Container**

   - React application
   - Port: 3001
   - Environment variables:
     - `REACT_APP_API_URL`: Backend API URL

2. **Backend Container**

   - FastAPI service
   - Port: 4000
   - Environment variables:
     - `XERO_MOCK_URL`: Mock API URL

3. **Mock API Container**
   - Xero mock service
   - Port: 3000

## Troubleshooting

1. If containers fail to start:

   ```bash
   # Stop all containers
   docker-compose down

   # Remove old containers and rebuild
   docker-compose up --build
   ```

2. If backend can't connect to mock API:

   ```bash
   # Check mock API logs
   docker-compose logs -f xero-mock
   ```

3. To check backend logs:
   ```bash
   docker-compose logs -f backend
   ```

## License

MIT License
