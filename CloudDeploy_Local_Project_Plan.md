# CloudDeploy Local

**Tagline:** Self-hosted Developer Platform with Kubernetes, Docker,
GitHub Actions, Monitoring, and Local AWS Services.

---

# Overview

CloudDeploy Local is a fully containerized, self-hosted
Platform-as-a-Service (PaaS) inspired by Render, Railway, and Heroku. It
allows developers to deploy containerized applications locally using
Docker Desktop Kubernetes while leveraging GitHub Actions for CI/CD and
Floci for AWS-compatible cloud services.

The entire platform runs locally inside Docker containers, making it
ideal for learning DevOps, Cloud Computing, Kubernetes, CI/CD, and
Observability without requiring a cloud account.

---

# Goals

- End-to-end DevOps workflow
- Local Kubernetes deployments
- Automated CI/CD using GitHub Actions
- Real-time monitoring and logging
- Local AWS service emulation using Floci
- Resume-worthy production-style project

---

# Tech Stack

## Frontend

- React
- Tailwind CSS

## Backend

- Node.js
- Express.js

## Database

- MongoDB

## DevOps

- Docker
- Docker Compose
- Kubernetes (Docker Desktop)
- GitHub Actions
- Local Docker Registry

## Monitoring

- Prometheus
- Grafana
- Loki
- Promtail
- Alertmanager

## Cloud

- Floci (S3, IAM, Lambda, SNS, SQS, API Gateway)

## Security

- Trivy Image Scanner

---

# High-Level Architecture

```text
Developer
    │
Push to GitHub
    │
GitHub Actions
    │
Run Tests
    │
Build Docker Image
    │
Trivy Scan
    │
Push Image to Local Registry
    │
Deployment API
    │
Kubernetes API
    │
Docker Desktop Kubernetes
    │
Pods / Services / Deployments
    │
Monitoring Stack
    │
React Dashboard
```

---

# Core Modules

## Dashboard

- Project Management
- Deployment History
- Build History
- Pod Management
- Logs
- Metrics
- Rollback
- Scaling
- Environment Variables
- Secrets

## Deployment Engine

- Build Docker images
- Deploy to Kubernetes
- Rolling Updates
- Health Checks
- Automatic Rollback

## Monitoring

- CPU & Memory Usage
- Container Metrics
- Pod Status
- Restart Count
- Network Usage
- Response Time

## Logging

- Centralized log aggregation
- Live log streaming
- Search by log level

## Floci Integration

- S3 Bucket Management
- IAM Simulation
- Lambda Invocation
- SQS Queues
- SNS Topics
- API Gateway

---

# CI/CD Pipeline

```text
Git Push
    │
GitHub Actions
    │
Install Dependencies
    │
Run Tests
    │
Lint
    │
Build Docker Image
    │
Trivy Security Scan
    │
Push to Local Registry
    │
Call Deployment API
    │
kubectl Apply
    │
Rolling Update
    │
Health Check
    ├── Success → Update Dashboard
    └── Failure → Automatic Rollback
```

---

# Container Layout

```text
React Dashboard
Node API
MongoDB
Floci
Prometheus
Grafana
Loki
Promtail
Alertmanager
Docker Registry
Nginx
```

---

# Dashboard Pages

## Home

- Running Projects
- Resource Usage
- Recent Deployments

## Project Details

- Deployments
- Pods
- Services
- Logs
- Metrics
- Restart
- Rollback
- Scale

## Monitoring

- Grafana Integration
- Prometheus Metrics

## Cloud Services

- S3
- Lambda
- SQS
- SNS
- IAM

---

# Kubernetes Features

- Deploy Applications
- Scale Pods
- Restart Deployments
- Delete Deployments
- View ReplicaSets
- View Services
- View ConfigMaps
- View Secrets
- View Namespaces
- Port Forward

---

# Folder Structure

```text
clouddeploy-local/
│
├── apps/
│   ├── dashboard/
│   ├── api/
│   └── sample-app/
│
├── infrastructure/
│   ├── docker/
│   ├── kubernetes/
│   ├── helm/
│   └── monitoring/
│
├── .github/
│   └── workflows/
│
├── monitoring/
│
├── floci/
│
├── registry/
│
└── docs/
```

---

# Development Roadmap

## Phase 1

- Docker Compose
- React Dashboard
- Node API
- MongoDB

## Phase 2

- Kubernetes Integration
- Deployment Engine

## Phase 3

- GitHub Actions CI/CD
- Local Registry

## Phase 4

- Monitoring Stack
- Logging Stack

## Phase 5

- Rollback
- Scaling
- Secrets
- Environment Variables

## Phase 6

- Floci Integration

## Phase 7

- Security
- Alerts
- Helm
- RBAC
- Audit Logs

---

# Resume Description

**CloudDeploy Local** --- Built a self-hosted Platform-as-a-Service
(PaaS) using Docker, Kubernetes (Docker Desktop), GitHub Actions,
Prometheus, Grafana, Loki, and Floci. Implemented automated CI/CD with
rolling deployments, health checks, automatic rollback, centralized
logging, real-time monitoring, and a React-based deployment dashboard
supporting Kubernetes resource management and AWS-compatible local
services.

---

# Future Enhancements

- Blue/Green Deployments
- Canary Releases
- Multi-cluster Support
- GitOps (ArgoCD-style)
- Multi-user Authentication
- AI Deployment Insights
- Cost Estimation Dashboard
- Plugin System

---

# Development Guidelines

This project is developed following professional software engineering and DevOps practices. These guidelines should be followed throughout the project.

## Project Rules

- Build the project incrementally, one feature at a time.
- Every feature must have a clear purpose before implementation.
- Every service must be containerized using Docker.
- Kubernetes (Docker Desktop) is the orchestration platform.
- GitHub Actions is the only CI/CD pipeline.
- Floci provides AWS-compatible local cloud services.
- Monitoring must use Prometheus and Grafana.
- Centralized logging must use Loki and Promtail.
- Infrastructure should be treated as code.
- Do not implement unnecessary features or boilerplate.
- Keep the codebase clean, modular, and production-ready.
- Every completed task should be committed before moving to the next one.

---

# Git Workflow

This project follows the **Conventional Commits** specification.

## Commit Types

| Prefix      | Purpose                                          |
| ----------- | ------------------------------------------------ |
| `feat:`     | New feature                                      |
| `fix:`      | Bug fixes                                        |
| `docs:`     | Documentation                                    |
| `style:`    | UI or formatting changes                         |
| `refactor:` | Code improvements without changing functionality |
| `test:`     | Add or update tests                              |
| `chore:`    | Configuration, setup, dependencies               |
| `ci:`       | GitHub Actions or CI/CD changes                  |
| `perf:`     | Performance improvements                         |

## Commit Examples

```text
feat(dashboard): create dashboard layout
feat(api): implement deployment endpoint
fix(auth): resolve JWT token validation
docs: update project architecture
style(dashboard): improve sidebar spacing
refactor(engine): simplify deployment service
ci: add docker build workflow
chore: configure eslint
```

---

# Development Workflow

Every feature should follow this workflow:

1. Design the feature.
2. Implement the code.
3. Test locally.
4. Dockerize if required.
5. Verify functionality.
6. Commit using Conventional Commits.
7. Update documentation if necessary.

---

# Code Quality Standards

- Keep functions small and focused.
- Use meaningful variable and function names.
- Avoid duplicated code.
- Handle errors properly.
- Follow a modular architecture.
- Separate business logic from UI.
- Write reusable components whenever possible.

---

# Project Goal

The objective is to build a production-inspired, self-hosted Platform-as-a-Service (PaaS) that demonstrates real-world DevOps, Cloud Computing, Kubernetes, Docker, CI/CD, Observability, and AWS concepts.

This project should be of portfolio quality and suitable for showcasing on GitHub and including on a professional resume.
