# CloudDeploy Local

**Tagline:** Self-hosted Developer Platform with Kubernetes, Docker,
GitHub Actions, Monitoring, and Local AWS Services.

------------------------------------------------------------------------

# Overview

CloudDeploy Local is a fully containerized, self-hosted
Platform-as-a-Service (PaaS) inspired by Render, Railway, and Heroku. It
allows developers to deploy containerized applications locally using
Docker Desktop Kubernetes while leveraging GitHub Actions for CI/CD and
Floci for AWS-compatible cloud services.

The entire platform runs locally inside Docker containers, making it
ideal for learning DevOps, Cloud Computing, Kubernetes, CI/CD, and
Observability without requiring a cloud account.

------------------------------------------------------------------------

# Goals

-   End-to-end DevOps workflow
-   Local Kubernetes deployments
-   Automated CI/CD using GitHub Actions
-   Real-time monitoring and logging
-   Local AWS service emulation using Floci
-   Resume-worthy production-style project

------------------------------------------------------------------------

# Tech Stack

## Frontend

-   React
-   Tailwind CSS

## Backend

-   Node.js
-   Express.js

## Database

-   MongoDB

## DevOps

-   Docker
-   Docker Compose
-   Kubernetes (Docker Desktop)
-   GitHub Actions
-   Local Docker Registry

## Monitoring

-   Prometheus
-   Grafana
-   Loki
-   Promtail
-   Alertmanager

## Cloud

-   Floci (S3, IAM, Lambda, SNS, SQS, API Gateway)

## Security

-   Trivy Image Scanner

------------------------------------------------------------------------

# High-Level Architecture

``` text
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

------------------------------------------------------------------------

# Core Modules

## Dashboard

-   Project Management
-   Deployment History
-   Build History
-   Pod Management
-   Logs
-   Metrics
-   Rollback
-   Scaling
-   Environment Variables
-   Secrets

## Deployment Engine

-   Build Docker images
-   Deploy to Kubernetes
-   Rolling Updates
-   Health Checks
-   Automatic Rollback

## Monitoring

-   CPU & Memory Usage
-   Container Metrics
-   Pod Status
-   Restart Count
-   Network Usage
-   Response Time

## Logging

-   Centralized log aggregation
-   Live log streaming
-   Search by log level

## Floci Integration

-   S3 Bucket Management
-   IAM Simulation
-   Lambda Invocation
-   SQS Queues
-   SNS Topics
-   API Gateway

------------------------------------------------------------------------

# CI/CD Pipeline

``` text
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

------------------------------------------------------------------------

# Container Layout

``` text
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

------------------------------------------------------------------------

# Dashboard Pages

## Home

-   Running Projects
-   Resource Usage
-   Recent Deployments

## Project Details

-   Deployments
-   Pods
-   Services
-   Logs
-   Metrics
-   Restart
-   Rollback
-   Scale

## Monitoring

-   Grafana Integration
-   Prometheus Metrics

## Cloud Services

-   S3
-   Lambda
-   SQS
-   SNS
-   IAM

------------------------------------------------------------------------

# Kubernetes Features

-   Deploy Applications
-   Scale Pods
-   Restart Deployments
-   Delete Deployments
-   View ReplicaSets
-   View Services
-   View ConfigMaps
-   View Secrets
-   View Namespaces
-   Port Forward

------------------------------------------------------------------------

# Folder Structure

``` text
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

------------------------------------------------------------------------

# Development Roadmap

## Phase 1

-   Docker Compose
-   React Dashboard
-   Node API
-   MongoDB

## Phase 2

-   Kubernetes Integration
-   Deployment Engine

## Phase 3

-   GitHub Actions CI/CD
-   Local Registry

## Phase 4

-   Monitoring Stack
-   Logging Stack

## Phase 5

-   Rollback
-   Scaling
-   Secrets
-   Environment Variables

## Phase 6

-   Floci Integration

## Phase 7

-   Security
-   Alerts
-   Helm
-   RBAC
-   Audit Logs

------------------------------------------------------------------------

# Resume Description

**CloudDeploy Local** --- Built a self-hosted Platform-as-a-Service
(PaaS) using Docker, Kubernetes (Docker Desktop), GitHub Actions,
Prometheus, Grafana, Loki, and Floci. Implemented automated CI/CD with
rolling deployments, health checks, automatic rollback, centralized
logging, real-time monitoring, and a React-based deployment dashboard
supporting Kubernetes resource management and AWS-compatible local
services.

------------------------------------------------------------------------

# Future Enhancements

-   Blue/Green Deployments
-   Canary Releases
-   Multi-cluster Support
-   GitOps (ArgoCD-style)
-   Multi-user Authentication
-   AI Deployment Insights
-   Cost Estimation Dashboard
-   Plugin System
