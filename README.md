# Multi-Tenant Task Management API

> A production-inspired backend API built to demonstrate maintainable software architecture through explicit design decisions rather than feature completeness.

![NestJS](https://img.shields.io/badge/NestJS-E0234E?logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?logo=redis&logoColor=white)
![RabbitMQ](https://img.shields.io/badge/RabbitMQ-FF6600?logo=rabbitmq&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-green)

---

## Overview

This project is a collaborative task management backend inspired by applications such as Jira. Rather than replicating every feature, it focuses on the architectural challenges commonly found in modern Software-as-a-Service (SaaS) platforms.

The project was built to explore how production-oriented backend systems can remain maintainable through explicit architectural boundaries, thoughtful abstractions, and deliberate engineering trade-offs.

Instead of maximizing feature count, the implementation prioritizes concerns such as tenant isolation, authentication, authorization, infrastructure integration, and long-term maintainability.

## Why This Project?

This project is intentionally designed around engineering decisions rather than feature quantity.

Every significant implementation choice was evaluated based on whether it improved the clarity, maintainability, or predictability of the system—not simply because it introduced another technology or architectural pattern.

As a result, the project intentionally favors:

- Explicit tenant isolation over hidden data-access mechanisms.
- Clear module boundaries over convenience.
- Simple, maintainable solutions over unnecessary architectural complexity.
- Infrastructure abstractions that keep business logic independent from implementation details.
- Representative testing that focuses on business-critical behavior rather than maximizing test count.

Several commonly used patterns and features were intentionally omitted when they did not provide meaningful value for the project's scope.

---

## Engineering Highlights

Beyond implementing common backend features, the project includes several architectural decisions intended to improve maintainability and reinforce design consistency.

| Highlight                             | Why it matters                                                                                                                      |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| **Custom ESLint architectural rule**  | Detects repository queries missing tenant scoping during development, helping enforce architectural conventions before runtime.     |
| **Reusable filtering infrastructure** | Shared filtering components support pagination and dynamic filtering while avoiding duplicated query-building logic across modules. |
| **Version-based cache invalidation**  | Paginated project lists are invalidated efficiently without tracking individual cache entries.                                      |

---

## Technology Stack

| Category       | Technology      |
| -------------- | --------------- |
| Framework      | NestJS          |
| Language       | TypeScript      |
| Database       | PostgreSQL      |
| ORM            | TypeORM         |
| Authentication | JWT + Argon2    |
| Cache          | Redis           |
| Messaging      | RabbitMQ        |
| Documentation  | Swagger         |
| Validation     | class-validator |
| Testing        | Jest            |
| Infrastructure | Docker Compose  |

---

## Features

The current implementation focuses on the core capabilities required to demonstrate a production-inspired multi-tenant SaaS application.

| Domain         | Capabilities                                               |
| -------------- | ---------------------------------------------------------- |
| Multi-tenancy  | Organization-scoped architecture, invitations, memberships |
| Authentication | JWT, refresh token rotation, RBAC                          |
| Projects       | CRUD, filtering, pagination                                |
| Tasks          | CRUD, assignment, status management                        |
| Infrastructure | Redis, RabbitMQ, Swagger, Docker                           |

---

## Architecture at a Glance

The application follows a layered architecture where each layer has a clearly defined responsibility.

```text
                HTTP Request
                      │
                      ▼
              Authentication
                      │
                      ▼
          Organization Validation
                      │
                      ▼
               Authorization
                      │
                      ▼
                Controller Layer
                      │
                      ▼
                 Service Layer
                      │
          ┌───────────┴───────────┐
          ▼                       ▼
   Repository Layer        Infrastructure
          │            (Redis / RabbitMQ)
          ▼
     PostgreSQL
```

Business logic remains independent from infrastructure concerns by communicating through abstractions rather than concrete implementations.

A detailed explanation of the architecture is available in [docs/architecture.md](docs/architecture.md).

---

## Project Structure

```text
src/
├── modules/
│   ├── auth/
│   ├── organizations/
│   ├── memberships/
│   ├── projects/
│   ├── tasks/
│   ├── users/
│   ├── cache/
│   ├── redis/
│   ├── rabbitmq/
│   ├── messaging/
│   ├── common/
│   └── core/
└── app.module.ts
```

Business modules are separated from infrastructure modules to keep application logic independent from external technologies such as Redis and RabbitMQ.

Further architectural details are documented in [docs/architecture.md](docs/architecture.md).

---

# Getting Started

## Prerequisites

Before running the project, ensure the following tools are installed:

- Node.js 22 or later
- pnpm
- Docker
- Docker Compose

---

## Installation

Clone the repository:

```bash
git clone <repository-url>
cd github_jira
```

Install dependencies:

```bash
pnpm install
```

---

## Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

The application can be configured through environment variables for:

- PostgreSQL
- Redis
- RabbitMQ
- JWT authentication
- Swagger
- Application settings

See `.env.example` for the complete list of available configuration options.

---

## Running with Docker

The recommended way to start the project is with Docker Compose.

```bash
docker compose up --build
```

This starts the complete development environment, including:

- API
- PostgreSQL
- Redis
- RabbitMQ

---

## Running the Application

Development mode:

```bash
pnpm start:dev
```

Build the application:

```bash
pnpm build
```

Run the production build:

```bash
pnpm start:prod
```

---

## API Documentation

Swagger documentation is available after the application starts.

Default URL:

```text
http://localhost:3000/docs
```

Swagger includes:

- endpoint documentation
- request and response schemas
- authentication support
- interactive API testing

---

## Running Tests

The project contains multiple testing layers.

Run unit tests:

```bash
pnpm test
```

Run integration tests:

```bash
pnpm test:integration
```

Run end-to-end tests:

```bash
pnpm test:e2e
```

---

# Documentation

The README provides a high-level overview of the project.

Detailed documentation for individual architectural topics is available in the `docs/` directory.

| Document                          | Description                                                          |
| --------------------------------- | -------------------------------------------------------------------- |
| `docs/architecture.md`            | Overall architecture, module organization, and application layers    |
| `docs/multi-tenancy.md`           | Tenant isolation strategy and organization-scoped architecture       |
| `docs/authentication.md`          | Authentication flow, JWT, refresh tokens, and session management     |
| `docs/caching.md`                 | Redis integration, cache abstraction, and version-based invalidation |
| `docs/asynchronous-processing.md` | RabbitMQ architecture, event publishing, and asynchronous workflows  |
| `docs/testing.md`                 | Testing strategy, testing layers, and design philosophy              |

---

# Roadmap

The current implementation intentionally focuses on a small but representative SaaS domain.

Potential future improvements include:

- Fine-grained permission system
- Multiple concurrent user sessions
- Audit logging
- API versioning
- OpenTelemetry integration
- Prometheus metrics
- Transactional Outbox Pattern
- Background job scheduling
- Full-text search

These features were intentionally excluded to keep the project focused on demonstrating architectural concepts rather than maximizing feature count.

---

# License

This project is licensed under the MIT License.
