# Task Management API

A production-style **Task Management API** built using **NestJS**, implementing secure authentication, role-based access control, background job processing using **Redis + BullMQ**, API versioning, Swagger documentation, and automated testing.

---

## Tech Stack

* **NestJS**
* **PostgreSQL** (Prisma ORM)
* **Redis** (BullMQ for background jobs)
* **JWT Authentication**
* **Swagger (OpenAPI)**
* **Jest & Supertest**

---

## Features

* User Registration & Login
* JWT Access & Refresh Tokens
* Refresh Token Rotation
* Role-Based Access Control (ADMIN, USER)
* Task Management
* Background Job for Welcome Email (Redis + BullMQ)
* API Versioning (`/v1`) and (`/v2`)
* Health Checks
* Swagger API Documentation
* Unit & Integration Tests

---


## Environment Setup

Create a `.env` file based on `.env.example`.


## Installation

```bash
npm install
```

---

## Database Setup (Prisma)

Run the following commands in order:

```bash
npx prisma migrate dev
npx prisma generate
npm run prisma:seed
```

This will:

* Apply database migrations
* Generate Prisma client
* Seed default roles (`USER`, `ADMIN`)

---

## Running the Application (IMPORTANT)

This application uses **Redis for background job processing**.
Redis must be **running in parallel** with the application.

---

### Step 1: Start Redis (separate terminal)

#### Option A: Run Redis manually

```bash
redis-server
```

#### Option B: Run Redis as a background service (macOS)

```bash
brew services start redis
```

> ⚠️ Redis must stay running in parallel while the app is running.

---

### Step 2: Start the NestJS Application (new terminal)

```bash
npm run start:dev
```

---

### Stop Redis (optional)

```bash
brew services stop redis
```

---

## Background Job Behavior

* On **successful user registration**, a welcome email job is queued
* Job runs asynchronously using **BullMQ**
* HTTP request lifecycle is **not blocked**
* Job retries automatically on failure
* Duplicate jobs are prevented using idempotency logic
* Email sending is simulated via log messages

---

## API Versioning

The API uses **URI-based versioning**.

Example:

```http
GET /v1/bikes
GET /v1/bikes
```

---

## Swagger Documentation

Once the application is running:

* **Swagger UI:**
  `http://localhost:3000/docs`

* **Swagger JSON:**
  `http://localhost:3000/docs-json`

Swagger clearly indicates:

* Auth-required endpoints
* Role-restricted endpoints

---

## Health Checks

* Application health:
  `GET /health`

* Database health:
  `GET /health/db`

---

## Roles & Permissions

| Role  | Permissions    |
| ----- | -------------- |
| USER  | Create tasks   |
| USER  | View own tasks |
| ADMIN | View all tasks |
| ADMIN | Delete tasks   |
| ADMIN | Promote User   |


---

## Running Tests

### Unit Tests

```bash
npm run test
```

Includes:

* AuthService login logic
* Prisma mocked
* Success & failure scenarios

---

### Integration Tests

```bash
npm run test:e2e
```

Includes:

* JWT authentication
* Role-based access control validation
* Supertest-based HTTP testing

---

## Security Notes

* Passwords are hashed using **bcrypt**
* Refresh tokens are stored as **hashed values**
* JWT secrets are environment-based
* RBAC enforced using guards and decorators

---

### Final Statement

This project demonstrates secure authentication, authorization, background job processing, versioning, testing practices, and clean system design using NestJS.

---
