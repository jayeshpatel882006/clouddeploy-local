# CloudDeploy Local — Project Structure & Architecture

> **Generated:** July 4, 2026  
> **Purpose:** Complete technical reference for onboarding a senior developer

---

## SECTION 1 — PROJECT TREE

```
clouddeploy-local/
│
├── .gitignore                          # Git exclusion rules
├── docker-compose.yml                  # Empty — placeholder for future Docker Compose setup
├── LICENSE                             # License file
├── README.md                           # Project overview
├── CloudDeploy_Local_Project_Plan.md   # Original project plan document
│
├── backend/                            # Main REST API (Express 5, port 5000)
│   ├── .env                            # Environment variables (gitignored)
│   ├── package.json                    # Dependencies & scripts
│   ├── package-lock.json
│   ├── node_modules/
│   └── src/
│       ├── server.js                   # Entry point — starts HTTP server
│       ├── app.js                      # Express app setup (middleware, routes, error handling)
│       ├── config/
│       │   └── database.js             # MongoDB/Mongoose connection
│       ├── controllers/
│       │   ├── auth.controller.js      # Auth request handlers (register, login, refresh, me)
│       │   ├── dashboard.controller.js # Dashboard overview handler
│       │   ├── deployment.controller.js# Deployment creation handler (currently uses Deployment model)
│       │   ├── floci.controller.js     # Floci service handlers (S3, Lambda, IAM, SNS, SQS)
│       │   ├── logging.controller.js   # Log retrieval handler
│       │   ├── monitoring.controller.js# Metrics & summary handlers
│       │   └── registry.controller.js  # Registry image handlers
│       ├── services/
│       │   ├── auth.service.js         # JWT token generation, password hashing, user CRUD
│       │   ├── dashboard.service.js    # Returns hardcoded dashboard overview data
│       │   ├── deployment.service.js   # GitHub URL validation + Deployment model creation
│       │   ├── logging.service.js      # Query logs from Metric model with Loki filter
│       │   ├── monitoring.service.js   # Query metrics from Metric model with pagination
│       │   └── registry.service.js     # List/sync Docker images with RegistryImage model
│       ├── models/
│       │   ├── Deployment.js           # GitHub-based deployment schema (new — post-cleanup)
│       │   ├── DeploymentHistory.js    # Legacy deployment schema (commented out usage)
│       │   ├── Metric.js              # Monitoring/logging metric schema
│       │   ├── RegistryImage.js        # Local Docker registry image schema
│       │   └── User.js                # User auth schema with roles
│       ├── middleware/
│       │   ├── auth.js                 # JWT verification + role-based authorization
│       │   ├── errorHandler.js         # Centralized error handling (Mongoose, JWT, operational)
│       │   ├── notFound.js             # 404 catch-all for unmatched routes
│       │   ├── rateLimiter.js          # Rate limiting (API, auth, deployment)
│       │   └── validate.js             # Field-level request body validation
│       ├── routes/
│       │   ├── index.js                # Route aggregator — mounts all sub-routers under /api
│       │   ├── auth.routes.js          # POST /register, /login, /refresh, GET /me
│       │   ├── dashboard.routes.js     # GET /
│       │   ├── deployment.routes.js    # POST / — create deployment (currently minimal)
│       │   ├── floci.routes.js         # S3, Lambda, IAM, SNS, SQS endpoints
│       │   ├── logging.routes.js       # GET /
│       │   ├── monitoring.routes.js    # GET /, /summary
│       │   └── registry.routes.js      # GET /, /sync, /:name/tags, DELETE /:id
│       ├── engine/
│       │   ├── deployment.engine.js    # Placeholder — logs deployment data, returns queued status
│       │   ├── docker.engine.js        # Shells out to `docker images` to list local images
│       │   └── floci.engine.js         # 11 placeholder functions for AWS service emulation
│       └── utils/
│           ├── ApiError.js             # Operational error class with static factories
│           ├── ApiResponse.js          # Standardized API response wrapper
│           ├── asyncHandler.js         # Async route error catcher
│           └── logger.js               # Level-based console logger
│
├── deployment-engine/                  # Standalone deployment orchestrator (Express, port 6000)
│   ├── package.json
│   ├── package-lock.json
│   ├── node_modules/
│   └── src/
│       ├── server.js                   # Entry point — starts HTTP server
│       ├── app.js                      # Express app setup (middleware, routes)
│       ├── controllers/
│       │   └── deployment.controller.js # Delegates to deploymentService, returns JSON
│       ├── services/
│       │   └── deployment.service.js   # Generates K8s manifests, calls K8s API
│       ├── routes/
│       │   └── deployment.routes.js    # POST /deploy (single endpoint)
│       ├── kubernetes/
│       │   ├── client.js               # K8s API client (AppsV1Api + CoreV1Api)
│       │   ├── deployment.js           # Wraps appsApi.createNamespacedDeployment()
│       │   └── service.js              # Wraps coreApi.createNamespacedService()
│       ├── manifests/
│       │   ├── deployment.manifest.js  # Generates K8s Deployment YAML object
│       │   └── service.manifest.js     # Generates K8s Service YAML object
│       ├── pipeline/
│       │   ├── PipelineRunner.js       # Sequential step executor
│       │   ├── PipelineContext.js       # Shared state object for pipeline execution
│       │   └── core/
│       │       └── BaseStep.js         # Abstract base class for pipeline steps
│       ├── docker/                     # Empty directory (future use)
│       ├── config/                     # Empty directory (future use)
│       ├── middlewares/                # Empty directory (future use)
│       ├── registry/                   # Empty directory (future use)
│       └── utils/                      # Empty directory (future use)
│
├── dashboard/                          # React frontend (Vite + Tailwind, port 5173)
│   ├── index.html                      # HTML entry point
│   ├── package.json                    # Dependencies & scripts
│   ├── vite.config.js                  # Vite config (React, Tailwind, @ alias)
│   ├── eslint.config.js                # ESLint config
│   ├── jsconfig.json                   # JS config (path alias support)
│   ├── README.md                       # Dashboard README
│   ├── node_modules/
│   └── src/
│       ├── main.jsx                    # React DOM render entry
│       ├── App.jsx                     # Root component — renders AppRoutes
│       ├── styles/
│       │   └── globals.css             # Tailwind import + CSS custom properties
│       ├── routes/
│       │   └── AppRoutes.jsx           # React Router — 8 routes with DashboardLayout
│       ├── layouts/
│       │   └── DashboardLayout.jsx     # Sidebar + Navbar + content area layout
│       ├── config/
│       │   └── navigation.js           # Sidebar nav items (7 sections)
│       ├── pages/
│       │   ├── Dashboard.jsx           # Overview page with stats, health, activity
│       │   ├── Deployments.jsx         # Deployment list with create/delete/scale
│       │   ├── Clusters.jsx            # Cluster overview with K8s table
│       │   ├── Monitoring.jsx          # Metrics dashboards (CPU, memory, disk, network)
│       │   ├── Logs.jsx                # Log viewer with filtering
│       │   ├── Registry.jsx            # Docker registry image browser
│       │   ├── Settings.jsx            # Multi-tab settings page
│       │   └── NotFound.jsx            # 404 page
│       ├── components/
│       │   ├── ui/                     # 22 reusable UI primitives
│       │   ├── dashboard/              # 7 dashboard-specific components
│       │   ├── deployments/            # 13 deployment-related components
│       │   ├── clusters/               # 4 cluster-related components
│       │   ├── monitoring/             # 10 monitoring visualization components
│       │   ├── logs/                   # 4 log viewer components
│       │   ├── registry/               # 6 registry browser components
│       │   ├── settings/               # 12 settings panel components
│       │   ├── common/                 # 1 shared Modal component
│       │   └── (empty directories: assets/, constants/, context/, hooks/, services/, utils/)
│       └── (empty directories)
│
├── docs/                               # Generated documentation
│   ├── PROJECT_ANALYSIS.md
│   ├── SECTION1_BACKEND_HANDOVER.md
│   ├── COMPLETE_TECHNICAL_HANDOVER.md
│   └── PROJECT_STRUCTURE.md            # ← This file
│
└── sample-app/                         # Empty directory (future use)
```

---

## SECTION 2 — BACKEND

### 2.1 Folder Overview

| Folder | Purpose | Status |
|--------|---------|--------|
| `config/` | Database connection configuration | Complete |
| `controllers/` | HTTP request handlers — receive req/res, delegate to services | Complete |
| `engine/` | Infrastructure integration layer (Docker shell commands, Floci placeholders) | Partial / Placeholder |
| `middleware/` | Express middleware (auth, validation, rate limiting, error handling) | Complete |
| `models/` | Mongoose schemas for MongoDB collections | Complete |
| `routes/` | Express Router definitions — map HTTP verbs + paths to controllers | Complete |
| `services/` | Business logic layer — between controllers and models/engines | Complete |
| `utils/` | Shared utilities (error classes, response wrappers, logger) | Complete |

### 2.2 File-by-File Breakdown

---

#### `backend/src/server.js` — Entry Point

**Purpose:** Bootstrap the application — validate environment, connect to MongoDB, start HTTP server, register process signal handlers for graceful shutdown.

**Who calls it:** `npm run dev` → `nodemon` → `node src/server.js`

**Who it calls:**
- `dotenv.config()` — loads `.env` file
- `connectDB()` from `./config/database.js`
- `app.listen()` from `./app.js`

**Key responsibilities:**
- Validates `MONGODB_URI` and `JWT_SECRET` env vars
- Warns in dev, exits in production if missing
- Graceful shutdown on `SIGTERM` / `SIGINT` (10-second force timeout)
- Global handlers for `uncaughtException` and `unhandledRejection`

**Design decisions:**
- Uses `dotenv` for env management (simple, no external secret manager)
- Graceful shutdown is a must for containerized environments (K8s sends SIGTERM)

**Currently used:** Yes  
**Essential:** Yes  
**Placeholder:** No

---

#### `backend/src/app.js` — Express App Setup

**Purpose:** Create and configure the Express application — mount middleware, health/ready endpoints, API routes, and error handlers.

**Who calls it:** `server.js` imports it

**Who it calls:**
- All middleware (`helmet`, `compression`, `cors`, `express.json`, `morgan`, `apiLimiter`)
- `routes` from `./routes/index.js`
- `errorHandler`, `notFound` middleware
- `ApiResponse`

**Middleware stack (in order):**
1. `helmet()` — security headers (XSS, CSP, HSTS, etc.)
2. `compression()` — gzip response compression
3. `cors()` — cross-origin resource sharing (open)
4. `express.json({ limit: "10mb" })` — JSON body parser with size limit
5. `morgan("combined")` — HTTP request logging
6. `/api` → `apiLimiter` — 100 requests per 15 min window
7. `/health` — returns `{ success: true, message: "CloudDeploy API is running" }`
8. `/ready` — checks MongoDB connection state, returns 200 or 503
9. `/api` → routes (all API routes)
10. `notFound` — 404 for unmatched routes
11. `errorHandler` — centralized error handling

**Key design decisions:**
- Express 5 (async error handling built-in)
- `compression` before routes to compress all responses
- `apiLimiter` only applies to `/api/*`, not health/ready endpoints
- Swagger was removed in cleanup

**Currently used:** Yes  
**Essential:** Yes  
**Placeholder:** No

---

#### `backend/src/config/database.js` — MongoDB Connection

**Purpose:** Connect to MongoDB via Mongoose.

**Who calls it:** `server.js`

**What it does:**
- Reads `process.env.MONGODB_URI`
- Calls `mongoose.connect()`
- Logs success or exits with code 1 on failure

**Currently used:** Yes  
**Essential:** Yes  
**Placeholder:** No

---

### 2.3 Routes

#### `backend/src/routes/index.js` — Route Aggregator

**Purpose:** Single entry point that mounts all sub-routers under `/api`.

**Who calls it:** `app.js` — `app.use("/api", routes)`

**Route registration:**
| Prefix | Source File | Auth Required |
|--------|-------------|---------------|
| `/api/auth` | `auth.routes.js` | Mixed |
| `/api/dashboard` | `dashboard.routes.js` | No |
| `/api/deployments` | `deployment.routes.js` | No |
| `/api/floci` | `floci.routes.js` | Yes (via router-level) |
| `/api/logs` | `logging.routes.js` | Yes |
| `/api/monitoring` | `monitoring.routes.js` | Yes |
| `/api/registry` | `registry.routes.js` | Yes |

**Currently used:** Yes  
**Essential:** Yes  
**Placeholder:** No

---

#### `backend/src/routes/auth.routes.js` — Authentication Routes

**Endpoints:**
| Method | Path | Middleware | Controller |
|--------|------|-----------|------------|
| POST | `/api/auth/register` | `authLimiter` | `register` |
| POST | `/api/auth/login` | `authLimiter` | `login` |
| POST | `/api/auth/refresh` | `authLimiter`, `authenticate` | `refresh` |
| GET | `/api/auth/me` | `authenticate` | `me` |

**Currently used:** Yes  
**Essential:** Yes  
**Placeholder:** No

---

#### `backend/src/routes/dashboard.routes.js` — Dashboard Routes

**Endpoints:**
| Method | Path | Middleware | Controller |
|--------|------|-----------|------------|
| GET | `/api/dashboard` | None | `getDashboard` |

**Currently used:** Yes  
**Essential:** Yes  
**Placeholder:** No (returns hardcoded data)

---

#### `backend/src/routes/deployment.routes.js` — Deployment Routes

**Endpoints:**
| Method | Path | Middleware | Controller |
|--------|------|-----------|------------|
| POST | `/api/deployments` | None | `createDeployment` |

**Note:** All other CRUD endpoints were commented out during cleanup. Only POST `/` remains active.

**Currently used:** Yes  
**Essential:** Yes  
**Placeholder:** No (minimal implementation)

---

#### `backend/src/routes/floci.routes.js` — Floci Routes

**Endpoints:**
| Method | Path | Auth | Controller |
|--------|------|------|------------|
| GET | `/api/floci/s3/buckets` | authenticate | `getBuckets` |
| POST | `/api/floci/s3/buckets` | authenticate + admin | `addBucket` |
| GET | `/api/floci/s3/buckets/:bucketName/objects` | authenticate | `getObjects` |
| GET | `/api/floci/lambda/functions` | authenticate | `getFunctions` |
| POST | `/api/floci/lambda/functions/:functionName/invoke` | authenticate | `runFunction` |
| GET | `/api/floci/iam/users` | authenticate | `getUsers` |
| POST | `/api/floci/iam/users` | authenticate + admin | `addUser` |
| GET | `/api/floci/sns/topics` | authenticate | `getTopics` |
| POST | `/api/floci/sns/publish` | authenticate | `publishMessage` |
| GET | `/api/floci/sqs/queues` | authenticate | `getQueues` |
| POST | `/api/floci/sqs/send` | authenticate | `postMessage` |

**Currently used:** Yes (routes exist, but all engine functions return empty data)  
**Essential:** Partially (architecture is there, real implementation is future)  
**Placeholder:** Yes (all engine functions are placeholders)

---

#### `backend/src/routes/logging.routes.js` — Logging Routes

**Endpoints:**
| Method | Path | Middleware | Controller |
|--------|------|-----------|------------|
| GET | `/api/logs` | `authenticate` | `getLogs` |

**Currently used:** Yes  
**Essential:** Yes  
**Placeholder:** No (queries Metric model for Loki data)

---

#### `backend/src/routes/monitoring.routes.js` — Monitoring Routes

**Endpoints:**
| Method | Path | Middleware | Controller |
|--------|------|-----------|------------|
| GET | `/api/monitoring` | `authenticate` | `getMetricsHandler` |
| GET | `/api/monitoring/summary` | `authenticate` | `getSummary` |

**Currently used:** Yes  
**Essential:** Yes  
**Placeholder:** No (queries Metric model)

---

#### `backend/src/routes/registry.routes.js` — Registry Routes

**Endpoints:**
| Method | Path | Middleware | Controller |
|--------|------|-----------|------------|
| GET | `/api/registry` | `authenticate` | `listImages` |
| GET | `/api/registry/sync` | `authenticate` | `syncImages` |
| GET | `/api/registry/:name/tags` | `authenticate` | `getTags` |
| DELETE | `/api/registry/:id` | `authenticate` | `deleteImage` |

**Currently used:** Yes  
**Essential:** Yes  
**Placeholder:** No (sync calls real Docker CLI)

---

### 2.4 Controllers

| File | Exports | Calls | Purpose |
|------|---------|-------|---------|
| `auth.controller.js` | `register`, `login`, `refresh`, `me` | `auth.service.js` | Auth request handlers |
| `dashboard.controller.js` | `getDashboard` | `dashboard.service.js` | Dashboard overview |
| `deployment.controller.js` | `createDeployment` | `deployment.service.js` | Create deployment (new GitHub-based flow) |
| `floci.controller.js` | 11 exports | `floci.engine.js` | All Floci service handlers |
| `logging.controller.js` | `getLogs` | `logging.service.js` | Log retrieval |
| `monitoring.controller.js` | `getMetricsHandler`, `getSummary` | `monitoring.service.js` | Metrics queries |
| `registry.controller.js` | `listImages`, `getTags`, `deleteImage`, `syncImages` | `registry.service.js` | Registry CRUD |

**Common pattern:** Every controller function:
1. Is wrapped with `asyncHandler` to catch async errors (except `deployment.controller.js` which uses try/catch)
2. Calls the corresponding service function
3. Wraps the result in `new ApiResponse(statusCode, data, message).send(res)`

---

### 2.5 Services

| File | Exports | Calls | Purpose |
|------|---------|-------|---------|
| `auth.service.js` | `registerUser`, `loginUser`, `refreshToken`, `getCurrentUser` | `User` model, `bcrypt`, `jsonwebtoken` | User registration, login, token management |
| `dashboard.service.js` | `getDashboardOverview` | None | Returns hardcoded dashboard data |
| `deployment.service.js` | `registerRepository` | `Deployment` model | Validates GitHub URL, creates Deployment record |
| `logging.service.js` | `listLogs` | `Metric` model | Queries logs with pagination and filters |
| `monitoring.service.js` | `getMetrics`, `getMetricSummary` | `Metric` model | Queries metrics with pagination, distinct source summary |
| `registry.service.js` | `listRegistryImages`, `getImageTags`, `deleteRegistryImage`, `syncRegistryFromDocker` | `RegistryImage` model, `docker.engine.js` | Registry CRUD + sync from Docker CLI |

**Key observations:**

- `auth.service.js` is the most complete service — full JWT auth with bcrypt, token generation, and user CRUD
- `dashboard.service.js` returns **hardcoded mock data** — no real database queries
- `deployment.service.js` was rewritten during cleanup — now validates GitHub URLs and creates `Deployment` records instead of the old Docker-based flow
- `logging.service.js` and `monitoring.service.js` both query the `Metric` model — they share the same underlying collection but use different filter defaults (`source: "loki"` for logs)
- `registry.service.js` is the only service that calls an engine (`docker.engine.js`) for real Docker integration

---

### 2.6 Middleware

| File | Exports | Purpose |
|------|---------|---------|
| `auth.js` | `authenticate`, `authorize` | JWT verification + role-based access control |
| `errorHandler.js` | `errorHandler` | Centralized error handling (6 error type branches) |
| `notFound.js` | `notFound` | Catch-all 404 handler |
| `rateLimiter.js` | `apiLimiter`, `authLimiter`, `deploymentLimiter` | Rate limiting (100/10/50 requests per window) |
| `validate.js` | `validate` | Field-level request body validation middleware |

#### `auth.js` — Authentication Middleware

**Flow:**
1. Extract `Authorization: Bearer <token>` header
2. Verify JWT with `jsonwebtoken.verify()` using `JWT_SECRET`
3. Look up user in MongoDB by `decoded.id`
4. Check `user.isActive` flag
5. Attach `req.user = user` for downstream handlers

**`authorize(...roles)`:** Returns middleware that checks `req.user.role` is in the allowed roles list. Returns 403 if not.

**Edge cases handled:**
- Missing token → 401
- Invalid/expired token → 401
- User not found or inactive → 401

**Currently used:** Yes — on auth, floci (all), registry (all), monitoring (all), logging (all) routes

#### `errorHandler.js` — Error Handler

**Handles 6 error types in order:**
1. Mongoose `ValidationError` → 400 with field messages
2. Mongoose duplicate key (code 11000) → 409
3. Mongoose `CastError` (bad ObjectId) → 400
4. `ApiError` instance → uses `err.statusCode`
5. Unknown error → 500 (hides details in production)
6. Logs every error via `logger.error()`

**Currently used:** Yes — registered as the last middleware in `app.js`

#### `validate.js` — Field Validator

**Purpose:** Express middleware factory that validates `req.body` fields against a rules object.

**Supported rules:** `required`, `type` (string/number), `minLength`, `maxLength`, `min`, `max`, `enum`, `message`

**Note:** This middleware is currently **imported in deployment.routes.js but all validation rules are commented out**. The validate function itself is unused in any active route.

**Currently used:** No (import exists but all callers are commented out)

---

### 2.7 Models

| Model | Collection | Fields | Used By |
|-------|-----------|--------|---------|
| `User` | `users` | email, password, name, role, isActive, timestamps | `auth.service.js`, `auth.js` middleware |
| `Deployment` | `deployments` | repositoryUrl, branch, status (enum: REGISTERED/CLONED/BUILDING/DEPLOYING/RUNNING/FAILED), timestamps | `deployment.service.js` |
| `DeploymentHistory` | `deploymenthistory` | applicationName, namespace, dockerImage, imageTag, replicas, containerPort, status, deployedBy, commitSha, deploymentMessage, timestamps | **Commented out** — no active code uses this |
| `Metric` | `metrics` | source, metricName, value (Mixed), labels (Map), timestamp, timestamps | `monitoring.service.js`, `logging.service.js` |
| `RegistryImage` | `registryimages` | name, tag, digest, size, registry, pulledAt, timestamps | `registry.service.js` |

**Indexes:**
- `Metric`: `{ source: 1, metricName: 1, timestamp: -1 }`
- `RegistryImage`: `{ name: 1, tag: 1 }` (unique compound)

**Relationships:**
- No formal relationships (no `ref` / `populate` usage anywhere)
- `User` is standalone
- `Deployment` and `DeploymentHistory` are independent (both track deployment data but with different schemas)
- `Metric` and `RegistryImage` are standalone data collections

---

### 2.8 Engine

| File | Exports | Status | Real Implementation? |
|------|---------|--------|---------------------|
| `deployment.engine.js` | `deployApplication` | Placeholder | No — logs payload, returns queued status |
| `docker.engine.js` | `listImages` | Complete | Yes — shells out to `docker images` CLI |
| `floci.engine.js` | 11 functions | Placeholder | No — all return empty mock data |

**Key observations:**
- `deployment.engine.js` is **not currently called** by any active code — the new `deployment.service.js` skips the engine entirely and goes straight to the `Deployment` model
- `docker.engine.js` has a `runCmd` helper that wraps `execSync` — only the `listImages` function is exposed and used by `registry.service.js`
- `floci.engine.js` defines 11 async functions — all return `{ success: true, ... }` with empty arrays or null results. The comment says "Placeholder" for every function

---

### 2.9 Utils

| File | Purpose | Key Features |
|------|---------|-------------|
| `ApiError.js` | Operational error class | 6 static factories (`badRequest`, `unauthorized`, `forbidden`, `notFound`, `conflict`, `internal`); `isOperational` flag; optional `details` field |
| `ApiResponse.js` | Standard response serializer | `send(res)` method; 3 static factories (`success`, `created`, `noContent`); serializes `{ success, message, data }` |
| `asyncHandler.js` | Async error wrapper | Wraps async route handlers to forward rejected promises to `next(err)` |
| `logger.js` | Level-based logger | 4 levels (debug/info/warn/error); ISO timestamps; optional metadata object serialization |

**Design decision — ApiError vs plain Error:**
- `ApiError` is used for known, operational errors (invalid input, missing resource, bad credentials)
- Plain `Error` instances (or unhandled rejects) are treated as unexpected bugs → 500 in production
- The `errorHandler` checks `err instanceof ApiError` to determine if it should expose the message

---

## SECTION 3 — DEPLOYMENT ENGINE

### 3.1 Folder Overview

| Folder | Purpose | Status |
|--------|---------|--------|
| `controllers/` | HTTP request handler | Complete |
| `services/` | Business logic for deployments | Complete |
| `routes/` | Express route definitions | Complete |
| `kubernetes/` | K8s API client and wrappers | Complete |
| `manifests/` | K8s manifest generators | Complete |
| `pipeline/` | Pipeline orchestration architecture | Minimal (core only) |
| `docker/` | Empty — future Docker integration | Empty |
| `config/` | Empty — future configuration | Empty |
| `middlewares/` | Empty — future middleware | Empty |
| `registry/` | Empty — future registry integration | Empty |
| `utils/` | Empty — future utilities | Empty |

### 3.2 File-by-File Breakdown

---

#### `deployment-engine/src/server.js` — Entry Point

**Purpose:** Bootstrap the deployment engine — load `.env`, start HTTP server on port 6000.

**Who calls it:** `npm run dev` → `nodemon` → `node src/server.js`

**Key notes:**
- No database connection (standalone service)
- No graceful shutdown handling
- No environment validation
- Simple console.log banner for startup

**Currently used:** Yes  
**Essential:** Yes  
**Placeholder:** No

---

#### `deployment-engine/src/app.js` — Express App

**Purpose:** Create Express app with CORS, Helmet, JSON parser, Morgan logging, and mount routes.

**Middleware stack:**
1. `cors()` — open CORS
2. `helmet()` — security headers
3. `express.json()` — JSON body parser
4. `morgan("dev")` — request logging (dev format)
5. `/health` — returns `{ success: true, service: "Deployment Engine", status: "Healthy" }`
6. `/deploy` → `deploymentRoutes`

**Note:** No rate limiting, no error handler middleware, no 404 handler.

**Currently used:** Yes  
**Essential:** Yes  
**Placeholder:** No

---

#### `deployment-engine/src/routes/deployment.routes.js`

| Method | Path | Controller |
|--------|------|-----------|
| POST | `/deploy` | `deployApplication` |

Minimal — single endpoint, no middleware, no validation.

---

#### `deployment-engine/src/controllers/deployment.controller.js`

**Purpose:** Receive deployment request, delegate to `deploymentService`, return JSON response.

**Flow:**
1. `req.body` → `deploymentService(req.body)`
2. On success → `200 { success, deploymentId, status, ...manifests }`
3. On error → `500 { success: false, message: error.message }`

**Currently used:** Yes  
**Essential:** Yes  
**Placeholder:** No

---

#### `deployment-engine/src/services/deployment.service.js`

**Purpose:** Core deployment orchestration — generates K8s manifests, creates deployment and service in K8s.

**Flow:**
1. `generateDeploymentManifest(deployment)` — creates K8s Deployment spec
2. `generateServiceManifest(deployment)` — creates K8s Service spec
3. `createDeployment(deploymentManifest)` — calls K8s API
4. `createService(serviceManifest)` — calls K8s API
5. Returns `{ success, deploymentId, status, deploymentManifest, serviceManifest }`

**Note:** Console.log statements for manifest generation are commented out. The actual K8s API calls (`createDeployment`, `createService`) are uncommented and active.

**Currently used:** Yes  
**Essential:** Yes  
**Placeholder:** No

---

#### `deployment-engine/src/kubernetes/client.js`

**Purpose:** Initialize and export K8s API clients.

**Flow:**
1. `new k8s.KubeConfig()` — creates config object
2. `kubeConfig.loadFromDefault()` — loads `~/.kube/config` (Docker Desktop K8s)
3. `kubeConfig.makeApiClient(k8s.AppsV1Api)` → `appsApi` (for Deployments)
4. `kubeConfig.makeApiClient(k8s.CoreV1Api)` → `coreApi` (for Services)

**Currently used:** Yes (by `kubernetes/deployment.js` and `kubernetes/service.js`)  
**Essential:** Yes  
**Placeholder:** No

---

#### `deployment-engine/src/kubernetes/deployment.js`

**Purpose:** Thin wrapper around `appsApi.createNamespacedDeployment()`.

**Exports:** `createDeployment(manifest)` — calls K8s API with the manifest object.

---

#### `deployment-engine/src/kubernetes/service.js`

**Purpose:** Thin wrapper around `coreApi.createNamespacedService()`.

**Exports:** `createService(manifest)` — calls K8s API with the manifest object.

---

#### `deployment-engine/src/manifests/deployment.manifest.js`

**Purpose:** Generate a K8s Deployment manifest object from deployment request data.

**Input:** `{ applicationName, namespace, replicas, dockerImage, containerPort }`

**Output:** A plain object conforming to K8s `apps/v1` Deployment schema.

**Default values:** `namespace: "default"`

---

#### `deployment-engine/src/manifests/service.manifest.js`

**Purpose:** Generate a K8s Service manifest object.

**Input:** `{ applicationName, namespace, containerPort }`

**Output:** A plain object conforming to K8s `v1` Service schema (ClusterIP, port 80 → containerPort).

**Key decisions:**
- Always creates `ClusterIP` type (not LoadBalancer or NodePort)
- Exposes port 80 and maps to the container's `containerPort`

---

### 3.3 Pipeline Architecture

The pipeline is a minimal orchestration skeleton — it provides the infrastructure to chain deployment steps but has no concrete step implementations yet.

#### `PipelineRunner.js`

**Class:** `PipelineRunner`

**Purpose:** Execute an ordered sequence of `BaseStep` instances sequentially.

**API:**
- `addStep(step)` — register a step (validates it extends `BaseStep`)
- `run(context)` — execute all steps in order

**Execution flow:**
1. Validates context is a `PipelineContext` instance
2. Calculates step weight (100 ÷ step count)
3. Marks context as started
4. Iterates steps in registration order:
   - Updates `context.currentStep`
   - Calls `step.execute(context)`
   - Records success with duration in `context.recordStep()`
   - Updates progress percentage
   - On error: records failure, adds error, marks context as failed, breaks
5. If no failure → marks context as completed
6. Returns the final context

**Edge cases handled:**
- Empty step list → throws error
- Mid-pipeline failure → skips remaining steps
- Step not extending BaseStep → throws on registration

**Currently used:** No (no concrete steps exist to register)  
**Essential:** For future pipeline implementation  
**Placeholder:** Architecture only

#### `PipelineContext.js`

**Class:** `PipelineContext`

**Purpose:** Shared state object passed through every pipeline step.

**Constructor fields:**
- **Identity:** `deploymentId`
- **App config:** `applicationName`, `dockerImage`, `namespace`, `replicas`, `containerPort`, `imageTag`, `deployedBy`, `commitSha`, `deploymentMessage`
- **Pipeline state:** `currentStep`, `status`, `progress`, `startedAt`, `completedAt`
- **Results:** `steps[]` (name, status, duration, error), `deploymentManifest`, `serviceManifest`, `imageName`
- **Logging:** `logs[]`, `errors[]`
- **Extensible:** `metadata` (empty object)

**Helper methods:**
- `recordStep(name, status, duration, error)` — push step result
- `log(message)` — timestamped log entry
- `addError(step, message)` — record error + log
- `setProgress(pct)` — clamp 0–100
- `markStarted()` / `markCompleted()` / `markFailed(reason)` — state transitions
- `toJSON()` — plain object snapshot for serialization

**Currently used:** No (no pipeline runs yet)  
**Essential:** For future pipeline  
**Placeholder:** Architecture only

#### `BaseStep.js` (`pipeline/core/BaseStep.js`)

**Class:** `BaseStep` — abstract base class

**Purpose:** Define the contract for all pipeline steps.

**Features:**
- Constructor guard (prevents direct instantiation of `BaseStep`)
- `stepName` field — human-readable identifier
- Abstract `execute(context)` method — throws if not overridden
- Logging helpers: `logInfo()`, `logWarn()`, `logError()`
- Validation helper: `validateRequired(context, requiredFields[])`

**Contract:**
```javascript
class MyStep extends BaseStep {
  constructor() {
    super("MyStep");
  }
  async execute(context) {
    // Step logic here
    return context;
  }
}
```

**Currently used:** No (no concrete steps exist)  
**Essential:** For future pipeline  
**Placeholder:** Architecture only

---

## SECTION 4 — FRONTEND

### 4.1 Tech Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 19.2.7 | UI framework |
| React Router DOM | 7.18.1 | Client-side routing |
| Vite | 8.1.1 | Build tool & dev server |
| Tailwind CSS | 4.3.2 | Utility-first CSS |
| Framer Motion | 12.42.2 | Animation library |
| Lucide React | 1.23.0 | Icon set |
| Axios | 1.18.1 | HTTP client (installed but **not imported anywhere**) |
| React Hot Toast | 2.6.0 | Toast notifications (installed but **not imported anywhere**) |

### 4.2 Pages

| Page | Route | Components Used | Description |
|------|-------|----------------|-------------|
| `Dashboard` | `/` | `DashboardHeader`, `StatsCards`, `ClusterHealth`, `QuickActions`, `ResourceUsage`, `RecentDeployments`, `RecentActivity` | Main overview with stats, health, quick actions, resource usage, recent deployments, and activity feed |
| `Deployments` | `/deployments` | `DeploymentHeader`, `Search`, `Filters`, `DeploymentTable` (+ row, status badge), `CreateDeploymentModal`, `DeleteDeploymentDialog`, `ScaleDeploymentDialog`, `DeploymentDrawer`, `DeploymentDetails`, `Pagination` | Full deployment management UI with CRUD modals, filtering, search, pagination, details drawer |
| `Clusters` | `/clusters` | `ClusterHeader`, `ClusterOverview`, `K8sTable` | Cluster health overview with K8s resource tables |
| `Monitoring` | `/monitoring` | `MonitoringHeader`, `CpuUsage`, `MemoryUsage`, `DiskUsage`, `NetworkUsage`, `NodeUsage`, `PodHealth`, `ContainerUsage`, `AlertsPanel`, `TimeSeriesChart` | Monitoring dashboards for CPU, memory, disk, network, node/pod/container health, and alerts |
| `Logs` | `/logs` | `LogsHeader`, `LogToolbar`, `LogViewer`, `LogEntry` | Log browser with toolbar filters and scrollable viewer |
| `Registry` | `/registry` | `RegistryHeader`, `Search` (reused), `RegistryTable`, `RegistryRow`, `RegistryStatusBadge`, `DeleteImageDialog`, `ImageDetailsDrawer` | Docker image registry browser with status badges, delete dialog, details drawer |
| `Settings` | `/settings` | `SettingsSidebar`, 8 settings panels (General, Docker, Kubernetes, Registry, Floci, Theme, Profile, Notifications, About) | Multi-tab settings page |
| `NotFound` | `*` | None | Simple 404 page |

### 4.3 UI Component Library (`components/ui/`)

22 reusable primitives — the foundation for all page-level components:

| Component | Purpose |
|-----------|---------|
| `Avatar.jsx` | User avatar display |
| `Badge.jsx` | Status/label badge |
| `Button.jsx` | Button with variants |
| `Card.jsx` | Content card container |
| `Checkbox.jsx` | Checkbox input |
| `ConfirmDialog.jsx` | Confirmation modal |
| `DataTable.jsx` | Data table with columns |
| `Drawer.jsx` | Slide-in panel |
| `DropdownMenu.jsx` | Dropdown menu |
| `EmptyState.jsx` | Empty state placeholder |
| `Input.jsx` | Text input |
| `LoadingSpinner.jsx` | Loading indicator |
| `Navbar.jsx` | Top navigation bar |
| `Pagination.jsx` | Page navigation |
| `Radio.jsx` | Radio input |
| `Select.jsx` | Dropdown select |
| `Sidebar.jsx` | Side navigation |
| `Skeleton.jsx` | Loading skeleton |
| `StatusBadge.jsx` | Status indicator badge |
| `Switch.jsx` | Toggle switch |
| `Table.jsx` | Base table component |
| `Textarea.jsx` | Multi-line text input |
| `Tooltip.jsx` | Hover tooltip |

### 4.4 State Management

**Current state:** There is **no state management library**. All state is local (`useState` in each page component). No React Context, no Redux, no Zustand.

**State sources:**
- All data comes from **hardcoded mock data files** (`deploymentData.js`, `registryData.js`, `logsData.js`, `monitoringData.js`, `clusterData.js`, `settingsData.js`)
- No API calls are made despite `axios` being installed

**Empty directories** that suggest future state management: `constants/`, `context/`, `hooks/`, `services/`, `utils/` — all completely empty.

### 4.5 API Integration

**Current status:** **None.** Despite `axios` being a dependency, no file in the project imports `axios`. Every page uses local mock data from `*-data.js` files.

### 4.6 Routing

```
BrowserRouter
  └── DashboardLayout
        ├── /              → Dashboard
        ├── /deployments   → Deployments
        ├── /clusters      → Clusters
        ├── /monitoring    → Monitoring
        ├── /logs          → Logs
        ├── /registry      → Registry
        ├── /settings      → Settings
        └── *              → NotFound
```

No authentication guards, no lazy loading.

### 4.7 Layout

`DashboardLayout.jsx` renders:
```
<div class="flex h-screen bg-slate-900 text-white">
  <Sidebar />                    ← Navigation sidebar
  <div class="flex flex-1 flex-col">
    <Navbar />                   ← Top bar
    <main class="flex-1 overflow-y-auto p-6">
      {children}                 ← Page content
    </main>
  </div>
</div>
```

---

## SECTION 5 — REQUEST FLOW

### 5.1 Backend Request Lifecycle

```
HTTP Request
    │
    ▼
Express (app.js)
    │
    ├── helmet()          → Security headers
    ├── compression()     → Gzip response
    ├── cors()            → CORS headers
    ├── express.json()    → Parse body (10mb limit)
    ├── morgan()          → Log request
    ├── apiLimiter        → Rate limit (only /api/*)
    │
    ▼
Route Matching (index.js → specific route file)
    │
    ▼
Middleware (per-route)
    │
    ├── authenticate (if required)
    │     ├── Extract Bearer token
    │     ├── Verify JWT
    │     ├── Lookup user in MongoDB
    │     └── Attach req.user
    │
    ├── authorize("admin") (if required)
    │     └── Check req.user.role
    │
    ├── authLimiter (if auth endpoint)
    │     └── 10 req / 15 min
    │
    └── validate(rules) (if deployment endpoint — currently commented out)
          └── Validate req.body fields
    │
    ▼
Controller
    │
    ├── Parse req.params / req.query / req.body
    ├── Call service function
    └── Wrap result in ApiResponse.send(res)
    │
    ▼
Service
    │
    ├── Business logic
    ├── Call Model (Mongoose)
    │     └── MongoDB query / mutation
    ├── Call Engine (if needed)
    │     └── Docker shell command / Floci placeholder
    └── Return result to controller
    │
    ▼
ApiResponse.send(res)
    │
    └── JSON: { success, message, data }
    │
    ▼
HTTP Response
```

**If an error occurs at any point:**
```
Error thrown (in asyncHandler, or via next(err))
    │
    ▼
errorHandler middleware
    │
    ├── Log error
    ├── Determine error type:
    │     ├── Mongoose ValidationError  → 400
    │     ├── Mongoose duplicate key    → 409
    │     ├── Mongoose CastError        → 400
    │     ├── ApiError                  → err.statusCode
    │     └── Unknown error             → 500
    └── JSON: { success: false, message, errors?, details?, stack? }
```

### 5.2 Deployment Request Flow (Current)

```
Frontend (currently none — no API integration)
    │
    ▼ (direct HTTP call)
POST /api/deployments  { repositoryUrl, branch }
    │
    ▼
No middleware (no auth, no rate limit)
    │
    ▼
deployment.controller.js → createDeployment
    │
    ▼
deployment.service.js → registerRepository()
    │
    ├── Validate GitHub URL format (regex)
    ├── Create Deployment model record
    └── Return deployment object
    │
    ▼
Response: { success: true, data: { repositoryUrl, branch, status: "REGISTERED", ... } }
```

### 5.3 Deployment Engine Request Flow (Direct)

```
POST http://localhost:6000/deploy  { applicationName, dockerImage, ... }
    │
    ▼
deployment.controller.js → deployApplication
    │
    ▼
deployment.service.js
    │
    ├── generateDeploymentManifest(deployment)
    ├── generateServiceManifest(deployment)
    ├── createDeployment(manifest)   → K8s API
    ├── createService(manifest)      → K8s API
    └── Return { success, deploymentId, status, manifests }
    │
    ▼
Response: JSON
```

### 5.4 Registry Sync Flow

```
GET /api/registry/sync  (authenticated)
    │
    ▼
authenticate middleware
    │
    ▼
registry.controller.js → syncImages
    │
    ▼
registry.service.js → syncRegistryFromDocker()
    │
    ├── docker.engine.js → listImages()
    │     └── execSync("docker images --format ...")
    │
    ├── For each image:
    │     └── RegistryImage.findOneAndUpdate(upsert: true)
    │
    └── Return { synced: count }
```

---

## SECTION 6 — MODULE STATUS

| Module | Status | Actually Used? | Needed? | Notes |
|--------|--------|----------------|---------|-------|
| **Auth** | Complete | Yes | Yes | Full JWT with register/login/refresh/me, rate-limited, role support |
| **Dashboard** | Complete (mock) | Yes | Yes | Returns hardcoded data, no DB queries |
| **Deployment (Backend)** | Minimal | Yes | Yes | Only POST / — registters GitHub repos, no actual deployment |
| **Deployment Engine** | Functional | Yes | Yes | Generates K8s manifests, calls K8s API directly |
| **Pipeline** | Skeleton | No | Future | Architecture only — no concrete steps |
| **Registry** | Partial | Yes | Yes | CRUD works, sync calls real Docker CLI |
| **Monitoring** | Partial | Yes | Partially | API works, queries Metric model — but no Prometheus/Grafana deployed |
| **Logging** | Partial | Yes | Partially | API works, queries Metric model — but no Loki/Promtail deployed |
| **Floci (S3/Lambda/IAM/SNS/SQS)** | Placeholder | Yes (routes exist) | Future | All 11 engine functions return empty data |
| **Docker Engine** | Minimal | Partially (listImages only) | Yes | Only `listImages` is used; build/tag/push etc. were removed |
| **Frontend UI** | Complete (mock) | Yes (renders) | Yes | All pages render beautifully — but 100% mock data, no API calls |
| **Docker Compose** | Empty | No | Future | Empty file |
| **Swagger/OpenAPI** | Removed | No | Optional | Cleaned up — was generating 2000+ lines of annotations |
| **Testing** | None | No | Future | Zero tests across the entire project |
| **CI/CD** | None | No | Future | No GitHub Actions workflows |

---

## SECTION 7 — UNUSED CODE

### 7.1 Files That Are Not Imported or Called

| File | Status | Notes |
|------|--------|-------|
| `backend/src/engine/deployment.engine.js` | Imported but not called | `deployment.service.js` no longer calls `deployApplication()` — the new flow skips the engine entirely |
| `backend/src/middleware/validate.js` | Imported but not called | Imported in `deployment.routes.js` but all `validate(...)` calls are commented out |
| `backend/src/models/DeploymentHistory.js` | Defined but not imported | No active code imports or uses this model |
| `backend/src/engine/floci.engine.js` | All 11 functions are placeholders | Imported and called by `floci.controller.js`, but all return empty mock data |
| `backend/src/controllers/floci.controller.js` | Active but returns placeholder data | Routes exist, all work — but every response contains empty arrays |

### 7.2 Commented-Out Code Blocks

| File | Lines Commented | Content |
|------|----------------|---------|
| `backend/src/routes/deployment.routes.js` | ~60 lines | Full CRUD routes (GET /, GET /:id, PUT /:id, DELETE /:id) + validation rules |
| `backend/src/controllers/deployment.controller.js` | ~50 lines | Old CRUD controller functions (create, get, getById, update, delete) |
| `backend/src/services/deployment.service.js` | ~100 lines | Old CRUD service functions + old deployment engine integration |

### 7.3 Empty Directories

| Directory | Expected Content |
|-----------|-----------------|
| `deployment-engine/src/docker/` | Docker driver classes |
| `deployment-engine/src/config/` | Configuration files |
| `deployment-engine/src/middlewares/` | Express middleware |
| `deployment-engine/src/registry/` | Registry integration classes |
| `deployment-engine/src/utils/` | Utility functions |
| `dashboard/src/assets/` | Static assets (images, fonts) |
| `dashboard/src/constants/` | Constants/configuration values |
| `dashboard/src/context/` | React Context providers |
| `dashboard/src/hooks/` | Custom React hooks |
| `dashboard/src/services/` | API service layer |
| `dashboard/src/utils/` | Utility functions |
| `sample-app/` | Sample application for testing |

### 7.4 Unused Dependencies

| Package | Location | Status | Why |
|---------|----------|--------|-----|
| `axios` | `dashboard/package.json` | Imported nowhere | Installed for future API calls |
| `react-hot-toast` | `dashboard/package.json` | Imported nowhere | Installed for future notifications |
| `compression` | `backend/package.json` | Used | ✓ (active in app.js) |
| `@kubernetes/client-node` | `deployment-engine/package.json` | Used | ✓ (active in kubernetes/client.js) |

---

## SECTION 8 — DEPENDENCIES

### 8.1 Backend (`backend/package.json`)

| Dependency | Version | Used? | Purpose | Can Remove? |
|-----------|---------|-------|---------|-------------|
| `bcryptjs` | ^3.0.3 | Yes | Password hashing in auth.service.js | No |
| `compression` | ^1.8.1 | Yes | Gzip response compression | No |
| `cors` | ^2.8.6 | Yes | Cross-origin resource sharing | No |
| `dotenv` | ^17.4.2 | Yes | Load .env file | No |
| `express` | ^5.2.1 | Yes | HTTP framework | No |
| `express-rate-limit` | ^8.5.2 | Yes | Rate limiting middleware | No |
| `helmet` | ^8.2.0 | Yes | Security headers | No |
| `jsonwebtoken` | ^9.0.3 | Yes | JWT signing and verification | No |
| `mongoose` | ^9.7.3 | Yes | MongoDB ODM | No |
| `morgan` | ^1.11.0 | Yes | HTTP request logging | No |
| `nodemon` (dev) | ^3.1.14 | Yes | Dev auto-restart | Optional |

### 8.2 Deployment Engine (`deployment-engine/package.json`)

| Dependency | Version | Used? | Purpose | Can Remove? |
|-----------|---------|-------|---------|-------------|
| `@kubernetes/client-node` | ^1.4.0 | Yes | K8s API client | No |
| `cors` | ^2.8.6 | Yes | CORS middleware | No |
| `dotenv` | ^17.4.2 | Yes | Load .env file | No |
| `express` | ^5.2.1 | Yes | HTTP framework | No |
| `helmet` | ^8.2.0 | Yes | Security headers | No |
| `morgan` | ^1.11.0 | Yes | HTTP request logging | No |
| `uuid` | ^14.0.1 | Yes | Unique ID generation | No |
| `nodemon` (dev) | ^3.1.14 | Yes | Dev auto-restart | Optional |

### 8.3 Dashboard (`dashboard/package.json`)

| Dependency | Version | Used? | Purpose | Can Remove? |
|-----------|---------|-------|---------|-------------|
| `@tailwindcss/vite` | ^4.3.2 | Yes | Tailwind CSS plugin for Vite | No |
| `axios` | ^1.18.1 | **No** | HTTP client | **Yes — not imported** |
| `framer-motion` | ^12.42.2 | Yes | Animation library | No |
| `lucide-react` | ^1.23.0 | Yes | Icon components | No |
| `react` | ^19.2.7 | Yes | UI framework | No |
| `react-dom` | ^19.2.7 | Yes | DOM rendering | No |
| `react-hot-toast` | ^2.6.0 | **No** | Toast notifications | **Yes — not imported** |
| `react-router-dom` | ^7.18.1 | Yes | Client-side routing | No |
| `tailwindcss` | ^4.3.2 | Yes | CSS framework | No |

---

## SECTION 9 — API LIST

### 9.1 Backend API (port 5000)

| Method | Endpoint | Auth | Controller | Status |
|--------|----------|------|-----------|--------|
| POST | `/auth/register` | No (rate-limited) | `register` | ✅ Complete |
| POST | `/auth/login` | No (rate-limited) | `login` | ✅ Complete |
| POST | `/auth/refresh` | Yes (rate-limited) | `refresh` | ✅ Complete |
| GET | `/auth/me` | Yes | `me` | ✅ Complete |
| GET | `/dashboard` | No | `getDashboard` | ✅ Complete (mock data) |
| POST | `/deployments` | No | `createDeployment` | ⚠️ Minimal |
| GET | `/registry` | Yes | `listImages` | ✅ Complete |
| GET | `/registry/sync` | Yes | `syncImages` | ✅ Complete |
| GET | `/registry/:name/tags` | Yes | `getTags` | ✅ Complete |
| DELETE | `/registry/:id` | Yes | `deleteImage` | ✅ Complete |
| GET | `/monitoring` | Yes | `getMetricsHandler` | ⚠️ Partial (no real data source) |
| GET | `/monitoring/summary` | Yes | `getSummary` | ⚠️ Partial (counts from Metric model) |
| GET | `/logs` | Yes | `getLogs` | ⚠️ Partial (queries Metric model, not Loki) |
| GET | `/floci/s3/buckets` | Yes | `getBuckets` | 🟡 Placeholder |
| POST | `/floci/s3/buckets` | Yes (admin) | `addBucket` | 🟡 Placeholder |
| GET | `/floci/s3/buckets/:name/objects` | Yes | `getObjects` | 🟡 Placeholder |
| GET | `/floci/lambda/functions` | Yes | `getFunctions` | 🟡 Placeholder |
| POST | `/floci/lambda/functions/:name/invoke` | Yes | `runFunction` | 🟡 Placeholder |
| GET | `/floci/iam/users` | Yes | `getUsers` | 🟡 Placeholder |
| POST | `/floci/iam/users` | Yes (admin) | `addUser` | 🟡 Placeholder |
| GET | `/floci/sns/topics` | Yes | `getTopics` | 🟡 Placeholder |
| POST | `/floci/sns/publish` | Yes | `publishMessage` | 🟡 Placeholder |
| GET | `/floci/sqs/queues` | Yes | `getQueues` | 🟡 Placeholder |
| POST | `/floci/sqs/send` | Yes | `postMessage` | 🟡 Placeholder |

### 9.2 System Endpoints (port 5000, no auth)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/health` | Health check — returns running status |
| GET | `/ready` | Readiness check — returns MongoDB connection state |

### 9.3 Deployment Engine API (port 6000)

| Method | Endpoint | Auth | Purpose | Status |
|--------|----------|------|---------|--------|
| POST | `/deploy` | No | Create K8s deployment + service | ✅ Complete |
| GET | `/health` | No | Health check | ✅ Complete |

---

## SECTION 10 — DEPLOYMENT FLOW

### 10.1 Current Flow (What Happens When You Deploy)

```
Step 1: POST /api/deployments  { repositoryUrl, branch }
    │
    ▼
Step 2: deployment.service.js → registerRepository()
    │
    ├── Validates GitHub URL with regex:
    │     /^https:\/\/github\.com\/[\w.-]+\/[\w.-]+(\.git)?$/
    │
    ├── Creates Deployment record in MongoDB:
    │     { repositoryUrl, branch, status: "REGISTERED" }
    │
    └── Returns the new Deployment object
    │
    ▼
Step 3: Response
    { success: true, data: { repositoryUrl, branch, status: "REGISTERED", ... } }
```

### 10.2 Deployment Engine Flow (Current, Direct Route)

```
Step 1: POST http://localhost:6000/deploy  { applicationName, dockerImage, containerPort, ... }
    │
    ▼
Step 2: deployment.service.js
    │
    ├── generateDeploymentManifest(deployment)
    │     → { apiVersion: "apps/v1", kind: "Deployment", metadata: {...}, spec: {...} }
    │
    ├── generateServiceManifest(deployment)
    │     → { apiVersion: "v1", kind: "Service", metadata: {...}, spec: {...} }
    │
    ├── createDeployment(manifest)
    │     → appsApi.createNamespacedDeployment({ namespace, body: manifest })
    │
    ├── createService(manifest)
    │     → coreApi.createNamespacedService({ namespace, body: manifest })
    │
    └── Returns { success, deploymentId: uuid(), status: "Pending", manifests }
    │
    ▼
Step 3: Response
    { success: true, deploymentId: "...", status: "Pending", deploymentManifest: {...}, serviceManifest: {...} }
```

### 10.3 Intended Full Flow (Future)

```
Frontend → POST /api/deployments
    │
    ▼
Backend → deployment.service.js
    │
    ├── Validate input
    ├── Create DeploymentHistory record (status: "Pending")
    ├── Call Deployment Engine: POST http://localhost:6000/deploy
    │     │
    │     ▼
    │   Deployment Engine
    │     │
    │     ├── PipelineRunner.run(context)
    │     │     ├── ValidateStep        (validate input)
    │     │     ├── PrepareWorkspaceStep (clone repo)
    │     │     ├── BuildImageStep      (docker build)
    │     │     ├── PushRegistryStep    (docker push)
    │     │     ├── GenerateManifestStep (K8s manifests)
    │     │     ├── DeployKubernetesStep (kubectl apply)
    │     │     ├── WaitForReadyStep    (kubectl rollout status)
    │     │     ├── UpdateDatabaseStep  (update DeploymentHistory)
    │     │     └── CleanupStep         (remove temp files)
    │     │
    │     └── Return final PipelineContext
    │
    ├── Update DeploymentHistory with result
    └── Return response to frontend
    │
    ▼
Frontend updates UI with deployment status
```

---

## SECTION 11 — ARCHITECTURE SUMMARY

### 11.1 What Is Already Complete

| Component | Completeness | Details |
|-----------|-------------|---------|
| **Authentication** | 100% | Register, login, JWT refresh, user profile, role-based authorization, rate limiting |
| **Backend Express App** | 100% | Middleware stack, health/readiness, error handling, 404 handling, graceful shutdown |
| **API Utilities** | 100% | ApiError, ApiResponse, asyncHandler, logger |
| **Request Validation** | 100% | `validate.js` middleware supports all common field rules (currently unused) |
| **Rate Limiting** | 100% | 3 limiters applied to auth, deployment, and general API |
| **Registry CRUD** | 90% | Full CRUD on RegistryImage model + sync from Docker CLI |
| **Kubernetes Client** | 90% | Full K8s client setup, deployment/service creation API calls |
| **Manifest Generation** | 100% | Deployment and Service manifest generators for K8s |
| **Frontend UI** | 95% | 7 full pages with polished UI, animations, modals, drawers — using mock data |

### 11.2 What Is Partially Complete

| Component | Completeness | Gap |
|-----------|-------------|-----|
| **Deployment (Backend)** | 20% | Only POST / exists with GitHub URL validation. No CRUD, no engine integration, no deployment history tracking with the old schema |
| **Monitoring API** | 50% | API routes exist, queries Metric model with pagination. But no Prometheus/Grafana/cAdvisor actually feeds data into it |
| **Logging API** | 50% | API route exists, queries Metric model with Loki source filter. But no Loki/Promtail actually feeds data into it |
| **Deployment Engine Service** | 60% | Generates manifests + calls K8s API. But has no error recovery, no status polling, no rollback |
| **Docker Engine** | 20% | Only `listImages` is implemented. No build, push, tag, pull, or delete |

### 11.3 What Is Only Placeholder

| Component | Files | Current Behavior |
|-----------|-------|-----------------|
| **Floci (all 5 services)** | `floci.engine.js` — 11 functions | All return `{ success: true, ... }` with empty arrays |
| **Deployment Engine** | `deployment.engine.js` — `deployApplication` | Logs payload, returns queued status — not called by any active code |
| **Pipeline** | `PipelineRunner.js`, `PipelineContext.js`, `BaseStep.js` | Architecture skeleton with no concrete steps and no usages |

### 11.4 What Should Be Removed

| File/Folder | Reason |
|-------------|--------|
| `backend/src/engine/deployment.engine.js` | Not called by any active code; `deployment.service.js` bypasses it entirely |
| `backend/src/models/DeploymentHistory.js` | Not imported by any active code; superseded by `Deployment.js` model |
| `backend/src/middleware/validate.js` | Not called by any active route; all `validate()` calls are commented out |
| `backend/src/controllers/floci.controller.js` + `floci.engine.js` | 11 placeholder functions returning empty data — routes exist but do nothing useful |
| `deployment-engine/src/docker/`, `config/`, `middlewares/`, `registry/`, `utils/` | 6 empty directories with no files |
| `dashboard/src/assets/`, `constants/`, `context/`, `hooks/`, `services/`, `utils/` | 6 empty directories with no files |
| `sample-app/` | Empty directory |
| `axios`, `react-hot-toast` in `dashboard/package.json` | Installed but never imported |

### 11.5 What Should Be Implemented NEXT

In priority order:

1. **Connect Frontend to Backend** — Replace all mock data files with actual API calls using `axios`. This is the single highest-impact task — the UI is beautiful but completely disconnected.

2. **Complete Deployment CRUD** — Uncomment the commented-out deployment routes, controllers, and services. Wire the full deployment lifecycle (create, list, get, update, delete) back to the `DeploymentHistory` model.

3. **Wire Backend to Deployment Engine** — The backend `POST /api/deployments` should forward deployment requests to the Deployment Engine's `POST /deploy` endpoint (internal HTTP call), creating a proper two-service architecture.

4. **Implement Pipeline Steps** — Replace the empty pipeline skeleton with concrete steps. Start with `ValidateStep`, `GenerateManifestStep`, and `DeployKubernetesStep` — reusing the existing manifest generators and K8s wrappers.

5. **Add Status Tracking** — After deploying to K8s, poll the deployment status and update the database. Currently `createDeployment` returns "Pending" and never updates.

6. **Add Authentication to Frontend** — Implement login/register pages, token storage, and protected routing matching the backend auth system.

7. **Floci Real Implementation** — Deploy MinIO (S3), local Lambda runner, and local SNS/SQS emulators, then connect the existing API routes.

8. **Monitoring Stack** — Deploy Prometheus + Grafana + cAdvisor + Node Exporter (via Docker Compose), start feeding the Metric model with real data.

9. **Logging Stack** — Deploy Loki + Promtail (via Docker Compose), start feeding the Metric model with real log data.

10. **Testing** — Start with unit tests for services (auth.service.js, registry.service.js), then integration tests for endpoints, then end-to-end tests for the deployment flow.

---

*End of PROJECT_STRUCTURE.md*
