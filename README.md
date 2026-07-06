# Iskool — Multi-Tenant School Management System

A multi-tenant school management platform with a unified mobile app, web admin portal, and Java Spring backend.

## Tech Stack

- **Mobile App:** React Native (Expo) — single app, role-based features (Parent, Faculty, Principal/HOD)
- **Web Frontend:** React + Vite — admin portal and dashboards
- **Backend:** Java Spring Boot (Spring Web, Spring Data JPA, Spring Security, Maven)
- **Database:** PostgreSQL (multi-tenant via `school_id`)

## Project Structure

```
iskool-system/
├── backend/                 # Java Spring Boot API
├── web-frontend/            # React admin portal
├── mobile-app/              # React Native (Expo) mobile app
├── docker-compose.yml       # PostgreSQL for local development
└── README.md
```

## Quick Start

### 1. Start PostgreSQL

```bash
docker-compose up -d
```

Default credentials:
- Database: `iskool`
- User: `iskool`
- Password: `iskool123`
- Port: `5432`

### 2. Run the backend

```bash
cd backend
mvn spring-boot:run
```

The API will be available at `http://localhost:8080`.

### 3. Run the web frontend

```bash
cd web-frontend
npm install
npm run dev
```

The admin portal will be available at `http://localhost:5173`.

### 4. Run the mobile app

```bash
cd mobile-app
npm install
npx expo start
```

Scan the QR code with the Expo Go app (iOS/Android) or run on an emulator.

## Notes

- The backend is configured for multi-tenancy via a `school_id` column on each table and a request-scoped tenant filter.
- Faculty Salary Management & Tax Filing (TDS) is parked in the backlog / out of scope for now.
- Re-evaluation requests are also kept in the backlog.
