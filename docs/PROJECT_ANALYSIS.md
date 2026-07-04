# CloudDeploy Local — Project Analysis Report

**Generated:** July 4, 2026

---

## 1. Project Overview

| Attribute | Value |
|-----------|-------|
| **Project Name** | CloudDeploy Local |
| **Purpose** | A self-hosted Platform-as-a-Service (PaaS) inspired by Render, Railway, and Heroku. Enables developers to deploy, monitor, and manage containerized applications locally using Docker Desktop Kubernetes, with a full observability stack and local AWS-compatible services via Floci. |
| **Current Status** | Under active development — the main backend API (Express), frontend dashboard (React), and deployment engine (Node.js) are built out. Monitoring, logging, CI/CD, and Floci backends are stubbed/placeholder. No Dockerfiles or Docker Compose configuration exist yet. No GitHub Actions workflows exist yet. |
| **Language** | JavaScript (ES Modules) — backend, frontend, and deployment engine all use Node.js |
| **Package Manager** | npm |

### Architecture

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                              Developer / User                                │
└──────────────────────────────┬───────────────────────────────────────────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   React Dashboard   │  (Vite + Tailwind + Framer Motion)
                    │    (port 5173)      │
                    └─────────┬───────────┘
                              │ HTTP/JSON (axios)
                              ▼
                    ┌─────────────────────┐
                    │   Backend API       │  (Express + Mongoose + JWT)
                    │    (port 5000)      │
                    ├─────────────────────┤
                    │  ┌───────────────┐  │
                    │  │ Deployment    │  │  (performs Docker + K8s ops)
                    │  │ Engine Core   │  │
                    │  └───────┬───────┘  │
                    └──────────┼──────────┘
                               │
                ┌──────────────┼──────────────────┐
                ▼              ▼                   ▼
        ┌────────────┐ ┌────────────┐ ┌────────────────────┐
        │  Docker    │ │ Kubernetes │ │   MongoDB          │
        │  Daemon    │ │  (Docker   │ │   (Mongoose ODM)   │
        │            │ │  Desktop)  │ │                    │
        └────────────┘ └────────────┘ └────────────────────┘
```

### High-Level Workflow

1. User interacts with the React Dashboard (or API directly via Bruno/Postman)
2. Dashboard communicates with the Backend API over HTTP/JSON
3. Backend persists data to MongoDB and calls the Deployment Engine for K8s operations
4. Deployment Engine generates K8s manifests and applies them against Docker Desktop Kubernetes
5. Docker Engine operations (build, push, pull) are executed via shell commands to the Docker daemon
6. Monitoring & Logging data is read back from the Metric model (stubbed — not yet connected to Prometheus/Loki)

---

## 2. Folder Structure

```
clouddeploy-local/
│
├── .gitignore
├── LICENSE
├── README.md
├── docker-compose.yml                # EMPTY — no containers defined yet
│
├── backend/                          # Main API server (Express + Mongoose)
│   ├── package.json                  # Dependencies: express, mongoose, jwt, swagger, etc.
│   ├── src/
│   │   ├── server.js                 # Entry point — env validation, DB connect, graceful shutdown
│   │   ├── app.js                    # Express app — middleware, Swagger, routes, error handling
│   │   ├── config/
│   │   │   └── database.js           # Mongoose connection
│   │   ├── routes/
│   │   │   ├── index.js              # Route aggregator
│   │   │   ├── auth.routes.js        # /api/auth/* (register, login, refresh, me)
│   │   │   ├── dashboard.routes.js   # /api/dashboard
│   │   │   ├── deployment.routes.js  # /api/deployments (CRUD)
│   │   │   ├── registry.routes.js    # /api/registry (list, sync, tags, delete)
│   │   │   ├── monitoring.routes.js  # /api/monitoring (metrics, summary)
│   │   │   ├── logging.routes.js     # /api/logs
│   │   │   └── floci.routes.js       # /api/floci/* (S3, Lambda, IAM, SNS, SQS)
│   │   ├── controllers/              # Request handlers (thin — delegates to services)
│   │   │   ├── auth.controller.js
│   │   │   ├── dashboard.controller.js
│   │   │   ├── deployment.controller.js
│   │   │   ├── registry.controller.js
│   │   │   ├── monitoring.controller.js
│   │   │   ├── logging.controller.js
│   │   │   └── floci.controller.js
│   │   ├── services/                 # Business logic layer
│   │   │   ├── auth.service.js       # Register, login, refresh, getCurrentUser
│   │   │   ├── dashboard.service.js  # Returns hardcoded mock data
│   │   │   ├── deployment.service.js # CRUD + calls deployment.engine
│   │   │   ├── registry.service.js   # CRUD + sync from Docker
│   │   │   ├── monitoring.service.js # Query Metric model
│   │   │   └── logging.service.js    # Query Metric model (filtered by source: "loki")
│   │   ├── engine/                   # Core infrastructure operations
│   │   │   ├── deployment.engine.js  # Orchestrator — build, push, manifests, K8s actions (mostly placeholders)
│   │   │   ├── docker.engine.js      # execSync wrappers for Docker CLI (build, tag, push, pull, rmi, images)
│   │   │   ├── k8s.engine.js         # @kubernetes/client-node — list/CRUD pods, deployments, services
│   │   │   └── floci.engine.js       # ALL placeholders — no real S3/Lambda/IAM/SNS/SQS backing
│   │   ├── models/                   # Mongoose schemas
│   │   │   ├── User.js
│   │   │   ├── DeploymentHistory.js
│   │   │   ├── Metric.js
│   │   │   └── RegistryImage.js
│   │   ├── middleware/
│   │   │   ├── auth.js               # JWT authenticate + authorize (roles)
│   │   │   ├── errorHandler.js       # Centralized error handling
│   │   │   ├── notFound.js           # 404 handler
│   │   │   ├── rateLimiter.js        # express-rate-limit configs
│   │   │   └── validate.js           # Manual field validation middleware
│   │   └── utils/
│   │       ├── ApiError.js           # Error class with static factories
│   │       ├── ApiResponse.js        # Response envelope class
│   │       ├── asyncHandler.js       # Async error wrapper
│   │       └── logger.js             # Simple console-based logger
│   ├── docs/
│   │   └── API_REFERENCE.md          # Comprehensive Markdown API reference
│   ├── bruno/                        # Bruno API client collections
│   │   ├── collection.bru
│   │   └── ... (Auth, Dashboard, Deployments, Floci, Logging, Monitoring, Registry, System)
│   └── postman/
│       └── collection.json           # Postman collection export
│
├── dashboard/                        # React frontend (Vite + Tailwind v4)
│   ├── package.json
│   ├── vite.config.js                # @vitejs/plugin-react + @tailwindcss/vite
│   ├── index.html
│   ├── eslint.config.js
│   ├── src/
│   │   ├── main.jsx                  # Entry — ReactDOM.createRoot
│   │   ├── App.jsx                   # Routes wrapper
│   │   ├── routes/
│   │   │   └── AppRoutes.jsx         # BrowserRouter with 7 routes
│   │   ├── layouts/
│   │   │   └── DashboardLayout.jsx   # Sidebar + Navbar + main content
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx         # / — stats, resource usage, recent activity
│   │   │   ├── Deployments.jsx       # /deployments — table, drawer, dialogs
│   │   │   ├── Clusters.jsx          # /clusters — K8s resource browser (14 tabs)
│   │   │   ├── Monitoring.jsx        # /monitoring — 9 metrics widgets
│   │   │   ├── Logs.jsx              # /logs — log viewer with source filter
│   │   │   ├── Registry.jsx          # /registry — image list, drawer, delete
│   │   │   ├── Settings.jsx          # /settings — 9 settings sections
│   │   │   └── NotFound.jsx          # 404 page
│   │   ├── components/
│   │   │   ├── ui/                   # Reusable primitives (Button, Card, Sidebar, etc.)
│   │   │   ├── dashboard/            # Dashboard page components
│   │   │   ├── deployments/          # Deployment page components
│   │   │   ├── clusters/             # Cluster page components
│   │   │   ├── monitoring/           # Monitoring page components
│   │   │   ├── logs/                 # Log page components
│   │   │   ├── registry/             # Registry page components
│   │   │   └── settings/             # Settings page components
│   │   ├── config/
│   │   │   └── navigation.js         # Sidebar nav items
│   │   └── styles/
│   │       └── globals.css           # Tailwind import + custom CSS vars
│   └── README.md
│
├── deployment-engine/                # Standalone deployment microservice
│   ├── package.json
│   ├── src/
│   │   ├── server.js                 # Entry — starts on port 6000
│   │   ├── app.js                    # Express app with /health and /deploy routes
│   │   ├── routes/
│   │   │   └── deployment.routes.js  # POST /deploy
│   │   ├── controllers/
│   │   │   └── deployment.controller.js
│   │   ├── services/
│   │   │   └── deployment.service.js # Generates manifests, creates K8s deployment + service
│   │   ├── kubernetes/
│   │   │   ├── client.js             # K8s API client init (loads from default kubeconfig)
│   │   │   ├── deployment.js         # createNamespacedDeployment
│   │   │   └── service.js            # createNamespacedService
│   │   └── manifests/
│   │       ├── deployment.manifest.js # K8s Deployment manifest generator
│   │       └── service.manifest.js    # K8s Service manifest generator (ClusterIP)
│
└── docs/
    ├── API_REFERENCE.md              # (pre-existing) Full API reference
    └── PROJECT_ANALYSIS.md           # THIS FILE
```

---

## 3. Frontend

### Tech Stack

| Technology | Version | Usage |
|------------|---------|-------|
| React | 19.2.7 | UI library |
| Vite | 8.1.1 | Build tool / dev server |
| Tailwind CSS | 4.3.2 | Utility-first CSS (with @tailwindcss/vite plugin) |
| React Router | 7.18.1 | Client-side routing |
| Framer Motion | 12.42.2 | Page/component animations |
| Lucide React | 1.23.0 | Icon library |
| Axios | 1.18.1 | HTTP client |
| React Hot Toast | 2.6.0 | Toast notifications |

### Pages

| Route | Page | Description |
|-------|------|-------------|
| `/` | Dashboard | Header, stats cards, resource usage, recent deployments, cluster health, quick actions, activity timeline |
| `/deployments` | Deployments | Searchable/filterable table, deployment detail drawer, scale dialog, delete dialog |
| `/clusters` | Clusters | Overview tab + 13 K8s resource tabs (Nodes, Namespaces, Pods, Deployments, ReplicaSets, DaemonSets, StatefulSets, Services, Ingress, PVs, PVCs, ConfigMaps, Secrets, Events) — all mock data |
| `/monitoring` | Monitoring | CPU, Memory, Network, Disk charts (sparkline SVGs), Node usage, Container usage, Pod health, Alerts panel |
| `/logs` | Logs | Source filter + real-time log viewer with auto-scroll and simulated log entries |
| `/registry` | Registry | Search bar, image table, image detail drawer, delete dialog |
| `/settings` | Settings | Sidebar with 9 sections: General, Docker, Kubernetes, Registry, Floci, Theme, Profile, Notifications, About |
| `*` | 404 | Simple "Page Not Found" |

### State Management

- **No global state library** (no Redux, Zustand, or Context API for global state)
- All state is **local component state** using `useState` and `useCallback` hooks
- No authentication state management — the frontend does not implement login/auth UI
- No API call integration — all data is **hardcoded mock data** from `component/*/data.js` files

### API Integration

- **Axios is installed** as a dependency but **not used** anywhere in the codebase
- **No API calls** are made from the frontend — all data is local mock data
- The frontend is essentially a static UI prototype

### Completion Estimate: ~60%

### Missing Features

- Login/Authentication UI (no login page exists)
- Registration UI
- Real API integration (axios not wired up)
- Authentication state management / token storage
- Real-time log streaming (WebSocket or polling)
- Real metric data from Prometheus
- Deployment create form (the CreateDeploymentModal component exists but is a basic modal)
- Routing guards / protected routes
- User profile page
- Error boundaries
- Loading states (skeleton components exist but are not used)
- Empty states
- End-to-end testing
- Unit tests

---

## 4. Backend

### Tech Stack

| Technology | Version | Usage |
|------------|---------|-------|
| Express | 5.2.1 | HTTP framework |
| Mongoose | 9.7.3 | MongoDB ODM |
| JSON Web Token | 9.0.3 | JWT auth |
| bcryptjs | 3.0.3 | Password hashing |
| express-rate-limit | 8.5.2 | Rate limiting |
| swagger-jsdoc | 6.3.0 | OpenAPI spec generation |
| swagger-ui-express | 5.0.1 | Swagger UI rendering |
| helmet | 8.2.0 | Security headers |
| compression | 1.8.1 | Gzip compression |
| morgan | 1.11.0 | HTTP request logging |
| dotenv | 17.4.2 | Environment variables |
| @kubernetes/client-node | 1.4.0 | K8s API client (in deployment engine too) |

### Routes & Modules

#### System (`app.js`)
- `GET /health` — Simple health check
- `GET /ready` — Readiness check (checks MongoDB connection state)
- `GET /api/docs` — Swagger UI
- `GET /api/docs.json` — OpenAPI spec JSON

#### Auth Routes (`/api/auth`)
- `POST /register` — Create user (rate limited)
- `POST /login` — Authenticate (rate limited)
- `POST /refresh` — Refresh JWT (auth required)
- `GET /me` — Get current user (auth required)

#### Dashboard (`/api/dashboard`)
- `GET /` — Returns hardcoded mock stats/activity (no auth required)

#### Deployments (`/api/deployments`)
- `POST /` — Create deployment (validated, rate limited) — calls deployment engine
- `GET /` — List deployments (filtered, paginated, sorted)
- `GET /:id` — Get deployment by ID
- `PUT /:id` — Update deployment (validated, rate limited)
- `DELETE /:id` — Delete deployment

#### Registry (`/api/registry`)
- `GET /` — List registry images (paginated, searchable, auth required)
- `GET /sync` — Sync Docker images into registry DB (auth required)
- `GET /:name/tags` — Get tags for an image (auth required)
- `DELETE /:id` — Delete registry image (auth required)

#### Monitoring (`/api/monitoring`)
- `GET /` — Query metrics (filterable by source, metricName, date range; auth required)
- `GET /summary` — Get metric source counts & latest (auth required)

#### Logging (`/api/logs`)
- `GET /` — Query logs (filterable by level, source, search, date range; auth required)

#### Floci (`/api/floci`)
- **S3**: `GET /s3/buckets`, `POST /s3/buckets` (admin), `GET /s3/buckets/:bucketName/objects`
- **Lambda**: `GET /lambda/functions`, `POST /lambda/functions/:functionName/invoke`
- **IAM**: `GET /iam/users`, `POST /iam/users` (admin)
- **SNS**: `GET /sns/topics`, `POST /sns/publish`
- **SQS**: `GET /sqs/queues`, `POST /sqs/send`

### Controllers
Thin request handlers that extract data from `req` and delegate to service layer, then send responses via `ApiResponse`.

### Services
Business logic layer that performs DB operations and calls engine modules:
- **auth.service.js** — Register (hash password, create user, generate JWT), login, refresh, getCurrentUser
- **dashboard.service.js** — Returns hardcoded mock data
- **deployment.service.js** — Creates DeploymentHistory record, calls deployment.engine
- **registry.service.js** — CRUD operations on RegistryImage model, syncs from Docker
- **monitoring.service.js** — Queries Metric model with filters
- **logging.service.js** — Queries Metric model with `source: "loki"` filter

### Models
- **User** — email (unique, lowercase), password (select: false, min 8), name, role (user/admin/viewer), isActive, timestamps
- **DeploymentHistory** — applicationName, namespace, dockerImage, imageTag, replicas, containerPort, status (enum), deployedBy, commitSha, deploymentMessage, timestamps
- **Metric** — source (enum: prometheus/grafana/node_exporter/cadvisor), metricName, value (Mixed), labels (Map), timestamp, timestamps; compound index on (source, metricName, timestamp)
- **RegistryImage** — name, tag, digest, size, registry, pulledAt, timestamps; unique compound index on (name, tag)

### Middleware
- **auth.js** — JWT verification + role-based authorization (`authenticate`, `authorize(...roles)`)
- **errorHandler.js** — Handles Mongoose validation, duplicate key, CastError, ApiError, and generic errors
- **notFound.js** — 404 JSON response
- **rateLimiter.js** — 3 rate limiters: general API (100/15min), auth (10/15min), deployments (50/hour)
- **validate.js** — Manual field validation based on rule objects (type, required, minLength, maxLength, min, max, enum)

### Utilities
- **ApiError.js** — Custom error class with static factories (badRequest, unauthorized, forbidden, notFound, conflict, internal)
- **ApiResponse.js** — Response envelope with .send(res) method + static factories (success, created, noContent)
- **asyncHandler.js** — Wraps async route handlers to catch promise rejections
- **logger.js** — Simple console logger with log levels (debug/info/warn/error)

### All API Endpoints

| Method | Path | Auth | Rate Limited | Description |
|--------|------|------|-------------|-------------|
| GET | /health | No | General | Health check |
| GET | /ready | No | General | Readiness check |
| POST | /api/auth/register | No | Auth | Register user |
| POST | /api/auth/login | No | Auth | Login |
| POST | /api/auth/refresh | Yes | Auth | Refresh token |
| GET | /api/auth/me | Yes | General | Get current user |
| GET | /api/dashboard | No | General | Dashboard overview |
| POST | /api/deployments | No | Deploy | Create deployment |
| GET | /api/deployments | No | General | List deployments |
| GET | /api/deployments/:id | No | General | Get deployment |
| PUT | /api/deployments/:id | No | Deploy | Update deployment |
| DELETE | /api/deployments/:id | No | General | Delete deployment |
| GET | /api/registry | Yes | General | List images |
| GET | /api/registry/sync | Yes | General | Sync registry |
| GET | /api/registry/:name/tags | Yes | General | Get image tags |
| DELETE | /api/registry/:id | Yes | General | Delete image |
| GET | /api/monitoring | Yes | General | Get metrics |
| GET | /api/monitoring/summary | Yes | General | Metric summary |
| GET | /api/logs | Yes | General | Get logs |
| GET | /api/floci/s3/buckets | Yes | General | List S3 buckets |
| POST | /api/floci/s3/buckets | Yes (admin) | General | Create S3 bucket |
| GET | /api/floci/s3/buckets/:name/objects | Yes | General | List objects |
| GET | /api/floci/lambda/functions | Yes | General | List Lambda functions |
| POST | /api/floci/lambda/functions/:name/invoke | Yes | General | Invoke Lambda |
| GET | /api/floci/iam/users | Yes | General | List IAM users |
| POST | /api/floci/iam/users | Yes (admin) | General | Create IAM user |
| GET | /api/floci/sns/topics | Yes | General | List SNS topics |
| POST | /api/floci/sns/publish | Yes | General | Publish to SNS |
| GET | /api/floci/sqs/queues | Yes | General | List SQS queues |
| POST | /api/floci/sqs/send | Yes | General | Send to SQS |

**Total: 30 endpoints**

---

## 5. Authentication

### JWT Flow

1. User registers (`POST /api/auth/register`) or logs in (`POST /api/auth/login`)
2. Server validates credentials, generates a JWT with payload `{ id, email, role }`
3. JWT is signed with HS256 using `JWT_SECRET` (env var, fallback: `"clouddeploy-dev-secret"`)
4. Token expiry: 7 days (configurable via `JWT_EXPIRES_IN` env var)
5. Response returns `{ user: { id, email, name, role }, token }`

### Refresh Tokens

- `POST /api/auth/refresh` — Requires valid JWT in Authorization header
- Uses the same `generateToken()` function — creates a new token with the same expiry
- No refresh token rotation or refresh token storage (no separate refresh token model)

### Middleware

**`authenticate` middleware:**
1. Extracts `Bearer <token>` from the `Authorization` header
2. Verifies the JWT with `jwt.verify(token, JWT_SECRET)`
3. Fetches the user from MongoDB to confirm they exist and are active
4. Attaches `req.user` with the full user document (lean)
5. Returns 401 for missing/invalid/expired tokens or inactive users

**`authorize(...roles)` middleware:**
1. Checks if `req.user.role` is in the allowed roles array
2. Returns 403 if the user lacks permission

### Roles

| Role | Description | Access |
|------|-------------|--------|
| `user` | Standard user | Basic read/write |
| `admin` | Administrator | Elevated permissions (create S3 buckets, IAM users) |
| `viewer` | Read-only | Future use |

### Protected Routes

Floci endpoints require authentication. S3 bucket creation (`POST /api/floci/s3/buckets`) and IAM user creation (`POST /api/floci/iam/users`) additionally require the `admin` role. Registry, Monitoring, and Logging endpoints require authentication. Auth refresh and /me endpoints require authentication. Dashboard and Deployments endpoints are currently **unauthenticated** (no auth middleware applied).

---

## 6. Deployment Engine

### Folder Structure

```
deployment-engine/
├── package.json
├── src/
│   ├── server.js                     # Entry (port 6000) — dotenv + listen
│   ├── app.js                        # Express: cors, helmet, json, morgan, /health, /deploy
│   ├── routes/
│   │   └── deployment.routes.js      # POST /deploy
│   ├── controllers/
│   │   └── deployment.controller.js  # Thin handler
│   ├── services/
│   │   └── deployment.service.js     # Generates manifests + creates K8s resources
│   ├── kubernetes/
│   │   ├── client.js                 # K8s config (loadFromDefault), AppsV1Api + CoreV1Api
│   │   ├── deployment.js             # createNamespacedDeployment
│   │   └── service.js                # createNamespacedService
│   └── manifests/
│       ├── deployment.manifest.js    # Generates K8s Deployment YAML object
│       └── service.manifest.js       # Generates K8s Service YAML object (ClusterIP)
```

### Current Architecture

The deployment engine is a **standalone Express microservice** on port 6000. It is **not called by the backend API** — the backend has its own `deployment.engine.js` with placeholders. The deployment engine's service generates K8s manifests and calls `@kubernetes/client-node` to create resources in the cluster. However, the `deployment.service.js` calls `createDeployment` and `createService` without error handling for the K8s API calls.

### Docker Integration

The deployment engine itself has **no Docker integration** — building/pushing images happens in the backend's `docker.engine.js`. The deployment engine assumes the image already exists in the registry.

### Kubernetes Integration

- Uses `@kubernetes/client-node` v1.4.0
- `kubeConfig.loadFromDefault()` — reads `~/.kube/config`
- Creates namespaced Deployments and Services via `AppsV1Api` and `CoreV1Api`
- No logic to check if a resource already exists before creating
- No rollout status monitoring
- No rollback logic
- No scaling via API (though `k8s.engine.js` in the backend has a `scaleDeployment` function)

### Registry Integration

None in the deployment engine — the `dockerImage` field is used directly as the container image name in the manifest.

### Manifest Generation

- **Deployment**: `apps/v1`, sets replicas, selector, container name, image, containerPort
- **Service**: `v1`, ClusterIP type, TCP port 80 → targetPort from config

### Current Limitations

- No health checks / liveness probes in manifests
- No resource requests/limits
- No environment variables
- No ConfigMap/Secret mounting
- No ingress generation
- No HPA (horizontal pod autoscaler)
- No rollout strategy configuration (defaults to RollingUpdate)
- No error handling if K8s API call fails
- No idempotency (would fail on re-deploy if resources already exist)

---

## 7. Docker

### Current State

- **No Dockerfiles exist** in the entire project
- **docker-compose.yml** exists but is **empty** (no services defined)
- **No Docker images** are built as part of the project setup
- **docker.engine.js** in the backend provides shell-based Docker operations:
  - `buildImage()` — `docker build -t`
  - `tagImage()` — `docker tag`
  - `pushImage()` — `docker push`
  - `pullImage()` — `docker pull`
  - `deleteImage()` — `docker rmi`
  - `listImages()` — `docker images --format`
- These are functional (run real Docker CLI commands via `execSync`)
- `syncRegistryFromDocker()` in registry.service.js calls `listImages()` and upserts into the RegistryImage collection

### Local Registry

- Referenced as `localhost:5000` (default in RegistryImage model)
- Registry configuration available in dashboard settings (Settings → Registry)
- No actual registry container is configured in Docker Compose

### Current Workflow

1. User runs Docker CLI commands or the backend API calls docker.engine.js functions
2. Docker daemon processes build/tag/push/pull operations
3. Registry sync reads local Docker images and stores them in MongoDB

---

## 8. Kubernetes

### Current Manifests

Two manifest generators exist in `deployment-engine/src/manifests/`:
- **Deployment Manifest** (`deployment.manifest.js`): Minimal — apiVersion, kind, metadata (name, namespace, labels), spec (replicas, selector, template with container name/image/ports)
- **Service Manifest** (`service.manifest.js`): Minimal — ClusterIP, port 80 → targetPort

### Current Deployments

The backend's `k8s.engine.js` provides:
- `listDeployments(namespace)` — Lists deployments with name, namespace, replicas, status
- `createDeployment(manifest)` — Creates a deployment
- `deleteDeployment(name, namespace)` — Deletes a deployment
- `scaleDeployment(name, replicas, namespace)` — Patches deployment scale

### Services

- `listServices(namespace)` — Lists services with type, clusterIP, ports
- Backend engine and deployment engine both can create ClusterIP services

### Namespaces

- `default` is used when no namespace is specified
- No namespace management logic (create/list namespaces) built into the engine

### Cluster Communication

- Both engines use `@kubernetes/client-node` with `kubeConfig.loadFromDefault()`
- Designed for Docker Desktop's built-in Kubernetes cluster
- No multi-cluster support
- No context switching

### Node.js Kubernetes Client Usage

- `AppsV1Api`: `listNamespacedDeployment`, `createNamespacedDeployment`, `deleteNamespacedDeployment`, `patchNamespacedDeploymentScale`
- `CoreV1Api`: `listNamespacedPod`, `listNamespacedService`, `createNamespacedService`

---

## 9. Monitoring

### Current Implementation

- **Prometheus**: Referenced in the Metric model as a source enum value. **No Prometheus configuration, container, or integration exists.**
- **Grafana**: Referenced in the Metric model. **No Grafana configuration, container, or integration exists.**
- **cAdvisor**: Referenced in the Metric model. **No cAdvisor configuration or container exists.**
- **Node Exporter**: Referenced in the Metric model. **No Node Exporter configuration or container exists.**

### What Actually Exists

- A **Metric model** (`backend/src/models/Metric.js`) that stores metrics with fields: source (enum), metricName, value, labels, timestamp
- A **monitoring service** that queries the Metric collection with filters
- A **monitoring controller** that exposes `GET /api/monitoring` and `GET /api/monitoring/summary`
- A **rich monitoring dashboard UI** with sparkline charts, node usage, container usage, pod health, and alerts — all populated with mock data
- The Monitoring page has 8 component widgets + time-series chart component

### Status: **100% placeholder** — no actual Prometheus/Grafana/exporters deployed

---

## 10. Logging

### Current Implementation

- **Loki**: Referenced in the logging service as `source: "loki"` filter. **No Loki configuration, container, or integration exists.**
- **Promtail**: **No Promtail configuration, container, or integration exists.**

### What Actually Exists

- A **logging service** (`backend/src/services/logging.service.js`) that queries the Metric collection filtered by `source: "loki"`
- A **logging controller** with `GET /api/logs` endpoint
- A **Logs page** UI with source filter, auto-scrolling log viewer, and mock data generation
- `logsData.js` generates realistic-looking log entries with templates for INFO, WARN, ERROR, DEBUG levels

### Status: **100% placeholder** — no actual Loki/Promtail deployed

---

## 11. Floci

Floci is a set of **placeholder AWS-compatible local services**. All engines in `backend/src/engine/floci.engine.js` return hardcoded empty data.

### S3
- `listBuckets()` — Returns `{ buckets: [] }`
- `createBucket(bucketName)` — Returns `{ bucket: bucketName }`
- `listObjects(bucketName)` — Returns `{ objects: [] }`
- Routes: `GET /api/floci/s3/buckets`, `POST /api/floci/s3/buckets` (admin), `GET /api/floci/s3/buckets/:name/objects`

### Lambda
- `listFunctions()` — Returns `{ functions: [] }`
- `invokeFunction(functionName, payload)` — Returns `{ result: null }`
- Routes: `GET /api/floci/lambda/functions`, `POST /api/floci/lambda/functions/:name/invoke`

### IAM
- `listUsers()` — Returns `{ users: [] }`
- `createUser(username)` — Returns `{ username }`
- Routes: `GET /api/floci/iam/users`, `POST /api/floci/iam/users` (admin)

### SNS
- `listTopics()` — Returns `{ topics: [] }`
- `publishToTopic(topicArn, message)` — Returns `{ messageId: crypto.randomUUID() }`
- Routes: `GET /api/floci/sns/topics`, `POST /api/floci/sns/publish`

### SQS
- `listQueues()` — Returns `{ queues: [] }`
- `sendMessage(queueUrl, messageBody)` — Returns `{ messageId: crypto.randomUUID() }`
- Routes: `GET /api/floci/sqs/queues`, `POST /api/floci/sqs/send`

### Status: **100% placeholder** — no actual S3/MinIO/Lambda/IAM/SNS/SQS backing services

---

## 12. CI/CD

### Current Status: **Not implemented**

- **No `.github/` directory** exists
- **No GitHub Actions workflows** exist
- **No CI/CD pipeline** is configured
- The project plan describes a pipeline (Git push → tests → build → scan → push → deploy → health check → rollback) but none of this has been implemented

---

## 13. Database

### Platform: MongoDB

### Collections

| Collection | Model | Purpose | Key Fields |
|------------|-------|---------|------------|
| `users` | User.js | User accounts | email (unique), password (select:false), name, role, isActive |
| `deploymenthistories` | DeploymentHistory.js | Deployment records | applicationName, dockerImage, containerPort, status, replicas, namespace, imageTag |
| `metrics` | Metric.js | Monitoring & log data | source (enum), metricName, value (Mixed), labels (Map), timestamp |
| `registryimages` | RegistryImage.js | Docker image registry | name+tag (unique compound), digest, size, registry, pulledAt |

### Relationships

- **No explicit relationships** between collections (MongoDB, no foreign keys)
- `DeploymentHistory.deployedBy` is a string reference to a username/email (not a User ObjectId)
- `Metric.labels` is a Map field used for arbitrary metadata
- `RegistryImage.registry` is a string identifying which registry the image is stored in

---

## 14. API Documentation

### Swagger / OpenAPI

- Integrated via `swagger-jsdoc` and `swagger-ui-express`
- Swagger spec generated from JSDoc `@openapi` annotations in route files and `app.js`
- Served at `GET /api/docs` (Swagger UI) and `GET /api/docs.json` (JSON spec)
- All 30 endpoints are documented with request/response schemas
- Security schemes defined: `bearerAuth` (JWT)
- Workaround for Windows glob issues: route/model files are enumerated explicitly with `fs.readdirSync`

### Postman

- Postman collection export at `backend/postman/collection.json`
- Covers all API endpoints

### Bruno

- Bruno collection at `backend/bruno/` with individual `.bru` files organized by category:
  - Auth (GetCurrentUser, Login, Refresh, Register)
  - Dashboard (GetDashboardOverview)
  - Deployments (Create, Delete, GetById, List, Update)
  - Floci (IAM, Lambda, S3, SNS, SQS — 10 files)
  - Logging (GetLogs)
  - Monitoring (GetMetrics, GetMetricSummary)
  - Registry (Delete, GetTags, List, Sync)
  - System (Health, Ready)
- Collection file: `backend/bruno/collection.bru`

### API Reference (Markdown)

- Located at `backend/docs/API_REFERENCE.md`
- Comprehensive documentation covering all endpoints with request/response examples, curl commands, and error codes

---

## 15. Current Deployment Flow

### What Happens After Clicking "Deploy" (Simulated)

1. **Frontend** (Dashboard):
   - CreateDeploymentModal captures form data (applicationName, dockerImage, containerPort, replicas, namespace, etc.)
   - On submit, shows a toast notification (no actual API call — uses mock data)
   - The API is not called from the frontend

### What Should Happen (Backend Flow, If Triggered via API/Postman):

1. **POST /api/deployments** is received by Express
2. **deploymentLimiter** rate limit middleware checks limits
3. **validate(createDeploymentRules)** validates required fields
4. **createDeployment controller** extracts `req.body` and calls `createDeploymentService`
5. **deployment.service.js**:
   - Creates a `DeploymentHistory` document in MongoDB with `status: "Pending"`
   - Calls `deployApplication(deployment)` from `deployment.engine.js`
6. **deployment.engine.js**:
   - Returns a hardcoded `{ success: true, deploymentId: crypto.randomUUID(), status: "Pending" }`
   - **Does NOT** actually: build the image, push to registry, generate manifests, or deploy to Kubernetes
7. Response returns to the client

### What the Deployment Engine Microservice Does (Separate Service):

1. `POST /deploy` is received on port 6000
2. `deploymentService` generates K8s Deployment + Service manifests
3. Calls `createDeployment` (K8s API) and `createService` (K8s API)
4. **No connection** between the backend API (port 5000) and the deployment engine (port 6000)

---

## 16. Current Limitations

### Critical Gaps

| Area | Limitation |
|------|------------|
| **Docker** | No Dockerfiles exist for any service (backend, dashboard, deployment-engine) |
| **Docker Compose** | `docker-compose.yml` is empty — no container orchestration defined |
| **CI/CD** | No GitHub Actions workflows exist — no automated pipeline |
| **Monitoring** | No Prometheus, Grafana, cAdvisor, or Node Exporter configured/deployed |
| **Logging** | No Loki or Promtail configured/deployed |
| **Floci** | All 11 engine functions are empty placeholders — no real service backing |
| **Frontend→API** | Frontend does not make any API calls — all data is mock/hardcoded |
| **Frontend Auth** | No login/register UI — no auth state management |
| **Auth** | Dashboard and Deployment routes have no auth middleware |
| **Deployment Engine** | No connection between backend API and deployment-engine microservice |
| **K8s Manifests** | No resource requests/limits, no probes, no env vars, no ConfigMaps, no Secrets |
| **K8s Deployments** | No rollout status monitoring, no rollback, no HPA, no idempotency |
| **Security** | No Trivy scanner configured, no image vulnerability scanning |
| **Testing** | No unit tests, no integration tests, no E2E tests |
| **Error Handling** | deployment-engine does not handle K8s API errors gracefully |

### Minor Gaps

- No loading states in frontend (Skeleton components exist but are unused)
- No error boundaries in React
- No protected route components
- No pagination component in UI library
- No empty state components
- `validate.js` middleware does not handle nested object validation
- `logger.js` is console-based — not integrated with Loki or any external log service
- No database seeding scripts
- No environment variable templates (`.env.example`)

---

## 17. Recommended Next Steps

Based strictly on the current project state, the following should be built next, in order:

### Phase A — Infrastructure Foundation

1. **Create Dockerfiles** for all three services (backend, dashboard, deployment-engine)
2. **Populate docker-compose.yml** with services: backend, dashboard, deployment-engine, MongoDB, Registry, Prometheus, Grafana, Loki, Promtail
3. **Add `.env` files** with defaults for all required environment variables

### Phase B — Frontend-Backend Integration

4. **Wire up Axios** in the frontend — create an API client module with base URL and JWT token injection
5. **Build Login page** — login form that calls `POST /api/auth/login` and stores JWT in memory/localStorage
6. **Build Register page** — registration form
7. **Add auth state management** — React Context or Zustand for user/token state
8. **Add protected routes** — redirect to login if no token
9. **Replace mock data** on all pages with real API calls

### Phase C — Deployment Pipeline

10. **Connect backend to deployment-engine** — make HTTP call from `deployment.engine.js` to the deployment-engine microservice
11. **Add idempotency** to deployment-engine — check if resource exists before creating
12. **Add health checks** and resource limits to K8s manifests
13. **Implement rollout status monitoring** — wait for deployment to become ready
14. **Build the Create Deployment modal** — wire up the form to `POST /api/deployments`

### Phase D — Monitoring & Logging

15. **Configure Prometheus** scrapers for node-exporter, cadvisor, and K8s metrics
16. **Configure Loki + Promtail** for log aggregation from all containers
17. **Build metric ingestion** — a service that scrapes Prometheus and stores in MongoDB (or connects directly)
18. **Build log ingestion** — connect to Loki API and display real logs in the dashboard

### Phase E — CI/CD

19. **Create GitHub Actions workflow** for CI (lint, typecheck, test)
20. **Create GitHub Actions workflow** for CD (build images, push to registry, call deployment API)

---

## 18. Architecture Diagram

```
┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│                                    USER (Browser)                                             │
│  ┌──────────────────────────────────────────────────────────────────────────────────────────┐ │
│  │                           React Dashboard (Vite dev:5173)                                │ │
│  │  ┌─────────┐ ┌──────────┐ ┌───────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐          │ │
│  │  │Dashboard│ │Deployments│ │ Clusters  │ │Monitoring│ │   Logs   │ │ Registry │          │ │
│  │  │  Page   │ │   Page    │ │   Page    │ │   Page   │ │   Page   │ │   Page   │          │ │
│  │  └────▲────┘ └────▲─────┘ └─────▲─────┘ └────▲─────┘ └────▲─────┘ └────▲─────┘          │ │
│  │       └────────────┴─────────────┴────────────┴────────────┴────────────┘                 │ │
│  │                            Axios (not wired yet)                                          │ │
│  └──────────────────────────────────┬───────────────────────────────────────────────────────┘ │
└─────────────────────────────────────┼─────────────────────────────────────────────────────────┘
                                      │ HTTP (localhost:5000)
                                      ▼
┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│                            Backend API — Express (port 5000)                                 │
│                                                                                              │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐                  │
│  │  Auth Routes   │  │  Dashboard    │  │  Deployments  │  │  Registry     │                  │
│  │ /api/auth      │  │ /api/dashboard│  │ /api/deploy   │  │ /api/registry │                  │
│  └───────┬───────┘  └───────┬───────┘  └───────┬───────┘  └───────┬───────┘                  │
│          │                  │                  │                  │                           │
│          ▼                  ▼                  ▼                  ▼                           │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐                  │
│  │ Auth Service  │  │Dashboard Svc  │  │Deployment Svc │  │Registry Svc   │                  │
│  │ (JWT + bcrypt)│  │ (mock data)   │  │ (MongoDB CRUD)│  │ (MongoDB CRUD)│                  │
│  └───────────────┘  └───────────────┘  └───────┬───────┘  └───────┬───────┘                  │
│                                                 │                  │                           │
│  ┌───────────────┐  ┌───────────────┐  ┌───────┴───────┐  ┌───────┴───────┐                  │
│  │  Logging Svc  │  │Monitoring Svc │  │Deploy Engine  │  │ Docker Engine │                  │
│  │ (Metric model)│  │ (Metric model)│  │ (placeholder)  │  │ (execSync)    │                  │
│  └───────────────┘  └───────────────┘  └───────────────┘  └───────────────┘                  │
│                                                                                              │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐                  │
│  │ Floci Engine  │  │   K8s Engine  │  │   Middleware   │  │   Swagger     │                  │
│  │ (placeholders)│  │ (@k8s/client) │  │ auth, validate,│  │ OpenAPI Docs  │                  │
│  └───────────────┘  └───────────────┘  │ rateLimit, err │  └───────────────┘                  │
│                                         └───────────────┘                                    │
└──────────────────────┬───────────────────────────────────────────────────────────────────────┘
                       │
        ┌──────────────┼──────────────────────┐
        ▼              ▼                      ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────────────┐
│   MongoDB    │ │   Docker     │ │  Kubernetes Cluster  │
│ (localhost:  │ │   Daemon     │ │  (Docker Desktop)    │
│   27017)     │ │              │ │                      │
│              │ │              │ │  ┌──────────────────┐│
│  ┌────────┐  │ │              │ │  │  Pods / Services ││
│  │ users  │  │ │              │ │  │  / Deployments   ││
│  ├────────┤  │ │              │ │  └──────────────────┘│
│  │deploy- │  │ │              │ │                      │
│  │ments   │  │ │              │ └──────────────────────┘
│  ├────────┤  │ │              │
│  │metrics │  │ └──────────────┘
│  ├────────┤  │
│  │registry│  │
│  │ images │  │
│  └────────┘  │
└──────────────┘

┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│                     Deployment Engine (standalone — port 6000)                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                      │
│  │Manifest Gen  │  │  K8s Client  │  │  Controller  │  │   Service    │                      │
│  │(Deployment + │─▶│ (AppsV1Api + │◀─│  (thin)      │◀─│  (orchestr.) │                      │
│  │ Service)     │  │  CoreV1Api)  │  └──────────────┘  └──────────────┘                      │
│  └──────────────┘  └──────┬───────┘                                                          │
│                           │                                                                  │
│                           ▼                                                                  │
│                    ┌──────────────┐                                                          │
│                    │  K8s Cluster │                                                          │
│                    │  (Docker     │                                                          │
│                    │   Desktop)   │                                                          │
│                    └──────────────┘                                                          │
└──────────────────────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│                          Planned Infrastructure (Not Yet Deployed)                            │
│                                                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                      │
│  │  Prometheus  │  │   Grafana    │  │     Loki     │  │   Promtail   │                      │
│  │  (metrics)   │  │ (dashboards) │  │   (logs)     │  │ (log agent)  │                      │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘                      │
│                                                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                      │
│  │  cAdvisor    │  │Node Exporter │  │  Registry    │  │  Floci Svc   │                      │
│  │ (container)  │  │   (host)     │  │  (Docker)    │  │ (S3/Lambda)  │                      │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘                      │
└──────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 19. Summary Statistics

| Metric | Value |
|--------|-------|
| **Total API Endpoints** | 30 |
| **Backend Source Files** | ~25 |
| **Frontend Source Files** | ~50 (components + pages) |
| **Frontend Components** | ~55 |
| **Deployment Engine Files** | 10 |
| **MongoDB Collections** | 4 |
| **Dockerfiles** | 0 |
| **Docker Compose Services** | 0 |
| **GitHub Actions Workflows** | 0 |
| **Unit Tests** | 0 |
| **Floci Backend (real)** | 0% |
| **Monitoring Backend (real)** | 0% |
| **Logging Backend (real)** | 0% |
| **Frontend API Integration** | 0% |
| **Overall Completion** | ~35-40% |

---

*End of Project Analysis Report*
