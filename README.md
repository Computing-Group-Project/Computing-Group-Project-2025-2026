# Demeter Smart Cafeteria System

A full-stack application for managing cafeteria operations at Bastion University. Built with Java Spring Boot, React, and Python FastAPI. Students can browse menus, place orders, and pay with Gold Krakens (virtual currency). Staff manage orders in real time via WebSocket-powered dashboards. An AI service provides personalized recommendations, smart discount generation, and review sentiment analysis.

## Architecture

The system is composed of three independently running services and a MySQL database:

| Service | Tech | Port |
|---------|------|------|
| **Backend** | Java 17, Spring Boot 3.5.10, Maven | 8080 |
| **Frontend** | React 19, Vite 7, Tailwind CSS 3 | 5173 (dev) / 3000 HTTP, 3443 HTTPS (Docker) |
| **AI Service** | Python 3.11+, FastAPI | 8001 |
| **Database** | MySQL 8 | 3306 |

### Three Cafeterias
- The Last Drop
- Hex Core Cafe
- Skyline Sips

## Quick Start with Docker

The fastest way to run the full application. Requires only [Docker](https://www.docker.com/products/docker-desktop/) installed on your machine.

### 1. Create environment file and SSL certs

```bash
cp .env.example .env
# Edit .env with your values (or use defaults below for local testing):
#   MYSQL_ROOT_PASSWORD=demeter_root_2026
#   JWT_SECRET=demeter_jwt_secret_key_at_least_32_characters_long
#   DEMETER_AI_API_KEY=demeter-ai-service-key-2024

# Generate self-signed TLS certificates
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout ssl/key.pem -out ssl/cert.pem -subj "/CN=localhost"
```

### 2. Start everything

```bash
docker compose up --build
```

This builds and starts four containers (MySQL, AI service, backend, and frontend). The first build takes a few minutes to download dependencies. Subsequent runs are much faster. The database backup container is optional — see step 6.

### 3. Wait for services to be ready

The backend waits for MySQL to pass its health check before starting. You'll see log output from all services. Once you see the Spring Boot banner and `Started DemeterBackendApplication`, the system is ready.

### 4. Open the app

Go to **http://localhost:3000** or **https://localhost:3443** in your browser. If using HTTPS with self-signed certs, your browser will show a certificate warning — proceed past it.

### 5. Log in

All seed accounts use the password **`pass`**.

| Role | Username | Notes |
|------|----------|-------|
| Student | `garen`, `lux`, `fiora` | Browse menus, place orders, manage wallet |
| Staff | `swain` | The Last Drop order queue |
| Staff | `jayce`, `heimerdinger` | Hex Core Cafe order queue |
| Staff | `viktor` | Skyline Sips order queue |
| Admin | `admin_user` | User management, analytics, wallet top-ups, audit log |

Students can also log in using their **university ID** instead of username.

### 6. Database backups

Backups are handled by the `db-backup` Docker Compose service (every 5 minutes, gzip-compressed, saved to `./backups/`, retaining the last 288 = 24 hours). The backup service is disabled by default; enable it with:

```bash
docker compose --profile backup up -d
```

For manual backup/restore without Docker:
```bash
./scripts/backup.sh                      # One-time backup
./scripts/backup.sh --install-cron       # Install 5-minute cron job
./scripts/backup.sh --restore <file>     # Restore from backup
```

### 7. Stop the application

```bash
docker compose down
```

To also wipe the database volume and start fresh next time:

```bash
docker compose down -v
```

### How it works

An nginx reverse proxy serves the React frontend and proxies API and WebSocket requests to the backend. The browser only communicates with nginx on ports 3000 (HTTP) / 3443 (HTTPS), eliminating CORS issues.

```
Browser → http://localhost:3000 (or https://localhost:3443)
               ↓
         [nginx :80/:443]  ← static files + reverse proxy + TLS termination
               ↓ /api/* and /ws/*
         [backend :8080]
               ↓            ↓
      [mysql :3306]   [ai-service :8001]
```

## Load Testing

k6 load testing scripts validate NFR performance targets (menu < 2s, order < 3s, WebSocket < 1s, AI < 2s at p95).

```bash
# Install k6
brew install k6

# Run load tests (default: 200 browse + 50 order + 30 WebSocket VUs)
k6 run load-testing/k6-load-test.js

# Quick smoke test
k6 run load-testing/k6-load-test.js --vus 10 --duration 30s
```

See `load-testing/README.md` for full documentation and scaling to 35,000 concurrent users.

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
python run.py                  # Starts on port 8001
python -m pytest tests/ -v     # Run all tests (49 tests)
```

## Test Coverage

| Service | Tests | Framework |
|---------|-------|-----------|
| Backend | 67 | JUnit 5 + Spring Boot Test (H2 in-memory DB) |
| Frontend | 55 | Vitest + React Testing Library (jsdom) |
| AI Service | 49 | pytest + FastAPI TestClient |

All tests run in CI on every push/PR to `main` (see `.github/workflows/ci.yml`).

## Documentation

| Document | Description |
|----------|-------------|
| [`backend/BACKEND.md`](backend/BACKEND.md) | Backend API, authentication, database patterns |
| [`frontend/demeter-frontend/FRONTEND.md`](frontend/demeter-frontend/FRONTEND.md) | Frontend SPA, components, routing |
| [`database/DATABASE.md`](database/DATABASE.md) | Schema, ERD, seed data, wallet system |
| [`ai-service/README.md`](ai-service/README.md) | AI endpoints, ML models |
| [`ai-service/AI_SERVICE_CHANGES.md`](ai-service/AI_SERVICE_CHANGES.md) | AI service restructuring details |
| [`UI_UX_DESIGN.md`](UI_UX_DESIGN.md) | Design system, theming, components, accessibility |
| [`API_AND_TESTING.md`](API_AND_TESTING.md) | Full API reference, 171 tests, CI/CD pipeline |
| [`SECURITY_NETWORK.md`](SECURITY_NETWORK.md) | Security architecture, TLS, headers, audit |
| [`load-testing/README.md`](load-testing/README.md) | k6 load testing and NFR targets |
