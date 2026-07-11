<div align="center">

# ☁️ CloudDeploy Local

### A Self-Hosted Platform-as-a-Service (PaaS) for Local Development

*Inspired by Render, Railway, Heroku, and Coolify*

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](#license)
[![Node.js](https://img.shields.io/badge/Node.js-22-339933?logo=node.js)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![Express](https://img.shields.io/badge/Express-5-000000?logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7-47A248?logo=mongodb)](https://www.mongodb.com/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker)](https://www.docker.com/)
[![Kubernetes](https://img.shields.io/badge/Kubernetes-326CE5?logo=kubernetes)](https://kubernetes.io/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](#contributing)

</div>

---

## 📋 Table of Contents

- [Introduction](#-introduction)
- [Project Overview](#-project-overview)
- [Motivation](#-motivation)
- [Features](#-features)
- [Core Functionality](#-core-functionality)
- [Architecture Overview](#-architecture-overview)
- [Deployment Workflow](#-deployment-workflow)
- [Folder Structure](#-folder-structure)
- [Technology Stack](#-technology-stack)
- [Core Modules](#-core-modules)
- [API Overview](#-api-overview)
- [Environment Variables](#-environment-variables)
- [Installation Guide](#-installation-guide)
- [Local Development Setup](#-local-development-setup)
- [Docker Setup](#-docker-setup)
- [Docker Compose Setup](#-docker-compose-setup)
- [Kubernetes Setup](#-kubernetes-setup)
- [Running the Project](#-running-the-project)
- [Who Can Use CloudDeploy?](#-who-can-use-clouddeploy)
- [Self-Hosting CloudDeploy](#-self-hosting-clouddeploy)
- [Typical Workflow](#-typical-workflow)
- [Deployment Flow](#-deployment-flow)
- [Troubleshooting](#-troubleshooting)
- [Screenshots](#-screenshots)
- [FAQ](#-faq)
- [Roadmap](#-roadmap)
- [Performance Notes](#-performance-notes)
- [Security Notes](#-security-notes)
- [Open Source Philosophy](#-open-source-philosophy)
- [Contributing](#-contributing)
- [Feature Requests](#-feature-requests)
- [License](#-license)
- [Credits](#-credits)
- [Built for the Community](#-built-for-the-community)
- [Contact & Maintainer](#-contact--maintainer)
- [Support the Project](#-support-the-project)

---

## 🚀 Introduction

**CloudDeploy Local** is a production-inspired, self-hosted Platform-as-a-Service (PaaS) that enables developers to build, deploy, monitor, and manage containerized applications entirely on their local machine. It integrates Docker Desktop Kubernetes, a local Docker Registry, MongoDB, and a modern observability stack to simulate a real-world cloud deployment environment.

The platform provides a unified web dashboard for managing deployments, monitoring cluster health, browsing container registries, viewing logs, and configuring infrastructure settings — all running locally on your machine.

---

## 🎯 Project Overview

CloudDeploy Local is structured as **three independently deployable services** that work together:

| Layer | Service | Port | Description |
|-------|---------|------|-------------|
| **Dashboard** | React + Vite Frontend | `80` / `5173` | Web UI for managing deployments, registry, monitoring, and settings |
| **Backend API** | Express + Mongoose | `5001` | REST API — authentication, deployment management, system health, registry sync |
| **Deployment Engine** | Express + K8s SDK | `6000` | Orchestrates Docker builds, pushes images, and deploys to Kubernetes |

Supporting infrastructure includes **MongoDB Atlas** (cloud database) for persistence, a **local Docker Registry** for image storage, and the **Docker Desktop Kubernetes** cluster for container orchestration.

---

## 💡 Motivation

Modern PaaS platforms like Heroku, Render, and Railway have transformed how developers deploy applications — but they all come with a cost, both financially and in terms of internet dependency.

CloudDeploy Local was created to:

- **Enable offline development** — Deploy and test containerized applications without internet access or cloud costs
- **Provide a learning platform** — Understand how PaaS platforms work under the hood by running one locally
- **Bridge the gap** — Simulate a production deployment pipeline on a developer's machine before pushing to the cloud
- **Offer full control** — Complete visibility and control over every aspect of the deployment pipeline
- **Be extensible** — A modular architecture that can grow with your needs, from simple local deployments to complex multi-service orchestration

---

## ✨ Features

### 🎨 Dashboard
- **Real-time dashboards** — Cluster health, resource usage, and deployment statistics at a glance
- **Deployment management** — Create, view, monitor, and delete deployments with a single click
- **Cluster browser** — Explore Kubernetes resources: Nodes, Pods, Services, Deployments, ConfigMaps, Secrets, and more
- **Monitoring visualizations** — CPU, memory, disk, and network usage charts with time-series data
- **Log viewer** — Filtered, auto-scrolling log viewer with source and level filtering
- **Container registry** — Browse local Docker images, inspect metadata, and manage tags
- **Settings panel** — Customize theme, accent colors, Docker, Kubernetes, and registry configuration
- **Responsive design** — Fully responsive layout with mobile sidebar and adaptive tables

### 🔧 Backend API
- **JWT authentication** — Register, login, token refresh, and role-based authorization
- **Deployment CRUD** — Create, list, get, and delete GitHub-based deployments
- **Registry management** — List, sync, tag browsing, and deletion of registry images
- **System health monitoring** — Cached health checks for Docker, Kubernetes, MongoDB, Registry, and Backend
- **Rate limiting** — Configurable rate limiters for general API, auth, and deployment endpoints
- **Comprehensive error handling** — Centralized error middleware with Mongoose, validation, and operational error support

### ⚙️ Deployment Engine
- **Docker build & push** — Build Docker images from source code and push to a local registry
- **Kubernetes deployment** — Generate and apply Kubernetes Deployment and Service manifests
- **Git integration** — Clone public GitHub repositories for deployment
- **Node.js detection** — Automatically detect Node.js projects and generate Dockerfiles when missing
- **Rollout monitoring** — Wait for deployments to become ready before reporting success
- **Preview URLs** — Generate accessible preview URLs via Kubernetes NodePort services
- **Cleanup** — Automatic workspace cleanup after deployment

### 🐳 Infrastructure
- **Docker Compose** — One-command startup for the entire stack
- **Local Docker Registry** — Private image storage for local Kubernetes deployments
- **Cached health monitoring** — Background health checks for all infrastructure services
- **Graceful shutdown** — Proper SIGTERM/SIGINT handling for containerized deployments

---

## 🏗 Architecture Overview

```mermaid
graph TB
    subgraph "User"
        BROWSER[Browser / Dashboard]
    end

    subgraph "CloudDeploy Local"
        subgraph "Frontend"
            DASHBOARD["React Dashboard<br/>(Vite + Tailwind)<br/>Port 80/5173"]
        end

        subgraph "Backend Services"
            API["Backend API<br/>(Express + Mongoose)<br/>Port 5001"]
            ENGINE["Deployment Engine<br/>(Express + K8s SDK)<br/>Port 6000"]
        end

        subgraph "Data & Storage"
            MONGO[(MongoDB<br/>Port 27017)]
            REGISTRY[(Docker Registry<br/>Port 5000)]
        end

        subgraph "Orchestration"
            DOCKER["Docker Daemon"]
            K8S["Kubernetes Cluster<br/>(Docker Desktop)"]
        end

        BROWSER --> DASHBOARD
        DASHBOARD -->|HTTP/JSON| API
        API -->|CRUD| MONGO
        API -->|Health Checks| ENGINE
        ENGINE -->|Docker CLI| DOCKER
        ENGINE -->|K8s API| K8S
        ENGINE -->|Push/Pull| REGISTRY
    end
```

### Component Interaction

```mermaid
sequenceDiagram
    participant User as Developer
    participant UI as Dashboard
    participant API as Backend API
    participant DB as MongoDB
    participant Engine as Deployment Engine
    participant Docker as Docker Daemon
    participant K8s as Kubernetes

    User->>UI: Deploy GitHub Repository
    UI->>API: POST /api/deployments { repositoryUrl, branch }
    API->>DB: Create Deployment (REGISTERED)
    API->>Engine: POST /deploy { repo, branch, _id }
    Engine->>Docker: git clone + docker build
    Engine->>Docker: docker push to local registry
    Engine->>K8s: kubectl apply -f deployment.yaml
    Engine->>K8s: kubectl apply -f service.yaml
    Engine->>K8s: Wait for rollout status
    Engine-->>API: Return preview URL + status
    API->>DB: Update Deployment (RUNNING)
    API-->>UI: { success, previewUrl, status }
    UI-->>User: Deployment ready! 🎉
```

---

## 🔄 Deployment Workflow

```mermaid
flowchart LR
    A[GitHub Repository] -->|Clone| B[Workspace]
    B -->|Detect| C{Node.js Project?}
    C -->|Yes| D[Install Dependencies]
    C -->|No| E[Use Existing Dockerfile]
    D --> F[Generate Dockerfile]
    E --> G[Docker Build]
    F --> G
    G -->|tag & push| H[Local Registry]
    H -->|kubectl apply| I[K8s Deployment]
    H -->|kubectl apply| J[K8s Service]
    I --> K{Wait for Ready}
    J --> K
    K -->|Ready| L[Preview URL]
    K -->|Timeout| M[Failed ❌]
    L --> N[Cleanup Workspace]
```

---

## 📁 Folder Structure

```text
clouddeploy-local/
│
├── backend/                          # Express REST API (port 5001)
│   ├── src/
│   │   ├── server.js                 # Entry point — env validation, DB connect, graceful shutdown
│   │   ├── app.js                    # Express app factory — middleware, routes, error handling
│   │   ├── config/database.js        # Mongoose connection to MongoDB
│   │   ├── routes/                   # Route definitions (auth, deployments, registry, etc.)
│   │   ├── controllers/              # HTTP request handlers (thin — delegate to services)
│   │   ├── services/                 # Business logic (auth, deployments, registry, monitoring)
│   │   ├── models/                   # Mongoose schemas (User, Deployment, Metric, RegistryImage)
│   │   ├── middleware/               # Auth, validation, rate limiting, error handling
│   │   ├── engine/                   # Infrastructure integration (Docker CLI, K8s API, Floci)
│   │   ├── monitor/                  # Health check system (cached background monitoring)
│   │   └── utils/                    # ApiError, ApiResponse, logger, asyncHandler
│   ├── Dockerfile                    # Multi-stage production build
│   └── .dockerignore
│
├── dashboard/                        # React + Vite + Tailwind frontend
│   ├── src/
│   │   ├── main.jsx                  # React entry point
│   │   ├── App.jsx                   # Root component with providers
│   │   ├── routes/AppRoutes.jsx      # React Router — 8 routes
│   │   ├── layouts/                  # DashboardLayout with sidebar + navbar
│   │   ├── pages/                    # Dashboard, Deployments, Clusters, Monitoring, Logs, etc.
│   │   ├── components/               # Reusable UI primitives + page-specific components
│   │   ├── contexts/                 # SettingsContext, SystemHealthContext
│   │   ├── hooks/                    # useDeployments, useRegistry, useSystemHealth, useSettings
│   │   ├── api/                      # Axios client + API modules
│   │   ├── services/                 # Data transformation and business logic
│   │   └── styles/globals.css        # Tailwind CSS + custom properties
│   ├── Dockerfile                    # Multi-stage production build (Nginx)
│   └── .dockerignore
│
├── deployment-engine/                # Standalone deployment orchestrator (port 6000)
│   ├── src/
│   │   ├── server.js                 # Entry point
│   │   ├── app.js                    # Express app factory
│   │   ├── routes/                   # Deployment, delete, registry, health routes
│   │   ├── controllers/              # Request handlers
│   │   ├── services/                 # Deployment orchestration logic
│   │   ├── docker/                   # Docker build, push, and management
│   │   ├── kubernetes/               # K8s client, deployment, service, manifest generation
│   │   ├── git/                      # Git clone and repository management
│   │   ├── registry/                 # Docker registry inspection and tag management
│   │   ├── node/                     # Node.js project detection and validation
│   │   ├── monitor/                  # Health check system (Docker, K8s, Registry)
│   │   ├── backend/                  # Backend API communication (status updates)
│   │   └── cleanup/                  # Workspace cleanup after deployment
│   ├── Dockerfile                    # Multi-stage production build (includes Docker CLI + kubectl)
│   └── .dockerignore
│
├── registry/                         # Docker Registry configuration
│   └── config.yml                    # Registry configuration file
│
├── docs/                             # Generated documentation
│   ├── COMPLETE_TECHNICAL_HANDOVER.md
│   ├── PROJECT_ANALYSIS.md
│   └── PROJECT_STRUCTURE.md
│
├── docker-compose.yml                # One-command startup for all services
└── .gitignore
```

---

## 🛠 Technology Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19 | UI framework |
| Vite | 8 | Build tool & dev server |
| Tailwind CSS | 4 | Utility-first CSS framework |
| React Router | 7 | Client-side routing |
| Framer Motion | 12 | Page/component animations |
| Lucide React | 1 | Icon library |
| Axios | 1 | HTTP client |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 22 | JavaScript runtime |
| Express | 5 | HTTP framework |
| Mongoose | 9 | MongoDB ODM |
| JSON Web Token | 9 | JWT authentication |
| bcryptjs | 3 | Password hashing |
| Helmet | 8 | Security headers |
| Morgan | 1 | HTTP request logging |

### Deployment Engine

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 22 | JavaScript runtime |
| Express | 5 | HTTP framework |
| @kubernetes/client-node | 1 | Kubernetes API client |
| simple-git | 3 | Git repository cloning |
| Docker CLI | — | Docker build, tag, push operations |
| kubectl | 1.32 | Kubernetes CLI for manifest management |

### Infrastructure

| Technology | Version | Purpose |
|------------|---------|---------|
| MongoDB | 7 | Primary database |
| Docker | — | Container runtime |
| Kubernetes | — | Container orchestration (Docker Desktop) |
| Docker Registry | 2 | Local container image storage |

---

## 🧩 Core Modules

### Backend API Modules

| Module | Status | Description |
|--------|--------|-------------|
| **Authentication** | ✅ Complete | JWT-based register, login, refresh, role-based authorization |
| **Deployments** | ⚡ Active | GitHub repository registration and deployment lifecycle management |
| **Registry** | ✅ Complete | Docker image listing, syncing, tag browsing, and deletion |
| **System Health** | ✅ Complete | Cached health monitoring for Docker, K8s, MongoDB, Registry |
| **Monitoring** | ⏳ Partial | Metric queries via MongoDB (Prometheus integration planned) |
| **Logging** | ⏳ Partial | Log queries via MongoDB (Loki integration planned) |
| **Floci** | 🗺️ Placeholder | AWS-compatible local services (S3, Lambda, IAM, SNS, SQS) |

### Deployment Engine Modules

| Module | Status | Description |
|--------|--------|-------------|
| **Git Integration** | ✅ Complete | Clone public GitHub repositories with branch support |
| **Node.js Detection** | ✅ Complete | Auto-detect Node.js projects and validate package.json |
| **Docker Build** | ✅ Complete | Build Docker images from source code |
| **Docker Push** | ✅ Complete | Tag and push images to local Docker Registry |
| **Manifest Generation** | ✅ Complete | Generate K8s Deployment and Service YAML manifests |
| **K8s Deploy** | ✅ Complete | Apply manifests to Kubernetes cluster |
| **Health Monitoring** | ✅ Complete | Background health checks for Docker, K8s, Registry |
| **Cleanup** | ✅ Complete | Automatic workspace and temporary file cleanup |

---

## 📡 API Overview

### Base URLs

| Service | Base URL | Auth |
|---------|----------|------|
| Backend API | `http://localhost:5001/api` | Mixed (JWT for protected routes) |
| Deployment Engine | `http://localhost:6000` | No auth (internal service) |

### Authentication Endpoints (Future Phase — Code Exists, Not Mounted)

> The auth module is fully implemented (controller, service, JWT logic, rate limiting, password hashing) but is **not exposed** in the current MVP route configuration. The routes will be activated once the frontend auth UI is complete.

| Method | Endpoint | Auth | Rate Limited | Location |
|--------|----------|------|-------------|----------|
| `POST` | `/auth/register` | No | 10/15min | `routes/auth.routes.js` (commented out) |
| `POST` | `/auth/login` | No | 10/15min | `routes/auth.routes.js` (commented out) |
| `POST` | `/auth/refresh` | JWT | 10/15min | `routes/auth.routes.js` (commented out) |
| `GET` | `/auth/me` | JWT | General | `routes/auth.routes.js` (commented out) |

### Deployment Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/deployments` | No | Create a new deployment from a GitHub repository |
| `GET` | `/deployments` | No | List all deployments |
| `GET` | `/deployments/:id` | No | Get deployment by ID |
| `DELETE` | `/deployments/:id` | No | Delete a deployment |

### Registry Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/registry` | No (MVP) | List registry repositories (proxies to Deployment Engine) |

> **Note:** The full JWT-protected registry CRUD (list images, sync, tags, delete) is implemented in `controllers/registry.controller.js` and `services/registry.service.js` but uses the old `RegistryImage` model. The current MVP mounts a simplified unauthenticated proxy route that fetches data from the Deployment Engine's Docker Registry.

### System Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/health` | No | Health check — returns API status |
| `GET` | `/ready` | No | Readiness check — validates MongoDB connection |
| `GET` | `/system/health` | No | Full system health (Docker, K8s, MongoDB, Registry) |

### Deployment Engine Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/deploy` | Trigger a full deployment pipeline |
| `DELETE` | `/delete` | Delete a deployed application |
| `GET` | `/registry` | Get registry repository information |
| `GET` | `/system/health` | Get system health status |

> **Note on MVP Route Strategy:** The backend has authentication, monitoring, logging, and Floci modules fully implemented in the controller/service/model layers, but in the current MVP they are **not exposed as active API routes**. Only deployments, system health, registry proxy, and internal status endpoints are currently mounted. The dashboard makes real API calls (via contexts/hooks) but the JWT token interceptor is not yet active — auth UI and token management are planned. See [Roadmap](#-roadmap) for details.

---

## 🔐 Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PORT` | No | `5001` | Server port |
| `MONGODB_URI` | **Yes** | — | MongoDB Atlas connection string (e.g., `mongodb+srv://user:pass@cluster.mongodb.net/clouddeploy`) |
| `JWT_SECRET` | No | `clouddeploy-dev-secret` | Secret key for JWT signing |
| `JWT_EXPIRES_IN` | No | `7d` | JWT token expiration duration |
| `DEPLOYMENT_ENGINE_URL` | No | `http://localhost:6000` | Deployment engine service URL |
| `REGISTRY_URL` | No | `http://localhost:5000` | Docker Registry service URL |
| `LOG_LEVEL` | No | `info` | Logging level (debug, info, warn, error) |
| `NODE_ENV` | No | `development` | Environment mode |

### Deployment Engine (`deployment-engine/.env`)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PORT` | No | `6000` | Server port |
| `BACKEND_URL` | No | `http://localhost:5001/api` | Backend API URL for status updates |
| `REGISTRY_URL` | No | `http://localhost:5000` | Docker Registry URL |

### Dashboard (`dashboard/.env`)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `VITE_BACKEND_URL` | No | `http://localhost:5001/api` | Backend API URL for API calls |

---

## 📦 Installation Guide

### Prerequisites

Make sure you have the following installed on your system:

- [Node.js](https://nodejs.org/) v22 or later
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) with Kubernetes enabled
- [Git](https://git-scm.com/) command-line tools

### Option 1: Quick Start with Docker Compose

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/clouddeploy-local.git
cd clouddeploy-local

# 2. Start all services
docker compose up -d

# 3. Check that everything is running
docker compose ps

# 4. Access the dashboard
open http://localhost
```

### Option 2: Local Development Setup

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/clouddeploy-local.git
cd clouddeploy-local

# 2. Install dependencies for all services
cd backend && npm install && cd ..
cd dashboard && npm install && cd ..
cd deployment-engine && npm install && cd ..

# 3. Set up MongoDB Atlas connection
# Create a backend/.env file with your MongoDB Atlas connection string:
#   MONGODB_URI=mongodb+srv://user:password@cluster0.xxxxx.mongodb.net/clouddeploy?retryWrites=true&w=majority

# 4. Start supporting infrastructure (local Registry only)
docker compose up -d registry

# 5. Start services in development mode (in separate terminals)
# Terminal 1: Backend API
cd backend && npm run dev

# Terminal 2: Deployment Engine
cd deployment-engine && npm run dev

# Terminal 3: Dashboard
cd dashboard && npm run dev
```

---

## 🐳 Docker Setup

### Building Images

Each service has its own multi-stage Dockerfile for production-ready builds:

```bash
# Build all images
docker compose build

# Build individual services
docker build -t clouddeploy-backend ./backend
docker build -t clouddeploy-dashboard ./dashboard
docker build -t clouddeploy-deployment-engine ./deployment-engine
```

### Multi-Stage Builds

All Dockerfiles use multi-stage builds for optimal image size:

- **Deps stage** — Install production dependencies only
- **Build stage** — Compile/transpile source code (where applicable)
- **Runner stage** — Minimal runtime image with only what's needed

> **Note:** The Deployment Engine image includes the Docker CLI and kubectl binaries to enable Docker build/push and Kubernetes operations from within the container.

---

## 🐳 Docker Compose Setup

The project includes a complete `docker-compose.yml` that orchestrates all services:

```bash
# Start the entire stack
docker compose up -d

# View logs
docker compose logs -f

# Stop all services
docker compose down

# Stop and remove volumes (destroys data)
docker compose down -v
```

### Services

| Service | Container Name | Port | Description |
|---------|---------------|------|-------------|
| `registry` | `clouddeploy-registry` | `5000` | Docker Registry v2 |
| `backend` | `clouddeploy-backend` | `5001` | Express REST API |
| `dashboard` | `clouddeploy-dashboard` | `80` | React frontend (Nginx) |
| `deployment-engine` | `clouddeploy-deployment-engine` | `6000` | Deployment orchestrator |

> **Note:** MongoDB is not included as a Docker service. The backend connects to **MongoDB Atlas** (or any external MongoDB instance) via the `MONGODB_URI` environment variable.

### Persistence

Data persistence is managed through a Docker named volume:

| Volume | Mount | Service |
|--------|-------|---------|
| `registry-data` | `/var/lib/registry` | Docker Registry |

### Networking

All services communicate over an isolated bridge network called `clouddeploy`.

---

## ☸️ Kubernetes Setup

The platform deploys applications to the Kubernetes cluster built into Docker Desktop.

### Prerequisites

1. **Enable Kubernetes in Docker Desktop:**
   - Open Docker Desktop → Settings → Kubernetes
   - Check "Enable Kubernetes"
   - Click "Apply & Restart"

2. **Verify the cluster is running:**
   ```bash
   kubectl cluster-info
   kubectl get nodes
   ```

3. **Ensure the default kubeconfig is available:**
   ```bash
   cat ~/.kube/config
   ```

### How It Works

The Deployment Engine interacts with Kubernetes using `@kubernetes/client-node`:

1. Generates **Deployment manifests** (`apps/v1`) with configurable replicas and container ports
2. Generates **Service manifests** (`v1`, `NodePort` type) for external access
3. Applies manifests using `kubectl apply`
4. Monitors rollout status until the deployment is ready
5. Exposes the application via a dynamically assigned NodePort

### Kubernetes Resources Managed

| Resource | Description |
|----------|-------------|
| **Deployments** | Application containers with replica management |
| **Services** | NodePort services for external access |
| **Namespaces** | Resource isolation (default namespace unless specified) |

> **Note:** The Clusters page in the dashboard can browse all Kubernetes resources including Pods, Services, ConfigMaps, Secrets, PersistentVolumes, and more.

---

## 🏃 Running the Project

### Quick Start (Docker Compose)

```bash
git clone https://github.com/YOUR_USERNAME/clouddeploy-local.git
cd clouddeploy-local
docker compose up -d
```

Access the dashboard at **http://localhost**

### Development Mode

```bash
# Terminal 1 — Start local Registry
docker compose up -d registry

# Terminal 2 — Backend API (hot reload)
cd backend
# Make sure MONGODB_URI is set in your .env or shell environment
npm install
npm run dev             # Starts on port 5001

# Terminal 3 — Deployment Engine (hot reload)
cd deployment-engine
npm install
npm run dev             # Starts on port 6000

# Terminal 4 — Dashboard (hot reload)
cd dashboard
npm install
npm run dev             # Starts on port 5173
```

Access the dashboard at **http://localhost:5173**

---

## 🚀 Who Can Use CloudDeploy?

CloudDeploy is designed for a wide range of users — from students learning DevOps to experienced platform engineers. Here's who will find it most valuable:

| User | What CloudDeploy Offers |
|------|------------------------|
| 🎓 **Students learning DevOps** | A hands-on, local environment to learn Docker, Kubernetes, CI/CD, and PaaS concepts |
| 👨‍💻 **Software Developers** | One-click deployment of Node.js applications to a local Kubernetes cluster |
| 🏗️ **DevOps Engineers** | A complete local pipeline for testing infrastructure-as-code patterns |
| 🏛️ **Platform Engineers** | A reference architecture for building internal developer platforms |
| ☁️ **Cloud Engineers** | A sandbox for experimenting with container orchestration and deployment strategies |
| 🌟 **Open Source Contributors** | A welcoming project to contribute to and shape with your ideas |
| 👥 **Small Development Teams** | A shared local deployment environment for team collaboration and testing |
| 🔬 **Engineering Students** | Real-world exposure to microservices, containerization, and observability |
| 🏠 **Self-hosting Enthusiasts** | A complete self-hosted PaaS alternative to cloud services |
| 🚀 **Anyone wanting to build and manage** their own local PaaS similar to Render, Railway, or Heroku | Full platform control with zero cloud costs |

---

## 🔄 Typical Workflow

Getting started with CloudDeploy is straightforward. Here's the typical flow from installation to your first successful deployment:

```mermaid
flowchart TD
    A[🍴 Fork / Clone CloudDeploy Repository]
    B[⚙️ Install Prerequisites<br/>Node.js, Docker Desktop,<br/>Kubernetes, MongoDB Atlas]
    C[🔐 Configure Environment Variables<br/>MONGODB_URI, JWT_SECRET]
    D[🐳 Start CloudDeploy Platform<br/>docker compose up -d]
    E[🌐 Open CloudDeploy Dashboard<br/>http://localhost]
    F[🔗 Connect Your Git Repository<br/>Paste GitHub URL + branch]
    G[⚡ Automatic Build & Deployment<br/>Clone → Build → Push → Deploy]
    H[📊 Monitor Deployment Status<br/>Real-time status updates]
    I[📜 View Deployment Logs]
    J[🔄 Redeploy on Changes<br/>Update code → Push → Deploy]
    K[🛠️ Manage Multiple Projects<br/>From one unified dashboard]

    A --> B --> C --> D --> E --> F --> G --> H --> I --> J --> K
```

**From zero to deployed in minutes.** 🚀

---

## 🚀 Self-Hosting CloudDeploy

**CloudDeploy** is an **open-source, self-hosted Platform-as-a-Service (PaaS)** that anyone can install, customize, and run on their own infrastructure. It's designed to simplify application deployment while also serving as a comprehensive learning platform for modern DevOps practices.

Unlike cloud-only PaaS solutions, CloudDeploy runs entirely on **your machine** — giving you full control, zero cloud costs, and complete data privacy.

### What Self-Hosting Means for You

- 🍴 **Fork or clone** this repository to get started
- ⚙️ **Install the prerequisites** — Node.js, Docker Desktop, Kubernetes, MongoDB Atlas
- 🔐 **Configure environment variables** — Set up your MongoDB Atlas connection and security keys
- 🐳 **Start the platform** with a single Docker Compose command
- 🌐 **Open the CloudDeploy Dashboard** — A full-featured web UI greets you
- 🔗 **Connect your own Git repositories** — Deploy any public GitHub project
- 🚀 **Deploy your own Node.js applications** — The engine handles the rest
- 📊 **Monitor deployment status** in real time from the dashboard
- 📜 **View deployment logs** — Debug and track issues effortlessly
- 🔄 **Redeploy applications** when changes are pushed
- 🛠️ **Manage multiple projects** from one dashboard
- 🎯 **Extend the platform** with new features and integrations

### Use Your Own Applications

> **CloudDeploy is designed to deploy YOUR applications — not just the sample code in this repository.**

The platform works with any public GitHub repository containing a Node.js application. Simply paste the repository URL into the dashboard, and the deployment engine takes care of the rest — cloning, building, pushing to the local registry, generating Kubernetes manifests, and deploying to your cluster.

### Customize Everything

Since CloudDeploy is fully open-source, you can:

- 🎨 Modify the dashboard to match your brand
- 🔧 Add new deployment types beyond Node.js
- 🔌 Integrate with your existing tools and services
- 🏗️ Extend the deployment pipeline with custom steps
- 🌐 Deploy it on a server for team-wide access
- 🧪 Use it as a staging environment before production deployment

> **CloudDeploy is intended to be an open-source platform — you are encouraged to customize it according to your own needs.**

---

## 🔄 Deployment Flow

### Step-by-Step

1. **Submit a GitHub repository URL** via the dashboard or API
2. **Backend validates** the URL format and creates a `Deployment` record
3. **Deployment Engine clones** the repository to a workspace directory
4. **Node.js project detection** — Validates `package.json` and project structure
5. **Dockerfile detection** — Uses existing Dockerfile or generates one for Node.js projects
6. **Docker build** — Builds the Docker image with a timestamp-based tag
7. **Push to registry** — Tags and pushes the image to the local Docker Registry
8. **Kubernetes manifest generation** — Creates Deployment and Service YAML manifests
9. **Deploy to Kubernetes** — Applies manifests via `kubectl apply`
10. **Wait for rollout** — Polls deployment status until pods are ready
11. **Preview URL** — Returns the NodePort URL to access the deployed application
12. **Cleanup** — Removes the cloned repository from the workspace

### Available Statuses

| Status | Description |
|--------|-------------|
| `REGISTERED` | Deployment request received and queued |
| `CLONING` | Cloning the GitHub repository |
| `BUILDING` | Building the Docker image |
| `PUSHING` | Pushing image to local registry |
| `DEPLOYING` | Deploying to Kubernetes |
| `RUNNING` | Application is deployed and running |
| `FAILED` | Deployment encountered an error |

---

## 🔧 Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| **MongoDB connection refused** | Verify your `MONGODB_URI` connection string and network access in MongoDB Atlas |
| **Docker not available** | Start Docker Desktop and verify with `docker info` |
| **Kubernetes not available** | Enable Kubernetes in Docker Desktop settings |
| **Registry not accessible** | Check registry: `curl http://localhost:5000/v2/` |
| **Build fails** | Check `docker build` logs for errors, verify Dockerfile compatibility |
| **Deployment stuck on Pending** | Check pod status: `kubectl get pods` |
| **Port already in use** | Change the port in the `.env` file or docker-compose.yml |
| **Git clone fails** | Ensure the repository URL is public and accessible |

### Debugging

```bash
# Check all running containers
docker compose ps

# View backend logs
docker compose logs -f backend

# View deployment engine logs
docker compose logs -f deployment-engine

# Check MongoDB connection (requires mongosh and your Atlas URI)
mongosh "$MONGODB_URI" --eval "db.runCommand({ping:1})"

# Check Kubernetes pods
kubectl get pods --all-namespaces

# Test registry
curl http://localhost:5000/v2/_catalog
```

---

## 📸 Screenshots

> *Screenshots coming soon! If you have screenshots of CloudDeploy Local in action, please submit a Pull Request.*

<!-- 
  Dashboard preview
  Deployment management
  Cluster browser
  Monitoring dashboards
  Log viewer
  Registry browser
  Settings panel
-->

| Section | Screenshot |
|---------|------------|
| Dashboard | _[Add screenshot]_ |
| Deployments | _[Add screenshot]_ |
| Clusters | _[Add screenshot]_ |
| Monitoring | _[Add screenshot]_ |
| Logs | _[Add screenshot]_ |
| Registry | _[Add screenshot]_ |
| Settings | _[Add screenshot]_ |

---

## ❓ FAQ

<details>
<summary><strong>What is CloudDeploy Local?</strong></summary>
CloudDeploy Local is a self-hosted Platform-as-a-Service (PaaS) that runs entirely on your local machine. It provides a web dashboard to deploy Node.js applications to a local Kubernetes cluster, manage container registries, monitor system health, and more.
</details>

<details>
<summary><strong>Do I need internet access to use it?</strong></summary>
No! Once installed and configured, all services run locally. The only internet dependency is when cloning public GitHub repositories for deployment.
</details>

<details>
<summary><strong>Which Kubernetes distribution is supported?</strong></summary>
The platform is designed for Docker Desktop's built-in Kubernetes cluster. It uses `~/.kube/config` for authentication and the standard Kubernetes API.
</details>

<details>
<summary><strong>Can I deploy applications other than Node.js?</strong></summary>
Currently, the platform is optimized for Node.js applications. The Deployment Engine auto-detects Node.js projects and generates appropriate Dockerfiles. Support for other languages is planned for future releases.
</details>

<details>
<summary><strong>How do I access my deployed application?</strong></summary>
Each deployment is exposed via a Kubernetes NodePort service. After a successful deployment, a preview URL (e.g., `http://localhost:3XXXX`) is provided in the dashboard.
</details>

<details>
<summary><strong>Is there authentication?</strong></summary>
Yes! The backend supports JWT-based authentication with user registration, login, and role-based authorization (user, admin, viewer). The auth endpoints are fully implemented but are not yet exposed in the active MVP routes — they will be enabled when the frontend auth UI is complete.
</details>

<details>
<summary><strong>How do I reset or clear all data?</strong></summary>
Run `docker compose down -v` to stop all services and remove the registry volume. Then run `docker compose up -d` to start fresh. Note that your MongoDB Atlas data is not affected by this command.
</details>

<details>
<summary><strong>Can I deploy multiple versions of the same application?</strong></summary>
Yes! Each deployment creates a unique Docker image tag and Kubernetes resources. You can have multiple versions running simultaneously on different ports.
</details>

---

## 🗺 Roadmap

### Phase 1 — Foundation ✅
- [x] Backend REST API with Express + Mongoose
- [x] JWT authentication with role-based authorization
- [x] React dashboard with Tailwind CSS
- [x] Deployment Engine with Docker build/push
- [x] Kubernetes manifest generation and deployment
- [x] System health monitoring (Docker, K8s, MongoDB, Registry)
- [x] Docker Compose setup
- [x] Dockerfiles for all services

### Phase 2 — Enhancements (In Progress)
- [ ] Frontend-backend API integration
- [ ] Deployment CRUD (update, redeploy, rollback)
- [ ] Real-time deployment status updates (WebSocket)
- [ ] Enhanced Kubernetes resource management
- [ ] Deployment history and activity tracking
- [ ] User profile and settings management

### Phase 3 — Monitoring & Observability (Planned)
- [ ] Prometheus + Grafana integration
- [ ] cAdvisor and Node Exporter for metrics
- [ ] Loki + Promtail for centralized logging
- [ ] Real-time metric dashboards
- [ ] Alerting and notifications

### Phase 4 — Advanced Features (Planned)
- [ ] Floci — Local AWS-compatible services (S3, Lambda, IAM, SNS, SQS)
- [ ] CI/CD pipeline with GitHub Actions
- [ ] Custom domain support
- [ ] SSL/TLS certificate management
- [ ] Horizontal Pod Autoscaling (HPA)
- [ ] Multi-node cluster support
- [ ] Resource quotas and limits management

### Phase 5 — Production Readiness (Planned)
- [ ] Comprehensive test suite (unit, integration, E2E)
- [ ] Performance optimization and benchmarking
- [ ] Security audit and hardening
- [ ] Backup and restore utilities
- [ ] Helm charts for production deployment

---

## ⚡ Performance Notes

- **Docker build operations** can be resource-intensive. Ensure Docker Desktop has adequate CPU and memory allocation (recommended: 4+ CPUs, 8GB+ RAM).
- The **health monitoring system** runs on-demand (not continuously) to minimize overhead.
- **Rate limiting** is configured conservatively (100 requests/15min for general API) to prevent abuse.
- **MongoDB indexes** are defined for the `metrics` and `registryimages` collections to optimize query performance.
- The **Deployment Engine** cleans up cloned repositories after each deployment to keep disk usage minimal.
- For development, each service runs with **hot reload** (nodemon for backend/deployment-engine, Vite HMR for dashboard).

---

## 🛡 Security Notes

- **JWT tokens** are used for API authentication with a configurable expiration (default: 7 days).
- **Passwords** are hashed using bcryptjs (12 salt rounds) — never stored in plaintext.
- **Role-based authorization** supports three roles: `user`, `admin`, and `viewer`.
- **Rate limiting** protects auth endpoints from brute force attacks (10 requests/15 minutes).
- **Helmet.js** provides security headers (CSP, HSTS, XSS protection, etc.) on all API responses.
- **CORS** is configured to allow cross-origin requests from the dashboard.
- **Input validation** ensures all API requests are sanitized and validated.
- **Graceful shutdown** ensures proper cleanup on container termination (SIGTERM/SIGINT).
- **Important:** Change the default `JWT_SECRET` in production to a cryptographically secure random string.

---

## 🧩 Open Source Philosophy

CloudDeploy is an **open-source community project**, built in the open for everyone to use, learn from, and contribute to. We believe that great software is built collaboratively, not in isolation.

### Our Philosophy

- **Open by default** — All code is public. The entire platform is transparent and auditable.
- **Community-driven** — Features, improvements, and direction are shaped by the community.
- **Educational first** — The project is designed to be a learning resource for modern DevOps practices.
- **Inclusive** — Whether you're a seasoned engineer or a student writing your first Dockerfile, you're welcome here.
- **Practical** — We build things that work, solve real problems, and are easy to use.

### What You Can Do

| Activity | How It Helps |
|----------|-------------|
| 🏗️ **Build new features** | Extend the platform with new capabilities |
| 🔧 **Improve existing functionality** | Make things faster, smoother, and more reliable |
| 🐛 **Fix bugs** | Help squash issues and improve stability |
| 📖 **Improve documentation** | Make the project more accessible to newcomers |
| ⚡ **Optimize performance** | Reduce build times, memory usage, and latency |
| 🔌 **Add integrations** | Connect CloudDeploy with new tools and services |
| 🎨 **Improve UI/UX** | Make the dashboard more intuitive and beautiful |
| 💡 **Suggest new ideas** | Propose features that would benefit everyone |
| 🌍 **Share the project** | Grow the community and bring in fresh perspectives |

> **Every contribution — whether code, documentation, testing, design, or ideas — is valuable and appreciated.**

---

## 🤝 Contributing

We welcome contributions from developers around the world. Whether you're fixing bugs, improving documentation, adding new features, optimizing performance, or proposing new ideas — your contribution is always appreciated.

### Ways to Contribute

| Area | How to Help |
|------|-------------|
| 🐛 **Bug Fixes** | Find and fix issues in the codebase |
| ✨ **New Features** | Build something new and useful |
| 📖 **Documentation** | Improve README, docs, comments, and guides |
| 🧪 **Testing** | Add unit, integration, or E2E tests |
| ⚡ **Performance** | Optimize build times, API responses, and resource usage |
| 🎨 **UI/UX** | Improve the dashboard design and user experience |
| 🔌 **Integrations** | Add support for new services and tools |
| 🌍 **Localization** | Help translate the dashboard into other languages |

### Getting Started

1. 🍴 **Fork the repository** — Create your own copy on GitHub
2. 🌿 **Create a feature branch** — `git checkout -b feature/amazing-feature`
3. ✏️ **Make your changes** — Follow existing code conventions and patterns
4. ✅ **Test your changes** — Ensure nothing is broken
5. 📝 **Commit your changes** — `git commit -m "feat: add amazing feature"`
6. 📤 **Push your branch** — `git push origin feature/amazing-feature`
7. 🔀 **Open a Pull Request** — Describe your changes in detail

### Contribution Guidelines

- Follow the existing code style and project conventions
- Write clear, descriptive commit messages
- Add comments for complex logic or non-obvious decisions
- Update documentation when adding or changing features
- Ensure Docker builds are not broken
- Test with Docker Compose before submitting
- All contributions are reviewed before being merged

> **Your contribution, no matter how small, makes a difference. Thank you!** ❤️

---

## 💡 Feature Requests

We ❤️ community-driven ideas! If you have suggestions for improving CloudDeploy — whether it's a new feature, an integration, a UI improvement, or an entirely new module — we want to hear from you.

### How to Submit a Feature Request

Open a [GitHub Issue](https://github.com/YOUR_USERNAME/clouddeploy-local/issues/new) with the following:

1. **A clear title** describing the feature
2. **A detailed description** of what it should do
3. **Use cases** — How would this feature be used in practice?
4. **Why it matters** — What problem does it solve?
5. **Alternatives considered** — Any other approaches you've thought about
6. **Additional context** — Screenshots, mockups, references, related projects

### What Happens Next

- Popular requests are added to the [Roadmap](#-roadmap)
- High-impact features are prioritized for upcoming releases
- You may be invited to collaborate on the implementation
- Community upvotes help us decide what to build next

> **Every suggestion is appreciated. Don't hesitate to share your ideas!**

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 🙏 Credits

CloudDeploy Local was built with inspiration from:

- [Heroku](https://www.heroku.com/) — Platform-as-a-Service pioneer
- [Render](https://render.com/) — Modern cloud platform
- [Railway](https://railway.app/) — Developer-first deployment platform
- [Coolify](https://coolify.io/) — Self-hosted PaaS alternative
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) — Local Kubernetes

---

## 🌱 Built for the Community

CloudDeploy is **built to evolve with the community**. Whether you're a student learning DevOps, a developer building your next project, or a platform engineer experimenting with Kubernetes — this project is designed for you.

We encourage you to:

- 🧠 **Learn** from the codebase and architecture
- 🛠️ **Customize** the platform to fit your needs
- 🔌 **Extend** it with new features and integrations
- 📤 **Share** your improvements with the community

The long-term goal is to build a **modern, educational, open-source local PaaS** — together with the community. Every contribution, no matter how small, helps us move closer to that vision.

---

## 📬 Contact & Maintainer

**Project Maintainer:**

| Field | Value |
|-------|-------|
| **Name:** | _[Your Name]_ |
| **Email:** | _[your.email@example.com]_ |
| **GitHub:** | _[https://github.com/YOUR_USERNAME](https://github.com/YOUR_USERNAME)_ |
| **LinkedIn:** | _[https://linkedin.com/in/YOUR_PROFILE](https://linkedin.com/in/YOUR_PROFILE)_ |
| **Portfolio:** | _[https://your-portfolio.com](https://your-portfolio.com)_ |
| **Instagram:** | _[https://instagram.com/YOUR_HANDLE](https://instagram.com/YOUR_HANDLE)_ |
| **Website:** | _[https://your-website.com](https://your-website.com)_ |

---

## ⭐ Support the Project

If you find CloudDeploy useful, here's how you can support it:

| Action | How |
|--------|-----|
| ⭐ **Star the repository** | Show your support on GitHub |
| 🍴 **Fork the project** | Create your own version and experiments |
| 🐛 **Report bugs** | [Open an Issue](https://github.com/YOUR_USERNAME/clouddeploy-local/issues/new) |
| 💡 **Suggest features** | Share your ideas for improvement |
| 🤝 **Contribute code** | Submit a Pull Request with your changes |
| 📢 **Share with others** | Spread the word in your network |
| 📝 **Write about it** | Blog posts, tutorials, and reviews help the community |

---

<div align="center">

**Built with ❤️ for the DevOps and Open Source Community**

⭐ **If you find this project useful, give it a star!** ⭐

**Happy Deploying! 🚀**

</div>
