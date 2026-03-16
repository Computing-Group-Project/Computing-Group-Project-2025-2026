# Demeter Smart Cafeteria System

A full-stack application for managing cafeteria operations at Bastion University. Students can browse menus, place orders, and pay with Gold Krakens (virtual currency). Staff manage orders in real time via WebSocket-powered dashboards. An AI service provides personalized recommendations, smart discount generation, and review sentiment analysis.

## Architecture

The system is composed of three independently running services and a MySQL database:

| Service | Tech | Port |
|---------|------|------|
| **Backend** | Java 17, Spring Boot 3.5.10, Maven | 8080 |
| **Frontend** | React 19, Vite 7, Tailwind CSS 3 | 5173 (dev) / 3000 (Docker) |
| **AI Service** | Python 3.11+, FastAPI | 8001 |
| **Database** | MySQL 8 | 3306 |

### Three Cafeterias
- The Last Drop
- Hex Core Cafe
- Skyline Sips

## Quick Start with Docker

The fastest way to run the full application. Requires only [Docker](https://www.docker.com/products/docker-desktop/) installed on your machine.

### 1. Start everything

```bash
docker compose up --build
```

This builds and starts all four containers (MySQL, backend, AI service, frontend). The first build takes a few minutes to download dependencies. Subsequent runs are much faster.

### 2. Wait for services to be ready

The backend waits for MySQL to pass its health check before starting. You'll see log output from all services. Once you see the Spring Boot banner and `Started DemeterBackendApplication`, the system is ready.

### 3. Open the app

Go to **http://localhost:3000** in your browser.

### 4. Log in

All seed accounts use the password **`pass`**.

| Role | Username | Notes |
|------|----------|-------|
| Student | `garen`, `lux`, `fiora` | Browse menus, place orders, manage wallet |
| Staff | `swain` | The Last Drop order queue |
| Staff | `jayce`, `heimerdinger` | Hex Core Cafe order queue |
| Staff | `viktor` | Skyline Sips order queue |
| Admin | `admin_user` | User management, analytics, wallet top-ups |

### 5. Stop the application

```bash
docker compose down
```

To also wipe the database volume and start fresh next time:

```bash
docker compose down -v
```

### How it works

An nginx reverse proxy serves the React frontend and proxies API and WebSocket requests to the backend. The browser only communicates with nginx on port 3000, eliminating CORS issues.

```
Browser → http://localhost:3000
               ↓
         [nginx :80]  ← static files + reverse proxy
               ↓ /api/* and /ws/*
         [backend :8080]
               ↓            ↓
      [mysql :3306]   [ai-service :8001]
```

## Local Development (without Docker)

For active development, run each service individually. Requires Java 17, Node.js 20+, Python 3.11+, and MySQL 8.

### Database

Create a MySQL database called `demeter_db`, then load the schema and seed data:

```bash
mysql -u root -p demeter_db < database/schema.sql
mysql -u root -p demeter_db < database/data.sql
```

### Backend

```bash
cd backend
mvn clean install              # Build with tests
mvn spring-boot:run -Dspring-boot.run.profiles=dev  # Run dev server (port 8080)
mvn test                       # Run all tests
```

### Frontend

```bash
cd frontend/demeter-frontend
npm install                    # Install dependencies
npm run dev                    # Dev server (port 5173)
npm run build                  # Production build
npm run lint                   # ESLint
npm run test:run               # Run all tests
```

### AI Service

```bash
cd ai-service
python3 -m venv venv           # Create virtual environment
source venv/bin/activate       # Activate it
pip install -r requirements.txt
python main.py                 # Starts on port 8001
python -m pytest test.py -v    # Run all tests
```
