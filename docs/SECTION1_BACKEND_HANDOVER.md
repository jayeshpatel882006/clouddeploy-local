# Backend Architecture — Complete Technical Handover

> **Project:** CloudDeploy Local
> **Section:** 1 of 4 — Backend
> **Audience:** Senior Engineer joining the project

---

## Table of Contents

1. [Directory Overview](#1-directory-overview)
2. [`package.json` — Dependencies & Scripts](#2-packagejson--dependencies--scripts)
3. [`server.js` — Entry Point](#3-serverjs--entry-point)
4. [`config/database.js` — MongoDB Connection](#4-configdatabasejs--mongodb-connection)
5. [`app.js` — Express Application Factory](#5-appjs--express-application-factory)
6. [`routes/index.js` — Route Aggregator](#6-routesindexjs--route-aggregator)
7. [Route Files — Individual Walkthroughs](#7-route-files--individual-walkthroughs)
8. [Controllers — Thin Request Handlers](#8-controllers--thin-request-handlers)
9. [Services — Business Logic Layer](#9-services--business-logic-layer)
10. [Models — Mongoose Schemas](#10-models--mongoose-schemas)
11. [Middleware — Auth, Validation, Error Handling](#11-middleware)
12. [Utilities — ApiError, ApiResponse, Logger, AsyncHandler](#12-utilities)
13. [Engine Layer — Docker, Kubernetes, Floci, Deployment](#13-engine-layer)
14. [Complete Request Lifecycle](#14-complete-request-lifecycle)

---

## 1. Directory Overview

```
backend/
├── package.json
├── src/
│   ├── server.js              # Process entry point
│   ├── app.js                 # Express app factory
│   ├── config/
│   │   └── database.js        # Mongoose connection
│   ├── routes/
│   │   ├── index.js           # Route aggregator
│   │   ├── auth.routes.js     # /api/auth/*
│   │   ├── dashboard.routes.js   # /api/dashboard
│   │   ├── deployment.routes.js  # /api/deployments (CRUD)
│   │   ├── registry.routes.js    # /api/registry
│   │   ├── monitoring.routes.js  # /api/monitoring
│   │   ├── logging.routes.js     # /api/logs
│   │   └── floci.routes.js       # /api/floci/*
│   ├── controllers/           # Thin request handlers
│   │   ├── auth.controller.js
│   │   ├── dashboard.controller.js
│   │   ├── deployment.controller.js
│   │   ├── registry.controller.js
│   │   ├── monitoring.controller.js
│   │   ├── logging.controller.js
│   │   └── floci.controller.js
│   ├── services/              # Business logic
│   │   ├── auth.service.js
│   │   ├── dashboard.service.js
│   │   ├── deployment.service.js
│   │   ├── registry.service.js
│   │   ├── monitoring.service.js
│   │   └── logging.service.js
│   ├── models/                # Mongoose schemas
│   │   ├── User.js
│   │   ├── DeploymentHistory.js
│   │   ├── Metric.js
│   │   └── RegistryImage.js
│   ├── middleware/
│   │   ├── auth.js            # JWT authenticate + authorize
│   │   ├── errorHandler.js    # Global error handler
│   │   ├── notFound.js        # 404 handler
│   │   ├── rateLimiter.js     # Rate limiting configs
│   │   └── validate.js        # Custom field validation
│   ├── utils/
│   │   ├── ApiError.js        # Error class with static factories
│   │   ├── ApiResponse.js     # Response envelope class
│   │   ├── asyncHandler.js    # Async error wrapper
│   │   └── logger.js          # Console-based logger
│   └── engine/                # Infrastructure integration
│       ├── deployment.engine.js   # Placeholder pipeline
│       ├── docker.engine.js       # Docker CLI wrapper (REAL)
│       ├── k8s.engine.js          # K8s client (REAL)
│       └── floci.engine.js        # All placeholders
├── docs/
│   └── API_REFERENCE.md
├── bruno/                     # Bruno API collections
└── postman/                   # Postman collection
```

### Why Each Folder Exists

| Folder | Purpose |
|--------|---------|
| `config/` | Centralized configuration (database, environment, future config) |
| `routes/` | HTTP route definitions + OpenAPI JSDoc annotations |
| `controllers/` | Extract data from req/res, delegate to services, send responses |
| `services/` | Business logic, orchestration, DB queries |
| `models/` | Mongoose schema definitions + validation rules |
| `middleware/` | Cross-cutting concerns: auth, validation, error handling, rate limiting |
| `utils/` | Shared utilities used across all layers |
| `engine/` | Infrastructure integration (Docker, K8s, cloud services) |
| `docs/` | Documentation |
| `bruno/` | Bruno API client request files |
| `postman/` | Postman collection export |

---

## 2. `package.json` — Dependencies & Scripts

### Scripts

```json
"dev": "nodemon src/server.js",
"start": "node src/server.js"
```

Both trigger `src/server.js`. `dev` auto-restarts on file changes via Nodemon.

### Dependencies

| Dependency | Version | Why |
|---|---|---|
| `express` | ^5.2.1 | HTTP framework. Express 5 has native async error handling (no need for `express-async-errors`) |
| `mongoose` | ^9.7.3 | MongoDB ODM — schema validation, query building |
| `jsonwebtoken` | ^9.0.3 | JWT creation + verification — stateless auth |
| `bcryptjs` | ^3.0.3 | Password hashing — pure JS, no native compilation |
| `swagger-jsdoc` | ^6.3.0 | Generates OpenAPI 3.0 spec from JSDoc annotations |
| `swagger-ui-express` | ^5.0.1 | Serves Swagger UI from the spec |
| `helmet` | ^8.2.0 | Security headers (CSP, HSTS, XSS, etc.) |
| `cors` | ^2.8.6 | Cross-origin resource sharing (allows all origins) |
| `compression` | ^1.8.1 | Gzip response compression |
| `morgan` | ^1.11.0 | HTTP request logging (combined format) |
| `express-rate-limit` | ^8.5.2 | Rate limiting middleware |
| `dotenv` | ^17.4.2 | Loads .env into process.env |
| `@kubernetes/client-node` | ^1.4.0 | K8s API client (used in k8s.engine.js and deployment-engine) |
| `nodemon` (dev) | ^3.1.14 | File watcher for dev auto-restart |

---

## 3. `server.js` — Entry Point

### Why It Exists
Process entry point. Orchestrates startup: load env → validate → connect DB → start HTTP server → register signal handlers.

### Execution Flow

```
server.js starts
    │
    ▼
dotenv.config() — loads .env into process.env
    │
    ▼
validateEnvironment() — checks MONGODB_URI and JWT_SECRET
    ├── production: process.exit(1) if missing
    └── development: warn + continue with fallback defaults
    │
    ▼
connectDB() — from ./config/database.js
    │
    ▼
app.listen(PORT) — creates HTTP server on port 5000
    │
    ▼
Register process handlers:
    ├── SIGTERM → shutdown("SIGTERM")
    ├── SIGINT  → shutdown("SIGINT")
    ├── uncaughtException → log + exit(1)
    └── unhandledRejection → log + exit(1)
```

### `validateEnvironment()`
- Only checks `MONGODB_URI` and `JWT_SECRET`
- In production: hard exit if missing
- In development: warns but continues (fallback defaults exist in the code)

### `shutdown(signal)`
- Calls `server.close()` to stop accepting new connections
- Force exits after 10s timeout (prevents hanging)
- Called on SIGTERM (Docker stop, systemd stop) and SIGINT (Ctrl+C)

### Process Error Handlers
- `uncaughtException` and `unhandledRejection` both log and `exit(1)`
- This is the default Node behavior made explicit

### Who Calls It
- `npm run dev` → nodemon → node
- `npm start` → node

### What It Calls
- `./app.js` (the Express app)
- `./config/database.js` (MongoDB connection)
- `./utils/logger.js` (logging)
- `mongoose` (dynamic import in /ready endpoint)

---

## 4. `config/database.js` — MongoDB Connection

### Why It Exists
Establishes a single Mongoose connection at startup.

### Code
```js
const connectDB = async () => {
  const connection = await mongoose.connect(process.env.MONGODB_URI);
  console.log(`✅ MongoDB Connected: ${connection.connection.host}`);
};
```

### Error Behavior
On failure, logs error and calls `process.exit(1)`. No retry logic.

### Design Decisions
- No connection options passed (Mongoose 9 defaults are fine)
- No replica set config (single-node local setup)
- No connection pooling configuration
- Called once at startup — only connects during initialization

### Who Calls It
- `server.js` — `await connectDB()`

---

## 5. `app.js` — Express Application Factory

### Why It Exists
Creates and configures the Express app. Does NOT start the server. This separation enables testing (import app without binding a port).

### Middleware Stack (Order Matters)

```
1. helmet()              → Security headers (XSS, CSP, HSTS, etc.)
2. compression()         → Gzip response bodies
3. cors()                → CORS headers (all origins allowed)
4. express.json()        → Parse JSON bodies (limit: 10MB)
5. morgan("combined")    → HTTP request logging
6. apiLimiter            → Rate limit: 100 req / 15 min on /api/*
7. Swagger UI            → Serves /api/docs, /api/docs.json
8. Routes (/api)         → All business routes
9. notFound              → 404 handler (last resort)
10. errorHandler         → Global error handler (catches thrown errors)
```

### Swagger Configuration

```js
const swaggerDefinition = {
  openapi: "3.0.0",
  servers: [{ url: "http://localhost:5000/api" }],
  components: {
    securitySchemes: {
      bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" }
    }
  },
  security: [{ bearerAuth: [] }]  // ← default: all endpoints require auth
};
```

**Critical detail**: `security: [{ bearerAuth: [] }]` means every documented endpoint requires auth by default. Individual endpoints override with `security: []` (health, dashboard, register, login, deployments).

### The Windows Glob Workaround

```js
const readDirSafe = (dir) => {
  try { return fs.readdirSync(dir).map(f => join(dir, f)); }
  catch { return []; }
};
const routeFiles = readDirSafe(join(__dirname, "./routes"));
const modelFiles = readDirSafe(join(__dirname, "./models"));
```

`swagger-jsdoc` glob patterns don't work on Windows. Files are enumerated explicitly.

### Health & Readiness Endpoints

**`GET /health`** (at app root, not under /api):
- Returns `200 { success: true, message: "CloudDeploy API is running", data: null }`
- Uses `ApiResponse.send(res)`

**`GET /ready`** (at app root):
- Dynamically imports mongoose to check `connection.readyState`
- `readyState === 1` (connected) → 200
- Anything else → 503
- Uses `res.status().json()` directly (not ApiResponse)

### Route Mounting
```js
app.use("/api", routes);        // all business routes
app.use(notFound);              // 404 handler
app.use(errorHandler);          // error handler
```

### Who Calls It
- `server.js` imports it and calls `app.listen(PORT)`

---

## 6. `routes/index.js` — Route Aggregator

### Why It Exists
Centralizes route mounting. Without this, `app.js` would need 7 separate `app.use()` calls.

### Code
```js
router.use("/dashboard", dashboardRoutes);    // → /api/dashboard
router.use("/deployments", deploymentRoutes);  // → /api/deployments
router.use("/auth", authRoutes);              // → /api/auth
router.use("/registry", registryRoutes);      // → /api/registry
router.use("/monitoring", monitoringRoutes);  // → /api/monitoring
router.use("/logs", loggingRoutes);           // → /api/logs
router.use("/floci", flociRoutes);            // → /api/floci
```

### Design Decision
Child routes use relative paths (e.g., `router.get("/")` instead of `router.get("/dashboard")`). The parent prefix is set here. This keeps path configuration centralized.

### Who Calls It
- `app.js` — `app.use("/api", routes)`

---

## 7. Route Files — Individual Walkthroughs

### 7.1 `auth.routes.js` — Authentication

| Method | Path | Middleware | Controller |
|--------|------|-----------|------------|
| POST | `/api/auth/register` | `authLimiter` | `register` |
| POST | `/api/auth/login` | `authLimiter` | `login` |
| POST | `/api/auth/refresh` | `authLimiter` + `authenticate` | `refresh` |
| GET | `/api/auth/me` | `authenticate` | `me` |

- `authLimiter`: 10 requests per 15 minutes (protects against brute force)
- `authenticate`: JWT verification middleware
- Register and login have NO `authenticate` (circular dependency — need credentials before token)
- Each route has `@openapi` JSDoc block for Swagger generation

### 7.2 `dashboard.routes.js` — Dashboard

| Method | Path | Middleware | Controller |
|--------|------|-----------|------------|
| GET | `/api/dashboard` | **None** | `getDashboard` |

- No authentication (dashboard data is non-sensitive mock data)
- No rate limiting beyond the global `apiLimiter`

### 7.3 `deployment.routes.js` — Deployments CRUD

| Method | Path | Middleware | Controller |
|--------|------|-----------|------------|
| POST | `/api/deployments` | `deploymentLimiter` + `validate(createDeploymentRules)` | `createDeployment` |
| GET | `/api/deployments` | none | `getDeployments` |
| GET | `/api/deployments/:id` | none | `getDeploymentById` |
| PUT | `/api/deployments/:id` | `deploymentLimiter` + `validate(updateDeploymentRules)` | `updateDeployment` |
| DELETE | `/api/deployments/:id` | none | `deleteDeployment` |

**Validation rules** (defined in file):

`createDeploymentRules` (3 required):
- `applicationName`: required, string, 2-100 chars
- `dockerImage`: required, string, min 2 chars
- `containerPort`: required, number, 1-65535
- Optional: namespace, imageTag, replicas (1-100), deployedBy, commitSha, deploymentMessage

`updateDeploymentRules`:
- All fields optional
- Adds `status` enum: Pending|Running|Updating|Failed|Stopped|Deleted

- `deploymentLimiter`: 50 requests per 60 minutes (on create and update only)
- **No authentication** on any deployment endpoint — this is a gap

### 7.4 `registry.routes.js` — Image Registry

| Method | Path | Middleware | Controller |
|--------|------|-----------|------------|
| GET | `/api/registry` | `authenticate` | `listImages` |
| GET | `/api/registry/sync` | `authenticate` | `syncImages` |
| GET | `/api/registry/:name/tags` | `authenticate` | `getTags` |
| DELETE | `/api/registry/:id` | `authenticate` | `deleteImage` |

- All endpoints require JWT authentication
- No role-based authorization beyond authentication
- Sync reads Docker daemon images and upserts into MongoDB

### 7.5 `monitoring.routes.js` — Monitoring Metrics

| Method | Path | Middleware | Controller |
|--------|------|-----------|------------|
| GET | `/api/monitoring` | `authenticate` | `getMetricsHandler` |
| GET | `/api/monitoring/summary` | `authenticate` | `getSummary` |

Query parameters: `source`, `metricName`, `startDate`, `endDate`, `limit`
- All require authentication

### 7.6 `logging.routes.js` — Logs

| Method | Path | Middleware | Controller |
|--------|------|-----------|------------|
| GET | `/api/logs` | `authenticate` | `getLogs` |

Query parameters: `level`, `source`, `search`, `startDate`, `endDate`, `page`, `limit`
- Requires authentication
- **Bug**: Logging service queries for `source: "loki"` but the Metric model's `source` enum only allows `["prometheus","grafana","node_exporter","cadvisor"]`

### 7.7 `floci.routes.js` — AWS-Compatible Services (11 endpoints)

All routes use `router.use(authenticate)` at the router level (applied to all).

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/floci/s3/buckets` | Bearer | List buckets |
| POST | `/api/floci/s3/buckets` | Bearer + admin | Create bucket |
| GET | `/api/floci/s3/buckets/:name/objects` | Bearer | List objects |
| GET | `/api/floci/lambda/functions` | Bearer | List functions |
| POST | `/api/floci/lambda/functions/:name/invoke` | Bearer | Invoke function |
| GET | `/api/floci/iam/users` | Bearer | List IAM users |
| POST | `/api/floci/iam/users` | Bearer + admin | Create IAM user |
| GET | `/api/floci/sns/topics` | Bearer | List SNS topics |
| POST | `/api/floci/sns/publish` | Bearer | Publish message |
| GET | `/api/floci/sqs/queues` | Bearer | List queues |
| POST | `/api/floci/sqs/send` | Bearer | Send message |

- Admin-only: create S3 bucket, create IAM user (uses `authorize("admin")`)
- Controllers call `floci.engine.js` which returns **all placeholder data** (empty arrays)

---

## 8. Controllers — Thin Request Handlers

### Pattern
Every controller function follows this exact contract:

```js
const handler = asyncHandler(async (req, res) => {
  const result = await someService(someData);
  return new ApiResponse(statusCode, result, "message").send(res);
});
```

### Input Sources
- `req.body` — POST/PUT request bodies
- `req.query` — GET query parameters
- `req.params` — URL parameters (/:id)
- `req.user` — Auth middleware attaches decoded user

### Output
- Always `ApiResponse.send(res)` — never raw `res.json()`
- Always catches errors via `asyncHandler`

### Controller Functions

| File | Function | Input | Calls | Status |
|------|----------|-------|-------|--------|
| `auth.controller.js` | `register` | `req.body` | `registerUser(body)` | 201 |
| | `login` | `req.body` | `loginUser(body)` | 200 |
| | `refresh` | `req.user.id` | `refreshToken(id)` | 200 |
| | `me` | `req.user.id` | `getCurrentUser(id)` | 200 |
| `dashboard.controller.js` | `getDashboard` | nothing | `getDashboardOverview()` | 200 |
| `deployment.controller.js` | `createDeployment` | `req.body` | `createDeploymentService(body)` | 201 |
| | `getDeployments` | `req.query` | `getDeploymentsService(query)` | 200 |
| | `getDeploymentById` | `req.params.id` | `getDeploymentByIdService(id)` | 200 |
| | `updateDeployment` | `req.params.id` + `req.body` | `updateDeploymentService(id, body)` | 200 |
| | `deleteDeployment` | `req.params.id` | `deleteDeploymentService(id)` | 200 |
| `registry.controller.js` | `listImages` | `req.query` | `listRegistryImages(query)` | 200 |
| | `getTags` | `req.params.name` | `getImageTags(name)` | 200 |
| | `deleteImage` | `req.params.id` | `deleteRegistryImage(id)` | 200 |
| | `syncImages` | nothing | `syncRegistryFromDocker()` | 200 |
| `monitoring.controller.js` | `getMetricsHandler` | `req.query` | `getMetrics(query)` | 200 |
| | `getSummary` | nothing | `getMetricSummary()` | 200 |
| `logging.controller.js` | `getLogs` | `req.query` | `listLogs(query)` | 200 |
| `floci.controller.js` | `getBuckets` | nothing | `listBuckets()` | 200 |
| | `addBucket` | `req.body.bucketName` | `createBucket(name)` | 201 |
| | `getObjects` | `req.params.bucketName` | `listObjects(name)` | 200 |
| | `getFunctions` | nothing | `listFunctions()` | 200 |
| | `runFunction` | `req.params.functionName` + `req.body` | `invokeFunction(name, body)` | 200 |
| | `getUsers` | nothing | `listUsers()` | 200 |
| | `addUser` | `req.body.username` | `createUser(name)` | 201 |
| | `getTopics` | nothing | `listTopics()` | 200 |
| | `publishMessage` | `req.body` | `publishToTopic(topicArn, message)` | 200 |
| | `getQueues` | nothing | `listQueues()` | 200 |
| | `postMessage` | `req.body` | `sendMessage(queueUrl, messageBody)` | 200 |

---

## 9. Services — Business Logic Layer

Services sit between controllers and engines/models. They perform validation, orchestration, and CRUD.

### 9.1 `auth.service.js` — Authentication Logic

**`registerUser({ email, password, name })`**:
1. Checks for existing email → throws 409 Conflict if exists
2. Hashes password with bcrypt (salt rounds: 12 — intentionally slow, ~300ms)
3. Creates User with `role: "user"`
4. Generates JWT: `jwt.sign({ id, email, role }, JWT_SECRET, { expiresIn: "7d" })`
5. Returns `{ token, user: { id, email, name, role } }`

**`loginUser({ email, password })`**:
1. Finds user by email with `+password` (password field has `select: false`)
2. Compares password
3. Both "email not found" and "wrong password" → `"Invalid email or password"` (prevents user enumeration)
4. Returns `{ token, user }`

**`refreshToken(userId)`**:
1. Finds user by ID
2. Generates new JWT
3. Returns `{ token }`
4. **No token invalidation** — old token remains valid until expiry
5. **No refresh token rotation** — no token blacklist

**`getCurrentUser(userId)`**:
1. Finds user by ID (lean query)
2. Returns full user document

### 9.2 `dashboard.service.js` — Mock Data

**`getDashboardOverview()`**:
```js
return {
  applications: 8,
  runningPods: 24,
  clusterStatus: "Healthy",
  cpuUsage: "32%",
  memoryUsage: "46%",
  deployments: [{ id: 1, name: "Inventory API", status: "Running" }, ...]
};
```

Returns hardcoded values. No DB or infrastructure calls.

### 9.3 `deployment.service.js` — Full CRUD + Engine Trigger

**`createDeploymentService(deploymentData)`**:
1. Manual required-field check for applicationName, dockerImage, containerPort → 400 if missing
2. `DeploymentHistory.create({ ...data, status: "Pending" })`
3. `deployApplication(deployment)` from deployment.engine.js
4. Returns `{ deploymentId, engine: engineResponse }`
5. **Gap**: No error handling around `deployApplication` — if engine throws, DB record is already saved with `status: "Pending"` and no cleanup

**`getDeploymentsService(query)`**:
1. Builds MongoDB filter from: `status`, `namespace`, `search` (regex on applicationName)
2. Parses `page` (min 1), `limit` (max 100, min 1)
3. Parses `sortBy` (default "createdAt"), `sortOrder` (asc/desc)
4. Parallel `find()` + `countDocuments()` via Promise.all
5. Returns `{ deployments, pagination: { page, limit, total, totalPages, hasNextPage, hasPrevPage } }`

**`getDeploymentByIdService(id)`**: `findById(id).lean()` → 404 if not found

**`updateDeploymentService(id, updateData)`**: `findByIdAndUpdate(id, { $set: updateData }, { new: true, runValidators: true })`

**`deleteDeploymentService(id)`**: `findByIdAndDelete(id)` → 404 if not found → returns `{ id, status: "Deleted" }`

### 9.4 `registry.service.js` — Image Registry DB Management

**`listRegistryImages(query)`**: Paginated list, optional `search` regex on name, sorted by `updatedAt` desc

**`getImageTags(name)`**: All documents matching name, sorted by `updatedAt` desc

**`deleteRegistryImage(id)`**: `findByIdAndDelete` → 404 if not found

**`syncRegistryFromDocker()`**:
1. Calls `docker.engine.listImages()` — runs `docker images --format` command
2. If Docker command fails → throws 500 Internal
3. Iterates over images, upserts each into MongoDB via `findOneAndUpdate` with `upsert: true`
4. Uses compound unique index on `(name, tag)` — duplicates update, new entries create
5. Returns `{ synced: count }`

### 9.5 `monitoring.service.js` — Metric Queries

**`getMetrics(query)`**: Filters by `source`, `metricName`, date range. Paginated (max 200 per page). Sorted by `timestamp` desc.

**`getMetricSummary()`**: For each distinct `source`, counts documents + finds latest timestamp. Returns: `{ prometheus: { count, latestTimestamp }, grafana: {...}, ... }`

### 9.6 `logging.service.js` — Log Queries

**`listLogs(query)`**: Same pattern as monitoring, but **hardcodes** `{ source: "loki" }` filter.

**Bug**: The Metric model's `source` enum is `["prometheus", "grafana", "node_exporter", "cadvisor"]` — does NOT include "loki". This means:
- Either "loki" documents were inserted directly into MongoDB (bypassing Mongoose)
- Or the logging service will never find any documents

---

## 10. Models — Mongoose Schemas

### 10.1 `User.js`

| Field | Type | Constraints |
|-------|------|-------------|
| email | String | **required**, **unique**, `lowercase: true`, `trim: true` |
| password | String | **required**, **`select: false`** (never returned by default), `minlength: 8` |
| name | String | **required**, `trim: true` |
| role | String | enum: `["user", "admin", "viewer"]`, default: `"user"` |
| isActive | Boolean | default: `true` |
| timestamps | auto | createdAt, updatedAt |

**`select: false` on password**: The most critical security feature — queries return users without the password field. You must explicitly use `.select('+password')` to include it (only `loginUser` does this).

**Role enum**: `user`, `admin`, `viewer`. Only `admin` is actually checked (in Floci's `authorize("admin")`). `viewer` is defined but not enforced.

### 10.2 `DeploymentHistory.js`

| Field | Type | Constraints |
|-------|------|-------------|
| applicationName | String | **required**, `trim: true` |
| namespace | String | default: `"default"` |
| dockerImage | String | **required** |
| imageTag | String | default: `"latest"` |
| replicas | Number | default: `1` |
| containerPort | Number | **required** |
| status | String | enum: `[Pending, Running, Updating, Failed, Stopped, Deleted]`, default: `"Pending"` |
| deployedBy | String | default: `"system"` |
| commitSha | String | default: `""` |
| deploymentMessage | String | default: `""` |
| timestamps | auto | createdAt, updatedAt |

**`deployedBy` is a String**, not a reference to User — no relationship between a deployment and who created it.

**Status enum**: Expected lifecycle: `Pending` → `Running` (or `Failed`) → `Updating` → `Deleted`/`Stopped`. No state machine enforcement — any status can transition to any other.

### 10.3 `Metric.js`

| Field | Type | Constraints |
|-------|------|-------------|
| source | String | enum: `[prometheus, grafana, node_exporter, cadvisor]`, **required** |
| metricName | String | **required** |
| value | Mixed | **required** — can be Number, String, Object, Array |
| labels | Map of String | default: `{}` |
| timestamp | Date | default: `Date.now` |
| timestamps | auto | createdAt, updatedAt |

**Index**: `{ source: 1, metricName: 1, timestamp: -1 }` — optimized for source + metric name queries sorted by time.

**`value: Mixed`**: No type validation at the schema level.

### 10.4 `RegistryImage.js`

| Field | Type | Constraints |
|-------|------|-------------|
| name | String | **required**, `trim: true` |
| tag | String | default: `"latest"` |
| digest | String | default: `""` |
| size | String | default: `""` — human-readable (e.g., "187MB") |
| registry | String | default: `"localhost:5000"` |
| pulledAt | Date | default: `Date.now` |
| timestamps | auto | createdAt, updatedAt |

**Index**: `{ name: 1, tag: 1 }` — **unique** compound index. Same name+tag can only exist once. Enables `upsert` in `syncRegistryFromDocker`.

---

## 11. Middleware

### 11.1 `auth.js` — Authentication & Authorization

**`authenticate` middleware**:
1. Reads `Authorization` header
2. Checks it starts with `"Bearer "`
3. Extracts token, verifies with `jwt.verify(token, JWT_SECRET)`
4. Looks up user by `decoded.id` in MongoDB
5. Checks `user.isActive` — inactive users rejected
6. Attaches full user document to `req.user`
7. Calls `next()`

Error handling:
- Invalid/expired JWT → `ApiError.unauthorized("Invalid or expired token")`
- Other JWT errors (malformed, etc.) → propagate to error handler

**`authorize(...roles)` middleware** (factory pattern):
```js
const authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return next(ApiError.forbidden("Insufficient permissions"));
  }
  next();
};
```

Used as: `authorize("admin")` or `authorize("admin", "user")`.

### 11.2 `errorHandler.js` — Global Error Handler

Order of checks:
1. **Mongoose ValidationError** → 400 with array of error messages
2. **Mongoose duplicate key** (code 11000) → 409 with field name
3. **Mongoose CastError** (bad ObjectId) → 400 with invalid path/value
4. **ApiError instance** → uses `err.statusCode` and `err.message`, includes `err.details` if present
5. **Unknown error** → 500 (generic message in production, full message + stack in development)

All errors are logged via `logger.error()`.

### 11.3 `notFound.js` — 404 Handler

```js
res.status(404).json({
  success: false,
  message: `Route not found: ${req.method} ${req.originalUrl}`
});
```

### 11.4 `rateLimiter.js` — Rate Limiting

| Limiter | Window | Max Requests | Applied To |
|---------|--------|--------------|------------|
| `apiLimiter` | 15 min | 100 | All `/api/*` routes (global) |
| `authLimiter` | 15 min | 10 | Auth endpoints |
| `deploymentLimiter` | 60 min | 50 | Deployment create + update |

### 11.5 `validate.js` — Custom Validation Middleware

**How it works**:
1. Accepts `rules` object: `{ fieldName: { required, type, minLength, maxLength, min, max, enum, message } }`
2. Returns Express middleware
3. For each field in rules:
   - `required: true` + empty value → add error
   - If value exists, check type, minLength, maxLength, min, max, enum
4. If errors exist → `next(ApiError.badRequest("Validation failed", errors))`
5. Otherwise → `next()`

**Limitations**:
- Only `req.body` — not query params or URL params
- No nested object validation
- No custom validation functions
- No cross-field validation
- No type coercion

---

## 12. Utilities

### 12.1 `ApiError.js` — Custom Error Class

```js
class ApiError extends Error {
  constructor(statusCode, message, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.status = statusCode.startsWith("4") ? "fail" : "error";
    this.details = details;
    this.isOperational = true;  // distinguishes from programmer errors
  }

  static badRequest(message, details)    // 400
  static unauthorized(message = "Unauthorized")           // 401
  static forbidden(message = "Forbidden")                 // 403
  static notFound(message = "Resource not found")         // 404
  static conflict(message)                                // 409
  static internal(message = "Internal server error")      // 500
}
```

**`isOperational = true`**: Distinguishes expected errors (bad input, not found) from bugs. Not currently used by `errorHandler` but available for future use.

### 12.2 `ApiResponse.js` — Standard Response Envelope

```js
class ApiResponse {
  constructor(statusCode, data = null, message = "Success") {
    this.success = statusCode < 400;  // auto-computed
    this.message = message;
    this.data = data;
    this.statusCode = statusCode;
  }

  static success(data, message = "Success", statusCode = 200)
  static created(data, message = "Created successfully")
  static noContent(message = "No content")

  send(res) {
    return res.status(this.statusCode).json({
      success: this.success,
      message: this.message,
      data: this.data,
    });
  }
}
```

Every controller function ends with `.send(res)` — no raw `res.json()` calls anywhere.

### 12.3 `asyncHandler.js` — Async Error Wrapper

```js
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
```

Wraps async route handlers so thrown errors pass to Express's error middleware instead of causing unhandled promise rejections.

### 12.4 `logger.js` — Structured Logging

```js
const LOG_LEVELS = { debug: 0, info: 1, warn: 2, error: 3 };
const currentLevel = LOG_LEVELS[process.env.LOG_LEVEL] ?? LOG_LEVELS.info;

logger.info("message", { optional: "metadata" });
// [2026-07-04T10:30:00.000Z] [INFO] message {"optional":"metadata"}
```

- Console-based output only (no log files, no rotation)
- Optional metadata appended as JSON
- Log level controlled by `LOG_LEVEL` env var

---

## 13. Engine Layer

These files sit between services and external infrastructure. Some are real, some are placeholders.

### 13.1 `deployment.engine.js` — Pipeline Orchestrator (Placeholder)

**`deployApplication(deploymentData)`**: Logs input, returns hardcoded `{ success: true, deploymentId: crypto.randomUUID(), status: "Pending", message: "Deployment queued successfully" }`. No real work done.

**`buildImage(imageName, dockerfilePath)`**: Placeholder — returns `{ success: true, imageName, tag: "latest" }`.

**`pushImage(imageName, tag)`**: Placeholder — returns success.

**`generateDeploymentManifest(deploymentConfig)`**: **Actually generates a real K8s Deployment manifest:**
```js
{
  apiVersion: "apps/v1",
  kind: "Deployment",
  metadata: { name, labels: { app } },
  spec: {
    replicas,
    selector: { matchLabels: { app } },
    template: {
      metadata: { labels: { app } },
      spec: {
        containers: [{
          name,
          image: `${dockerImage}:${imageTag || "latest"}`,
          ports: [{ containerPort: containerPort || 80 }]
        }]
      }
    }
  }
}
```

**`generateServiceManifest(serviceConfig)`**: **Actually generates a real K8s Service manifest:**
```js
{
  apiVersion: "v1",
  kind: "Service",
  metadata: { name: `${name}-svc`, labels: { app } },
  spec: {
    selector: { app },
    ports: [{ protocol: "TCP", port: 80, targetPort: containerPort || 80 }],
    type: "ClusterIP"
  }
}
```

**`deployToKubernetes(manifest, svcManifest)`**: Placeholder — logs + returns success.

**`scaleDeployment(name, replicas)`**: Placeholder — logs + returns success.

**`restartDeployment(name)`**: Placeholder.

**`rollbackDeployment(name, revision)`**: Placeholder.

**`deleteDeploymentFromK8s(name)`**: Placeholder.

**Missing from manifests**: Resource requests/limits, liveness/readiness probes, env vars, ConfigMap/Secret mounts, affinity rules, volume mounts.

### 13.2 `docker.engine.js` — Docker CLI Wrapper (REAL)

**`runCmd(cmd)`**: Helper that runs shell commands via `child_process.execSync`:
```js
const runCmd = (cmd) => {
  try {
    const output = execSync(cmd, { encoding: "utf8", stdio: "pipe" });
    return { success: true, output: output.trim() };
  } catch (error) {
    return { success: false, error: error.stderr?.trim() || error.message };
  }
};
```

| Function | Docker Command | Return Value |
|----------|---------------|--------------|
| `buildImage(name, path, tag)` | `docker build -t name:tag path` | `{ success, output, image }` |
| `tagImage(source, target)` | `docker tag source target` | `{ success, output, source, target }` |
| `pushImage(name, tag)` | `docker push name:tag` | `{ success, output, image }` |
| `pullImage(name, tag)` | `docker pull name:tag` | `{ success, output, image }` |
| `deleteImage(name, tag)` | `docker rmi name:tag` | `{ success, output, image }` |
| `listImages()` | `docker images --format "repo:tag\|id\|size"` | `{ success, images: [{ repository, tag, id, size }] }` |

**Design decisions**:
- Uses `execSync` (synchronous) — blocks the event loop. For `buildImage` this could take minutes. A production version would use `dockerode` (Docker SDK) with async/streaming.
- `listImages()` parses the `|`-delimited output — could break on unusual image name characters.
- No Docker SDK wrapper — everything goes through shell commands.

### 13.3 `k8s.engine.js` — Kubernetes Client (REAL)

**Initialization**:
```js
const kc = new k8s.KubeConfig();
kc.loadFromDefault();  // reads ~/.kube/config
const coreApi = kc.makeApiClient(k8s.CoreV1Api);    // Pods, Services
const appsApi = kc.makeApiClient(k8s.AppsV1Api);     // Deployments
```

**`loadFromDefault()`**: Reads from `~/.kube/config` or `KUBECONFIG` env var. Works with Docker Desktop's built-in Kubernetes.

| Function | K8s API Call | Returns |
|----------|-------------|---------|
| `listPods(namespace)` | `coreApi.listNamespacedPod()` | `{ pods: [{ name, namespace, status, node, containers, createdAt }] }` |
| `listDeployments(namespace)` | `appsApi.listNamespacedDeployment()` | `{ deployments: [{ name, replicas, availableReplicas, strategy }] }` |
| `listServices(namespace)` | `coreApi.listNamespacedService()` | `{ services: [{ name, type, clusterIP, ports }] }` |
| `createDeployment(manifest)` | `appsApi.createNamespacedDeployment()` | `{ name, namespace, status: "Created" }` |
| `deleteDeployment(name, ns)` | `appsApi.deleteNamespacedDeployment()` | `{ name, namespace, status: "Deleted" }` |
| `scaleDeployment(name, replicas, ns)` | `appsApi.patchNamespacedDeploymentScale()` | `{ name, replicas, status: "Scaled" }` |

All functions wrap K8s calls in try/catch and return `{ success: false, error: message }` on failure.

### 13.4 `floci.engine.js` — AWS-Compatible Stubs (ALL Placeholder)

Every function returns `{ success: true }` with empty/mock data:

- S3: `listBuckets()` → `{ buckets: [] }`, `createBucket(name)` → `{ bucket: name }`, `listObjects(name)` → `{ objects: [] }`
- Lambda: `listFunctions()` → `{ functions: [] }`, `invokeFunction(name, payload)` → `{ result: null }`
- IAM: `listUsers()` → `{ users: [] }`, `createUser(name)` → `{ username }`
- SNS: `listTopics()` → `{ topics: [] }`, `publishToTopic(arn, msg)` → `{ messageId: randomUUID() }`
- SQS: `listQueues()` → `{ queues: [] }`, `sendMessage(url, body)` → `{ messageId: randomUUID() }`

The REST APIs work structurally (return HTTP 200 with valid JSON), but no actual services run behind them.

---

## 14. Complete Request Lifecycle

### Example: `POST /api/deployments`

```
HTTP POST /api/deployments
Body: { applicationName: "my-app", dockerImage: "nginx", containerPort: 8080 }
    │
    ▼
1. Express receives the request
    │
    ▼
2. helmet() — adds security headers (X-XSS-Protection, X-Content-Type-Options, HSTS)
    │
    ▼
3. compression() — checks if client accepts gzip
    │
    ▼
4. cors() — adds Access-Control-Allow-Origin: *
    │
    ▼
5. express.json({ limit: "10mb" }) — parses JSON body into req.body
      If JSON invalid or >10MB → 400 error
    │
    ▼
6. morgan("combined") — logs: "POST /api/deployments 200 12.345ms - 2"
    │
    ▼
7. apiLimiter — checks rate limit (100 req/15min)
      If exceeded → 429 Too Many Requests
    │
    ▼
8. App mounts "/api" → routes/index.js → matches "/deployments"
    │
    ▼
9. deploymentLimiter — checks stricter rate limit (50 req/60min)
    │
    ▼
10. validate(createDeploymentRules) — checks fields:
      ├── applicationName: required, string, 2-100 chars ✓
      ├── dockerImage: required, string, min 2 chars ✓
      ├── containerPort: required, number, 1-65535 ✓
      └── If any fail → 400 Bad Request
    │
    ▼
11. createDeployment controller — extracts req.body
    │
    ▼
12. createDeploymentService(deploymentData) — service layer
      ├── (a) Manual check: applicationName, dockerImage, containerPort truthy
      ├── (b) DeploymentHistory.create({ ...data, status: "Pending" })
      │       Saves to MongoDB → returns document
      ├── (c) deployApplication(deployment) — deployment.engine.js
      │       Logs + returns hardcoded { success: true, deploymentId, status: "Pending" }
      └── (d) Returns { deploymentId: doc._id, engine: engineResponse }
    │
    ▼
13. new ApiResponse(201, result, "Deployment created successfully").send(res)
      Sends HTTP 201:
      {
        success: true,
        message: "Deployment created successfully",
        data: {
          deploymentId: "664c...",
          engine: { success: true, status: "Pending", ... }
        }
      }
    │
    ▼
HTTP 201 Created — response sent to client
```

### Error Flow (if MongoDB is down)

```
Step 12b fails (Mongoose connection refused → throws error)
    │
    ▼
asyncHandler catches the rejected promise
    │
    ▼
Express checks error middleware → calls next(error)
    │
    ▼
Skips all remaining middleware (notFound, etc.)
    │
    ▼
errorHandler receives the error
    ├── Determines: Mongoose Error (not ValidationError, CastError, or 11000)
    ├── Not an ApiError instance
    └── Falls through to "Unknown error" → 500
    │
    ▼
Response: { success: false, message: "Internal server error" }
```

---

*End of Section 1 — Backend Complete Technical Handover*
