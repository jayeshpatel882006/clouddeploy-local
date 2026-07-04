# CloudDeploy Local — Complete Technical Handover

> **Project:** CloudDeploy Local
> **Audience:** Senior Engineer joining the project
> **Date:** July 4, 2026

---

## Table of Contents

- **Section 1:** [Backend Architecture](#section-1-backend-architecture)
- **Section 2:** [Deployment Engine Architecture](#section-2-deployment-engine-architecture)
- **Section 3:** [Sequence Diagrams & API Flows](#section-3-sequence-diagrams--api-flows)
- **Section 4:** [Architecture Review & Improvements](#section-4-architecture-review--improvements)

---

# Section 1: Backend Architecture

## 1.1 Directory Overview

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
│   │   ├── dashboard.routes.js
│   │   ├── deployment.routes.js
│   │   ├── registry.routes.js
│   │   ├── monitoring.routes.js
│   │   ├── logging.routes.js
│   │   └── floci.routes.js
│   ├── controllers/           # 7 files — thin request handlers
│   ├── services/              # 6 files — business logic
│   ├── models/                # 4 Mongoose schemas
│   ├── middleware/             # 5 middleware files
│   ├── utils/                 # 4 utility modules
│   └── engine/                # 4 infrastructure integration files
├── docs/API_REFERENCE.md
├── bruno/                     # Bruno API collections
└── postman/                   # Postman collection
```

## 1.2 `server.js` — Entry Point

**Why it exists**: Process entry point. Orchestrates startup sequence: load env → validate → connect MongoDB → start HTTP server → register signal handlers.

**Execution flow**:
```
server.js
  ├── dotenv.config()
  ├── validateEnvironment() — checks MONGODB_URI and JWT_SECRET
  │     ├── production: process.exit(1) if missing
  │     └── development: warn but continue
  ├── await connectDB() — from config/database.js
  ├── app.listen(PORT) — starts on port 5000 (or PORT env var)
  └── Register handlers:
        ├── SIGTERM → shutdown("SIGTERM")
        ├── SIGINT  → shutdown("SIGINT")
        ├── uncaughtException → log + exit(1)
        └── unhandledRejection → log + exit(1)
```

**`shutdown(signal)`**: Calls `server.close()`, force exits after 10s timeout.

**Dependencies used**: `dotenv`, `./app.js`, `./config/database.js`, `./utils/logger.js`

## 1.3 `config/database.js` — MongoDB Connection

**Why it exists**: Establishes a single Mongoose connection at startup.

```js
const connectDB = async () => {
  const connection = await mongoose.connect(process.env.MONGODB_URI);
  console.log(`✅ MongoDB Connected: ${connection.connection.host}`);
};
```

On failure: logs error and `process.exit(1)`. No retry logic. No connection options passed.

## 1.4 `app.js` — Express Application Factory

**Why it exists**: Creates and configures the Express app. Does NOT start the server — this separation enables testing without binding a port.

### Middleware Stack (order matters)

```
1. helmet()              → Security headers (XSS, CSP, HSTS)
2. compression()         → Gzip response bodies
3. cors()                → CORS headers (all origins)
4. express.json()        → Parse JSON bodies (limit: 10MB)
5. morgan("combined")    → HTTP request logging
6. apiLimiter            → Rate limit: 100 req / 15 min on /api/*
7. Swagger UI            → Serves /api/docs + /api/docs.json
8. Routes (/api)         → All business routes
9. notFound              → 404 handler
10. errorHandler         → Global error handler
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
  security: [{ bearerAuth: [] }]  // default: all endpoints require auth
};
```

**Windows workaround**: `swagger-jsdoc` globs don't work on Windows, so route/model files are enumerated explicitly with `fs.readdirSync()`.

### System Endpoints

**`GET /health`** — Not under /api. Returns `200 { success: true, message: "CloudDeploy API is running", data: null }`.

**`GET /ready`** — Dynamically imports mongoose to check `connection.readyState`. Returns 200 if connected (state=1), 503 otherwise.

### Route Mounting
```js
app.use("/api", routes);       // → routes/index.js
app.use(notFound);             // 404
app.use(errorHandler);         // error handling
```

## 1.5 `routes/index.js` — Route Aggregator

Mounts all sub-routers:
```js
router.use("/dashboard", dashboardRoutes);    // → /api/dashboard
router.use("/deployments", deploymentRoutes);  // → /api/deployments
router.use("/auth", authRoutes);              // → /api/auth
router.use("/registry", registryRoutes);      // → /api/registry
router.use("/monitoring", monitoringRoutes);  // → /api/monitoring
router.use("/logs", loggingRoutes);           // → /api/logs
router.use("/floci", flociRoutes);            // → /api/floci
```

Child routes use relative paths (e.g., `router.get("/")`). Prefixes are set here.

## 1.6 Route Files — Complete Endpoint Reference

### Auth Routes (`auth.routes.js`)

| Method | Path | Middleware | Controller | Auth Required |
|--------|------|-----------|------------|-------|
| POST | `/api/auth/register` | `authLimiter` (10/15min) | `register` | No |
| POST | `/api/auth/login` | `authLimiter` (10/15min) | `login` | No |
| POST | `/api/auth/refresh` | `authLimiter` + `authenticate` | `refresh` | Yes |
| GET | `/api/auth/me` | `authenticate` | `me` | Yes |

Register and login have NO authenticate middleware (circular dependency — you need credentials before a token). authLimiter protects against brute force.

### Dashboard Routes (`dashboard.routes.js`)

| Method | Path | Middleware | Controller |
|--------|------|-----------|------------|
| GET | `/api/dashboard` | none | `getDashboard` |

No auth. No rate limiting beyond the global apiLimiter. Returns mock data.

### Deployment Routes (`deployment.routes.js`)

| Method | Path | Middleware | Controller |
|--------|------|-----------|------------|
| POST | `/api/deployments` | `deploymentLimiter` + `validate(createRules)` | `createDeployment` |
| GET | `/api/deployments` | none | `getDeployments` |
| GET | `/api/deployments/:id` | none | `getDeploymentById` |
| PUT | `/api/deployments/:id` | `deploymentLimiter` + `validate(updateRules)` | `updateDeployment` |
| DELETE | `/api/deployments/:id` | none | `deleteDeployment` |

**Validation rules** defined in-file:
- Create: `applicationName` (req, string, 2-100), `dockerImage` (req, string, 2+), `containerPort` (req, number, 1-65535), optional: namespace, imageTag, replicas (1-100), deployedBy, commitSha, deploymentMessage
- Update: all fields optional, adds `status` enum (Pending/Running/Updating/Failed/Stopped/Deleted)
- **No authentication** on any deployment endpoint — notable gap

### Registry Routes (`registry.routes.js`)

| Method | Path | Middleware | Controller |
|--------|------|-----------|------------|
| GET | `/api/registry` | `authenticate` | `listImages` |
| GET | `/api/registry/sync` | `authenticate` | `syncImages` |
| GET | `/api/registry/:name/tags` | `authenticate` | `getTags` |
| DELETE | `/api/registry/:id` | `authenticate` | `deleteImage` |

All require JWT. No role-based authorization beyond authentication.

### Monitoring Routes (`monitoring.routes.js`)

| Method | Path | Middleware | Controller |
|--------|------|-----------|------------|
| GET | `/api/monitoring` | `authenticate` | `getMetricsHandler` |
| GET | `/api/monitoring/summary` | `authenticate` | `getSummary` |

Query params: `source`, `metricName`, `startDate`, `endDate`, `limit`. All require auth.

### Logging Routes (`logging.routes.js`)

| Method | Path | Middleware | Controller |
|--------|------|-----------|------------|
| GET | `/api/logs` | `authenticate` | `getLogs` |

Query params: `level`, `source`, `search`, `startDate`, `endDate`, `page`, `limit`. Requires auth.

**Known bug**: Logging service queries for `source: "loki"` but the Metric model's `source` enum only allows `["prometheus","grafana","node_exporter","cadvisor"]`.

### Floci Routes (`floci.routes.js`)

All routes have `router.use(authenticate)` at the router level.

| Method | Path | Extra Middleware | Description |
|--------|------|-----------------|-------------|
| GET | `/api/floci/s3/buckets` | — | List buckets |
| POST | `/api/floci/s3/buckets` | `authorize("admin")` | Create bucket |
| GET | `/api/floci/s3/buckets/:name/objects` | — | List objects |
| GET | `/api/floci/lambda/functions` | — | List functions |
| POST | `/api/floci/lambda/functions/:name/invoke` | — | Invoke function |
| GET | `/api/floci/iam/users` | — | List IAM users |
| POST | `/api/floci/iam/users` | `authorize("admin")` | Create IAM user |
| GET | `/api/floci/sns/topics` | — | List SNS topics |
| POST | `/api/floci/sns/publish` | — | Publish message |
| GET | `/api/floci/sqs/queues` | — | List queues |
| POST | `/api/floci/sqs/send` | — | Send message |

Admin-only: create S3 bucket, create IAM user. All controllers call `floci.engine.js` which returns placeholder data.

### Total: 30 endpoints

## 1.7 Controllers — Thin Request Handlers

### Pattern
Every controller function follows:
```js
const handler = asyncHandler(async (req, res) => {
  const result = await someService(someData);
  return new ApiResponse(statusCode, result, "message").send(res);
});
```

**Input sources**: `req.body` (POST/PUT), `req.query` (GET), `req.params` (/:id), `req.user` (auth middleware)
**Output**: Always `ApiResponse.send(res)` — never raw `res.json()`

### Controller Inventory

| File | Functions | Status Codes |
|------|-----------|-------------|
| `auth.controller.js` | register, login, refresh, me | 201, 200, 200, 200 |
| `dashboard.controller.js` | getDashboard | 200 |
| `deployment.controller.js` | createDeployment, getDeployments, getDeploymentById, updateDeployment, deleteDeployment | 201, 200 |
| `registry.controller.js` | listImages, getTags, deleteImage, syncImages | 200 |
| `monitoring.controller.js` | getMetricsHandler, getSummary | 200 |
| `logging.controller.js` | getLogs | 200 |
| `floci.controller.js` | getBuckets, addBucket, getObjects, getFunctions, runFunction, getUsers, addUser, getTopics, publishMessage, getQueues, postMessage | 200, 201 |

## 1.8 Services — Business Logic Layer

### `auth.service.js` — Authentication Logic

**`registerUser({ email, password, name })`**:
1. Checks for existing email → 409 Conflict
2. Hashes password with bcrypt (salt rounds: 12, intentionally slow ~300ms)
3. Creates User with role: "user"
4. Generates JWT: `jwt.sign({ id, email, role }, JWT_SECRET, { expiresIn: "7d" })`
5. Returns `{ token, user: { id, email, name, role } }`

**`loginUser({ email, password })`**:
1. Finds user by email with `.select("+password")`
2. Compares password with bcrypt
3. Both "not found" and "wrong password" → `"Invalid email or password"` (prevents user enumeration)
4. Returns `{ token, user }`

**`refreshToken(userId)`**: Finds user, generates new JWT. **No token invalidation** — old token remains valid until expiry.

**`getCurrentUser(userId)`**: `findById(userId).lean()` — returns full user document.

### `dashboard.service.js` — Mock Data

**`getDashboardOverview()`**: Returns hardcoded object:
```js
{ applications: 8, runningPods: 24, clusterStatus: "Healthy", cpuUsage: "32%", memoryUsage: "46%", deployments: [...] }
```

No database or infrastructure calls.

### `deployment.service.js` — Full CRUD + Engine Trigger

**`createDeploymentService(data)`**:
1. Manual required-field check for applicationName, dockerImage, containerPort
2. `DeploymentHistory.create({ ...data, status: "Pending" })`
3. `deployApplication(deployment)` from deployment.engine.js
4. Returns `{ deploymentId, engine: engineResponse }`
5. **Gap**: No error handling around the engine call. If engine throws, DB record is already saved with status "Pending" with no cleanup.

**`getDeploymentsService(query)`**:
1. Builds MongoDB filter: `status`, `namespace`, `search` (regex on applicationName)
2. Pagination: `page` (min 1), `limit` (max 100)
3. Sorting: `sortBy` (default "createdAt"), `sortOrder` (asc/desc)
4. Parallel `find()` + `countDocuments()` via Promise.all
5. Returns `{ deployments, pagination }`

**`getDeploymentByIdService(id)`**: `findById(id).lean()` → 404 if not found

**`updateDeploymentService(id, data)`**: `findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true })`

**`deleteDeploymentService(id)`**: `findByIdAndDelete(id)` → 404 if not found → returns `{ id, status: "Deleted" }`

### `registry.service.js` — Image Registry

**`listRegistryImages(query)`**: Paginated, optional `search` regex on name, sorted by `updatedAt` desc

**`getImageTags(name)`**: All documents matching name, sorted by `updatedAt` desc

**`deleteRegistryImage(id)`**: `findByIdAndDelete` → 404 if not found

**`syncRegistryFromDocker()`**:
1. Calls `docker.engine.listImages()` (runs `docker images --format`)
2. If Docker fails → 500 Internal
3. Upserts each image into MongoDB via `findOneAndUpdate` with `upsert: true`
4. Uses compound unique index on `(name, tag)`
5. Returns `{ synced: count }`

### `monitoring.service.js` — Metric Queries

**`getMetrics(query)`**: Filters by `source`, `metricName`, date range. Paginated (max 200). Sorted by `timestamp` desc.

**`getMetricSummary()`**: For each distinct `source`, counts documents + finds latest timestamp.

### `logging.service.js` — Log Queries

**`listLogs(query)`**: Same pattern, but hardcodes `{ source: "loki" }` filter.
- **Bug**: "loki" is not in the Metric model's source enum

## 1.9 Models — Mongoose Schemas

### `User.js`

| Field | Type | Constraints |
|-------|------|-------------|
| email | String | **required**, **unique**, lowercase, trim |
| password | String | **required**, **select: false** (never returned by default), minlength: 8 |
| name | String | **required**, trim |
| role | String | enum: ["user", "admin", "viewer"], default: "user" |
| isActive | Boolean | default: true |
| timestamps | auto | createdAt, updatedAt |

**`select: false`** on password: Most critical security feature. Use `.select("+password")` to explicitly include it.

### `DeploymentHistory.js`

| Field | Type | Constraints |
|-------|------|-------------|
| applicationName | String | **required**, trim |
| namespace | String | default: "default" |
| dockerImage | String | **required** |
| imageTag | String | default: "latest" |
| replicas | Number | default: 1 |
| containerPort | Number | **required** |
| status | String | enum: [Pending,Running,Updating,Failed,Stopped,Deleted], default: "Pending" |
| deployedBy | String | default: "system" (String, NOT a User reference) |
| commitSha | String | default: "" |
| deploymentMessage | String | default: "" |
| timestamps | auto | |

**`deployedBy` is a String** — no relationship to the User collection.

### `Metric.js`

| Field | Type | Constraints |
|-------|------|-------------|
| source | String | enum: [prometheus, grafana, node_exporter, cadvisor], **required** |
| metricName | String | **required** |
| value | Mixed | **required** — can be any type |
| labels | Map of String | default: {} |
| timestamp | Date | default: Date.now |
| timestamps | auto | |

**Index**: `{ source: 1, metricName: 1, timestamp: -1 }`
**Potential bug**: "loki" is not in the source enum but logging service queries for it.

### `RegistryImage.js`

| Field | Type | Constraints |
|-------|------|-------------|
| name | String | **required**, trim |
| tag | String | default: "latest" |
| digest | String | default: "" |
| size | String | default: "" (human-readable, e.g. "187MB") |
| registry | String | default: "localhost:5000" |
| pulledAt | Date | default: Date.now |
| timestamps | auto | |

**Index**: `{ name: 1, tag: 1 }` — unique compound index.

## 1.10 Middleware

### `auth.js` — Authentication & Authorization

**`authenticate` middleware**:
1. Reads `Authorization` header
2. Checks it starts with `"Bearer "`
3. Extracts token, verifies with `jwt.verify(token, JWT_SECRET)`
4. Looks up user by `decoded.id` in MongoDB
5. Checks `user.isActive` — inactive users rejected
6. Attaches full user document to `req.user`

Error handling: JWT errors → `ApiError.unauthorized()`. Catches `JsonWebTokenError` and `TokenExpiredError` specifically.

**`authorize(...roles)` middleware** (factory):
```js
const authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return next(ApiError.forbidden("Insufficient permissions"));
  }
  next();
};
```

### `errorHandler.js` — Global Error Handler

Error type check order:
1. Mongoose `ValidationError` → 400 with error array
2. Mongoose duplicate key (`code: 11000`) → 409 with field name
3. Mongoose `CastError` → 400 with invalid path/value
4. `ApiError` instance → uses `err.statusCode` and `err.message`
5. Unknown → 500 (generic in production, full message + stack in development)

### `notFound.js` — 404 Handler

```js
res.status(404).json({
  success: false,
  message: `Route not found: ${req.method} ${req.originalUrl}`
});
```

### `rateLimiter.js` — Rate Limiters

| Limiter | Window | Max | Applied To |
|---------|--------|-----|------------|
| `apiLimiter` | 15 min | 100 | All /api/* routes (global) |
| `authLimiter` | 15 min | 10 | Auth endpoints |
| `deploymentLimiter` | 60 min | 50 | Deployment create + update |

### `validate.js` — Custom Validation Middleware

Accepts a `rules` object `{ field: { required, type, minLength, maxLength, min, max, enum, message } }`. Returns middleware that checks each field and passes errors to `next(ApiError.badRequest(...))`.

**Limitations**: Only `req.body`, no nested objects, no cross-field validation, no custom validators.

## 1.11 Utilities

### `ApiError.js`

```js
class ApiError extends Error {
  constructor(statusCode, message, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.status = statusCode.startsWith("4") ? "fail" : "error";
    this.details = details;
    this.isOperational = true;
  }
  static badRequest(message, details)       // 400
  static unauthorized(message = "Unauthorized")         // 401
  static forbidden(message = "Forbidden")               // 403
  static notFound(message = "Resource not found")        // 404
  static conflict(message)                              // 409
  static internal(message = "Internal server error")    // 500
}
```

### `ApiResponse.js`

```js
class ApiResponse {
  constructor(statusCode, data = null, message = "Success") {
    this.success = statusCode < 400;
    this.message = message;
    this.data = data;
    this.statusCode = statusCode;
  }
  static success(data, message, statusCode = 200)
  static created(data, message = "Created successfully")
  static noContent(message = "No content")
  send(res) { res.status(this.statusCode).json({ success, message, data }) }
}
```

### `asyncHandler.js`

```js
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
```

### `logger.js`

Log levels: `debug: 0, info: 1, warn: 2, error: 3`. Controlled by `LOG_LEVEL` env var. Output format: `[ISO timestamp] [LEVEL] message {"optional":"meta"}`. Console-based only.

## 1.12 Engine Layer

### `deployment.engine.js` — Orchestrator (Mostly Placeholder)

| Function | Current Behavior | Future |
|----------|-----------------|--------|
| `deployApplication(data)` | Logs + returns hardcoded `{ success: true, deploymentId: crypto.randomUUID(), status: "Pending" }` | Full pipeline |
| `buildImage(name, path)` | Placeholder | Docker build |
| `pushImage(name, tag)` | Placeholder | Docker push |
| `generateDeploymentManifest(config)` | **REAL** — generates valid K8s Deployment manifest | Same |
| `generateServiceManifest(config)` | **REAL** — generates valid K8s Service manifest (ClusterIP) | Same |
| `deployToKubernetes` | Placeholder | K8s apply |
| `scaleDeployment` | Placeholder | K8s scale |
| `restartDeployment` | Placeholder | K8s rollout restart |
| `rollbackDeployment` | Placeholder | K8s rollout undo |
| `deleteDeploymentFromK8s` | Placeholder | K8s delete |

**Generated manifests**:

Deployment: `apps/v1`, name/labels from applicationName, replicas, selector, single container with image `dockerImage:imageTag`, ports `containerPort`.

Service: `v1`, name `${name}-svc`, ClusterIP type, TCP port 80 → targetPort `containerPort`.

**Missing from manifests**: Resource requests/limits, liveness/readiness probes, env vars, ConfigMap/Secret mounts, affinity, volumes.

### `docker.engine.js` — Docker CLI Wrapper (REAL)

Uses `child_process.execSync` (synchronous — blocks event loop!):

| Function | Docker Command |
|----------|---------------|
| `buildImage(name, path, tag)` | `docker build -t name:tag path` |
| `tagImage(source, target)` | `docker tag source target` |
| `pushImage(name, tag)` | `docker push name:tag` |
| `pullImage(name, tag)` | `docker pull name:tag` |
| `deleteImage(name, tag)` | `docker rmi name:tag` |
| `listImages()` | `docker images --format "repo:tag\|id\|size"` (parses output) |

**Concerns**: Synchronous exec blocks Node.js event loop. For `buildImage` this could be minutes. Production should use Docker SDK (`dockerode`).

### `k8s.engine.js` — Kubernetes Client (REAL)

```js
const kc = new k8s.KubeConfig();
kc.loadFromDefault();  // reads ~/.kube/config
const coreApi = kc.makeApiClient(k8s.CoreV1Api);    // Pods, Services
const appsApi = kc.makeApiClient(k8s.AppsV1Api);     // Deployments
```

| Function | K8s API Call |
|----------|-------------|
| `listPods(namespace)` | `coreApi.listNamespacedPod()` |
| `listDeployments(namespace)` | `appsApi.listNamespacedDeployment()` |
| `listServices(namespace)` | `coreApi.listNamespacedService()` |
| `createDeployment(manifest)` | `appsApi.createNamespacedDeployment()` |
| `deleteDeployment(name, ns)` | `appsApi.deleteNamespacedDeployment()` |
| `scaleDeployment(name, replicas, ns)` | `appsApi.patchNamespacedDeploymentScale()` |

All wrap calls in try/catch → `{ success: false, error: message }` on failure.

### `floci.engine.js` — AWS-Compatible Stubs (ALL Placeholder)

Every function returns `{ success: true }` with empty/mock data:
- S3: empty arrays, `{ bucket: name }`
- Lambda: empty array, `{ result: null }`
- IAM: empty array, `{ username }`
- SNS: empty array, `{ messageId: randomUUID() }`
- SQS: empty array, `{ messageId: randomUUID() }`

## 1.13 Complete Request Lifecycle

### Example: `POST /api/deployments`

```
HTTP POST /api/deployments { applicationName, dockerImage, containerPort }
    │
    ▼
1. helmet() — security headers
    │
    ▼
2. compression() — gzip handling
    │
    ▼
3. cors() — CORS headers
    │
    ▼
4. express.json() — parse body (10MB limit)
    │
    ▼
5. morgan("combined") — log request
    │
    ▼
6. apiLimiter — 100 req/15min check
    │
    ▼
7. routes/index.js → matches /deployments
    │
    ▼
8. deploymentLimiter — 50 req/60min check
    │
    ▼
9. validate(createDeploymentRules) — field validation
    │
    ▼
10. createDeployment controller
    │
    ▼
11. createDeploymentService(data):
      ├── DeploymentHistory.create({ ...status: "Pending" })
      ├── deployApplication(deployment) → hardcoded response
      └── returns { deploymentId, engine: {...} }
    │
    ▼
12. ApiResponse(201, result).send(res)
    │
    ▼
HTTP 201 { success: true, message, data }
```

### Error Flow

```
Step 11 fails (MongoDB down, validation error, etc.)
    │
    ▼
asyncHandler catches the rejected promise
    │
    ▼
next(error) → Express error middleware
    │
    ▼
errorHandler determines error type:
    ├── ValidationError → 400
    ├── DuplicateKey → 409
    ├── CastError → 400
    ├── ApiError → uses statusCode
    └── Unknown → 500
    │
    ▼
HTTP response with appropriate status code + error message
```

---

# Section 2: Deployment Engine Architecture

## 2.1 Directory Overview

```
deployment-engine/
├── package.json
├── src/
│   ├── server.js                        # Entry point (port 6000)
│   ├── app.js                           # Express app factory
│   ├── routes/
│   │   └── deployment.routes.js         # POST /deploy
│   ├── controllers/
│   │   └── deployment.controller.js     # Thin handler
│   ├── services/
│   │   └── deployment.service.js        # Manifest gen + K8s create
│   ├── kubernetes/
│   │   ├── client.js                    # K8s API client init
│   │   ├── deployment.js                # createNamespacedDeployment
│   │   └── service.js                   # createNamespacedService
│   ├── manifests/
│   │   ├── deployment.manifest.js       # K8s Deployment YAML gen
│   │   └── service.manifest.js          # K8s Service YAML gen
│   └── pipeline/                        # Pipeline architecture
│       ├── PipelineContext.js            # Shared state
│       ├── PipelineRunner.js             # Sequential executor
│       ├── core/
│       │   └── BaseStep.js              # Abstract base class
│       ├── steps/                       # 9 pipeline steps
│       │   ├── ValidateStep.js
│       │   ├── PrepareWorkspaceStep.js
│       │   ├── BuildImageStep.js
│       │   ├── PushRegistryStep.js
│       │   ├── GenerateManifestStep.js
│       │   ├── DeployKubernetesStep.js
│       │   ├── WaitForReadyStep.js
│       │   ├── UpdateDatabaseStep.js
│       │   └── CleanupStep.js
│       ├── drivers/                     # 3 infrastructure drivers
│       │   ├── DockerDriver.js
│       │   ├── KubernetesDriver.js
│       │   └── RegistryDriver.js
│       └── events/
│           └── PipelineEvents.js        # Event constants
```

## 2.2 `server.js` — Entry Point

**Why it exists**: Starts the deployment-engine microservice on port 6000.

```js
dotenv.config();
const PORT = process.env.PORT || 6000;
app.listen(PORT, () => { console.log(`🚀 Deployment Engine Started on port ${PORT}`); });
```

No graceful shutdown, no MongoDB connection, no environment validation. This is a simpler, more focused microservice.

**Dependencies**: `dotenv`, `./app.js`

## 2.3 `app.js` — Express Application Factory

**Why it exists**: Creates Express app with CORS, Helmet, JSON parsing, and morgan.

```js
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (req, res) => {
  res.status(200).json({ success: true, service: "Deployment Engine", status: "Healthy" });
});

app.use("/deploy", deploymentRoutes);
```

Only two routes: `GET /health` and `POST /deploy`. No Swagger, no auth middleware, no rate limiting.

## 2.4 `routes/deployment.routes.js`

```js
router.post("/", deployApplication);
```

Single route: `POST /deploy`. No validation, no rate limiting, no auth.

## 2.5 `controllers/deployment.controller.js`

```js
const deployApplication = async (req, res) => {
  try {
    const result = await deploymentService(req.body);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
```

Manual try/catch (not using asyncHandler from the backend). Returns 500 with error message on failure.

## 2.6 `services/deployment.service.js`

**The critical service — this is where the actual K8s deployment happens.**

```js
const deploymentService = async (deployment) => {
  // 1. Generate manifests
  const deploymentManifest = generateDeploymentManifest(deployment);
  const serviceManifest = generateServiceManifest(deployment);

  // 2. Create K8s resources
  await createDeployment(deploymentManifest);
  await createService(serviceManifest);

  // 3. Return result
  return {
    success: true,
    deploymentId: uuid(),
    status: "Pending",
    deploymentManifest,
    serviceManifest,
  };
};
```

**Critical observations**:
- Does NOT check if K8s resources already exist (would fail on re-deploy)
- Does NOT handle K8s API errors (if `createDeployment` throws, `createService` never runs)
- Does NOT return meaningful status after creating resources
- `status: "Pending"` is returned even after successfully creating K8s resources

## 2.7 Kubernetes Integration

### `kubernetes/client.js`

```js
import * as k8s from "@kubernetes/client-node";
const kubeConfig = new k8s.KubeConfig();
kubeConfig.loadFromDefault();  // reads ~/.kube/config (Docker Desktop K8s)
const appsApi = kubeConfig.makeApiClient(k8s.AppsV1Api);
const coreApi = kubeConfig.makeApiClient(k8s.CoreV1Api);
export { appsApi, coreApi };
```

### `kubernetes/deployment.js`

```js
const createDeployment = async (manifest) => {
  return await appsApi.createNamespacedDeployment({
    namespace: manifest.metadata.namespace,
    body: manifest,
  });
};
```

No error handling at this layer — errors propagate up to the controller.

### `kubernetes/service.js`

```js
const createService = async (manifest) => {
  return await coreApi.createNamespacedService({
    namespace: manifest.metadata.namespace,
    body: manifest,
  });
};
```

No error handling. Would fail if service already exists.

## 2.8 Manifest Generation

### `manifests/deployment.manifest.js`

Generates a `apps/v1` Deployment:
```js
{
  apiVersion: "apps/v1",
  kind: "Deployment",
  metadata: { name: deployment.applicationName, namespace: deployment.namespace || "default", labels: { app: deployment.applicationName } },
  spec: {
    replicas: deployment.replicas,
    selector: { matchLabels: { app: deployment.applicationName } },
    template: {
      metadata: { labels: { app: deployment.applicationName } },
      spec: {
        containers: [{
          name: deployment.applicationName,
          image: deployment.dockerImage,
          ports: [{ containerPort: deployment.containerPort }]
        }]
      }
    }
  }
}
```

**Missing**: No resource requests/limits, no probes, no env vars, no volume mounts, no service account, no security context.

### `manifests/service.manifest.js`

Generates a `v1` Service:
```js
{
  apiVersion: "v1",
  kind: "Service",
  metadata: { name: deployment.applicationName, namespace: deployment.namespace || "default" },
  spec: {
    selector: { app: deployment.applicationName },
    ports: [{ protocol: "TCP", port: 80, targetPort: deployment.containerPort }],
    type: "ClusterIP"
  }
}
```

**Missing**: No LoadBalancer/NodePort type selection, no multiple ports, no port naming, no annotations.

## 2.9 Pipeline Architecture

### `pipeline/PipelineContext.js`

Shared state object flowing through every pipeline step. Created once per pipeline run.

**Fields**: deploymentId, applicationName, dockerImage, namespace, replicas, containerPort, imageTag, deployedBy, commitSha, deploymentMessage, currentStep, status (Pending|Running|Completed|Failed), progress (0-100), startedAt, completedAt, steps[], deploymentManifest, serviceManifest, imageName, metadata{}, logs[], errors[].

**Helper methods**:
- `recordStep(name, status, durationMs, error)` — Appends step result
- `log(message)` — Adds timestamped log entry
- `addError(step, message)` — Records error + logs it
- `setProgress(pct)` — Clamps 0-100
- `markStarted()` — Sets status to "Running"
- `markCompleted()` — Sets status to "Completed", progress to 100
- `markFailed(reason)` — Sets status to "Failed"
- `toJSON()` — Plain object snapshot

### `pipeline/core/BaseStep.js`

Abstract base class for all pipeline steps.

**Constructor guard**: `if (new.target === BaseStep)` prevents direct instantiation.

**Properties**: `stepName` (set by subclasses)

**Methods**:
- `execute(context)` — Abstract, must be overridden
- `logInfo(context, message)` — Log via context
- `logWarn(context, message)` — Log with ⚠ prefix
- `logError(context, message)` — Log with ✗ prefix
- `validateRequired(context, fields)` — Checks required fields exist, throws Error if missing

### `pipeline/PipelineRunner.js`

Sequential step executor. The core orchestrator.

**`constructor()`**: Initializes empty `steps[]` array and `stepWeight = 0`.

**`addStep(step)`**: Validates step is an instance of BaseStep, appends to array. Returns `this` for chaining.

**`run(context)`**:
1. Validates context is a PipelineContext instance
2. Validates at least one step is registered
3. Calculates `stepWeight = 100 / steps.length`
4. Calls `context.markStarted()`
5. Loops through each step:
   - Sets `context.currentStep`
   - Records start time
   - Calls `step.execute(context)` — **await**
   - On success: calls `context.recordStep("completed", duration)`, sets progress
   - On failure: calls `context.recordStep("failed", duration, error)`, `context.markFailed()`, **breaks loop**
6. Finalizes: `markCompleted()` or `markFailed()`
7. Returns context

**`_emit(eventName, payload)`**: Stub for future EventEmitter integration. Currently disabled (commented out console.debug).

### Pipeline Steps (9 total)

All steps follow the same pattern: construct with `super("StepName")`, implement `async execute(context)`.

| Step | What It Does Now | Future Implementation |
|------|-----------------|----------------------|
| **ValidateStep** | Checks context has applicationName, dockerImage, containerPort | Same + more validation |
| **PrepareWorkspaceStep** | Logs "Preparing workspace" | Clone repo, create temp dir |
| **BuildImageStep** | Sets `context.imageName = dockerImage:imageTag` | Call `DockerDriver.buildImage()` |
| **PushRegistryStep** | Logs "Pushing image" | Call `RegistryDriver.pushImage()` |
| **GenerateManifestStep** | Calls existing `manifest/*.js` generators | Same (already works) |
| **DeployKubernetesStep** | Checks manifest exists, logs | Call `KubernetesDriver.createDeployment()` |
| **WaitForReadyStep** | Logs "Waiting for deployment" | Poll `rolloutStatus()`, timeout |
| **UpdateDatabaseStep** | Logs "Updating database" | Call external API or DB driver |
| **CleanupStep** | Logs "Cleaning up" | Remove temp dirs, prune Docker cache |

**Notable**: `GenerateManifestStep` is the only step that calls existing code (`../../manifests/`). It's the bridge between the new pipeline and the old architecture.

### `pipeline/events/PipelineEvents.js`

```js
const PipelineEvents = Object.freeze({
  PIPELINE_STARTED: "pipeline:started",
  PIPELINE_COMPLETED: "pipeline:completed",
  PIPELINE_FAILED: "pipeline:failed",
  STEP_STARTED: "step:started",
  STEP_COMPLETED: "step:completed",
  STEP_FAILED: "step:failed",
});
```

Event constants only — no EventEmitter integration yet.

### Pipeline Drivers (3 total)

All methods throw `"Not Implemented"`. They define the future interface:

**DockerDriver**: `buildImage()`, `tagImage()`, `pullImage()`, `removeImage()`, `listImages()`

**KubernetesDriver**: `createDeployment()`, `deleteDeployment()`, `scaleDeployment()`, `createService()`, `rollbackDeployment()`, `rolloutStatus()`, `listPods()`, `getPodLogs()`

**RegistryDriver**: `pushImage()`, `pullImage()`, `listTags()`, `deleteImage()`, `imageExists()`

## 2.10 How the Deployment Engine Currently Works

### Current Architecture

```
POST /deploy (port 6000)
    │
    ▼
deployment.controller.js
    │
    ▼
deployment.service.js
    ├── generateDeploymentManifest(deployment)  →  K8s YAML object
    ├── generateServiceManifest(deployment)     →  K8s YAML object
    ├── createDeployment(manifest)              →  K8s API (AppsV1Api)
    ├── createService(manifest)                 →  K8s API (CoreV1Api)
    └── return { deploymentId, status, manifests }
```

### How It Communicates with Backend

**IT DOES NOT**. This is a critical architectural gap:
- The backend (port 5000) has its own `deployment.engine.js` with deployment orchestration logic (mostly placeholders)
- The deployment-engine (port 6000) is a separate standalone microservice
- **There is no HTTP call from the backend to the deployment-engine**
- The two codebases have duplicated K8s integration code

The deployment-engine can be started independently and called directly via `POST /deploy`, but it's not wired into the main application flow.

### Why This Architecture Was Chosen

The deployment-engine was designed as a **separate microservice** to:
1. Isolate K8s operations from the main API (failure isolation)
2. Allow independent scaling (deployments could be resource-intensive)
3. Enable the pipeline architecture without affecting existing routes
4. Separate concerns: API/auth vs infrastructure orchestration

However, the separation is incomplete — there's no service discovery or API gateway routing requests between them.

---

# Section 3: Sequence Diagrams & API Flows

## 3.1 Current Deployment Flow (Backend API Only)

```
Frontend (not wired)         Backend API (5000)          MongoDB              Docker Daemon
      │                           │                       │                     │
      │  POST /api/deployments    │                       │                     │
      │ ─────────────────────────>│                       │                     │
      │                           │                       │                     │
      │                           │  DeploymentHistory    │                     │
      │                           │  .create({Pending})   │                     │
      │                           │ ─────────────────────>│                     │
      │                           │ <───── document ──────│                     │
      │                           │                       │                     │
      │                           │  deployApplication()  │                     │
      │                           │  (deployment.engine)  │                     │
      │                           │  ─── placeholder ──── │                     │
      │                           │                       │                     │
      │ <── 201 { deploymentId } ──│                       │                     │
      │                           │                       │                     │
```

## 3.2 Current Deployment Flow (Deployment Engine Only)

```
Client (curl/Postman)      Deployment Engine (6000)        Kubernetes API
      │                           │                           │
      │  POST /deploy             │                           │
      │ ─────────────────────────>│                           │
      │                           │                           │
      │                           │  generateDeploymentMani-  │
      │                           │  fest(deployment)         │
      │                           │  ─── generates YAML ───  │
      │                           │                           │
      │                           │  generateServiceManifest  │
      │                           │  ─── generates YAML ───  │
      │                           │                           │
      │                           │  createNamespacedDeploy-  │
      │                           │  ment(manifest)           │
      │                           │ ─────────────────────────>│
      │                           │ <── Deployment created ───│
      │                           │                           │
      │                           │  createNamespacedService  │
      │                           │  (manifest)               │
      │                           │ ─────────────────────────>│
      │                           │ <── Service created ──────│
      │                           │                           │
      │ <── 200 { deploymentId } ──│                           │
      │                           │                           │
```

## 3.3 Intended Full Deployment Flow (When Pipeline Is Wired)

```
Frontend              Backend (5000)         Deployment Engine (6000)     Docker        K8s API
   │                      │                        │                      │              │
   │ POST /api/deploy     │                        │                      │              │
   │ ────────────────────>│                        │                      │              │
   │                      │                        │                      │              │
   │                      │ Save to MongoDB        │                      │              │
   │                      │ ───── Pending ────────>│                      │              │
   │                      │                        │                      │              │
   │                      │ POST /deploy           │                      │              │
   │                      │ ──────────────────────>│                      │              │
   │                      │                        │                      │              │
   │                      │    PipelineRunner.run(context)                │              │
   │                      │                        │                      │              │
   │                      │    [1] ValidateStep    │                      │              │
   │                      │    [2] PrepareWS       │                      │              │
   │                      │    [3] BuildImage      │   docker build       │              │
   │                      │                        │ ───────────────────>│              │
   │                      │                        │ <── image built ────│              │
   │                      │    [4] PushRegistry    │   docker push        │              │
   │                      │                        │ ───────────────────>│              │
   │                      │                        │ <── image pushed ───│              │
   │                      │    [5] GenerateMani-   │                      │              │
   │                      │        festStep        │                      │              │
   │                      │    [6] DeployK8s       │   createDeployment   │              │
   │                      │                        │ ──────────────────────────────────>│
   │                      │                        │ <── deployment created ────────────│
   │                      │                        │   createService                    │
   │                      │                        │ ──────────────────────────────────>│
   │                      │                        │ <── service created ───────────────│
   │                      │    [7] WaitForReady    │   rolloutStatus                    │
   │                      │                        │ ──────────────────────────────────>│
   │                      │                        │ <── ready ─────────────────────────│
   │                      │    [8] UpdateDatabase  │                      │              │
   │                      │ <── result ─────────────│                      │              │
   │                      │                        │                      │              │
   │                      │ Update MongoDB         │                      │              │
   │                      │ ───── Running ────────>│                      │              │
   │                      │                        │                      │              │
   │ <── 201 response ─────│                        │                      │              │
   │                      │                        │                      │              │
```

## 3.4 Authentication Flow

```
Client                     Backend API (5000)               MongoDB
  │                            │                              │
  │  POST /api/auth/register   │                              │
  │  { email, password, name } │                              │
  │ ──────────────────────────>│                              │
  │                            │  User.findOne({email})        │
  │                            │ ───────────────────────────>│
  │                            │ <── null (not found) ────────│
  │                            │                              │
  │                            │  bcrypt.hash(password, 12)    │
  │                            │  User.create({...})           │
  │                            │ ───────────────────────────>│
  │                            │ <── user document ────────────│
  │                            │                              │
  │                            │  jwt.sign({id, email, role})  │
  │                            │                              │
  │ <── 201 { user, token } ────│                              │
  │                            │                              │
  │  POST /api/auth/login      │                              │
  │  { email, password }       │                              │
  │ ──────────────────────────>│                              │
  │                            │  User.findOne({email})        │
  │                            │  .select("+password")         │
  │                            │ ───────────────────────────>│
  │                            │ <── user with password ───────│
  │                            │                              │
  │                            │  bcrypt.compare(password)     │
  │                            │  jwt.sign({id, email, role})  │
  │                            │                              │
  │ <── 200 { user, token } ────│                              │
  │                            │                              │
  │  GET /api/auth/me          │                              │
  │  Authorization: Bearer JWT │                              │
  │ ──────────────────────────>│                              │
  │                            │  jwt.verify(token) → {id}     │
  │                            │  User.findById(id)            │
  │                            │ ───────────────────────────>│
  │                            │ <── user document ────────────│
  │                            │                              │
  │ <── 200 { user } ──────────│                              │
  │                            │                              │
```

## 3.5 Registry Sync Flow

```
Client                     Backend API (5000)          Docker Daemon           MongoDB
  │                            │                          │                    │
  │  GET /api/registry/sync    │                          │                    │
  │  Authorization: Bearer JWT │                          │                    │
  │ ──────────────────────────>│                          │                    │
  │                            │                          │                    │
  │                            │  authenticate → verify   │                    │
  │                            │                          │                    │
  │                            │  docker.engine           │                    │
  │                            │  .listImages()           │                    │
  │                            │  execSync("docker        │                    │
  │                            │  images --format ...")   │                    │
  │                            │ ───────────────────────>│                    │
  │                            │ <── parsed image list ───│                    │
  │                            │                          │                    │
  │                            │  for each image:         │                    │
  │                            │  findOneAndUpdate(       │                    │
  │                            │    {name, tag}, $set,    │                    │
  │                            │    {upsert: true})       │                    │
  │                            │ ───────────────────────────────────────────>│
  │                            │                          │                    │
  │ <── 200 { synced: N } ─────│                          │                    │
  │                            │                          │                    │
```

## 3.6 Full API Request Map

```
Client (Port: any)
    │
    ├──► GET  /health               [No Auth]  ──► Backend (5000)
    ├──► GET  /ready                [No Auth]  ──► Backend (5000)
    ├──► GET  /api/docs             [No Auth]  ──► Backend (5000) ──► Swagger UI
    │
    ├──► POST /api/auth/register    [No Auth]  ──► Backend ──► MongoDB
    ├──► POST /api/auth/login       [No Auth]  ──► Backend ──► MongoDB
    ├──► POST /api/auth/refresh     [JWT]      ──► Backend ──► MongoDB
    ├──► GET  /api/auth/me          [JWT]      ──► Backend ──► MongoDB
    │
    ├──► GET  /api/dashboard        [No Auth]  ──► Backend ──► (mock data)
    │
    ├──► POST /api/deployments      [No Auth]  ──► Backend ──► MongoDB + Engine
    ├──► GET  /api/deployments      [No Auth]  ──► Backend ──► MongoDB
    ├──► GET  /api/deployments/:id  [No Auth]  ──► Backend ──► MongoDB
    ├──► PUT  /api/deployments/:id  [No Auth]  ──► Backend ──► MongoDB
    ├──► DELETE /api/deployments/:id[No Auth]  ──► Backend ──► MongoDB
    │
    ├──► GET  /api/registry         [JWT]      ──► Backend ──► MongoDB
    ├──► GET  /api/registry/sync    [JWT]      ──► Backend ──► Docker CLI + MongoDB
    ├──► GET  /api/registry/:name/tags [JWT]   ──► Backend ──► MongoDB
    ├──► DELETE /api/registry/:id   [JWT]      ──► Backend ──► MongoDB
    │
    ├──► GET  /api/monitoring       [JWT]      ──► Backend ──► MongoDB
    ├──► GET  /api/monitoring/summary [JWT]    ──► Backend ──► MongoDB
    │
    ├──► GET  /api/logs             [JWT]      ──► Backend ──► MongoDB
    │
    ├──► *    /api/floci/*          [JWT]      ──► Backend ──► (placeholder data)
    │
    └──► POST /deploy               [No Auth]  ──► Deployment Engine (6000) ──► K8s API
```

---

# Section 4: Architecture Review & Improvements

## 4.1 Identified Weaknesses

### Backend

| Weakness | Severity | Details |
|----------|----------|---------|
| **No auth on deployments** | HIGH | All deployment CRUD endpoints have no authentication. Anyone who can reach port 5000 can create/modify/delete deployments. |
| **No auth on dashboard** | MEDIUM | Dashboard returns data without any authentication. In production this would expose system metrics. |
| **Sync `execSync` for Docker** | HIGH | `docker.engine.js` uses `child_process.execSync` which blocks the Node.js event loop. A `docker build` taking 5+ minutes would freeze the entire API. |
| **Logging service bug** | MEDIUM | Queries for `source: "loki"` but the Metric model enum doesn't include "loki". Will never return results. |
| **No error handling in deployment service** | MEDIUM | `createDeploymentService` saves to MongoDB before calling the engine. If the engine fails, the DB record is orphaned with status "Pending". |
| **Duplicate K8s code** | MEDIUM | Both the backend (`k8s.engine.js`) and the deployment-engine (`kubernetes/`) have K8s integration code. They're not in sync and don't share logic. |
| **No deployment-engine to backend connection** | HIGH | The two services are completely disconnected. The backend calls its own placeholder engine, and the deployment-engine is a standalone service that isn't called by anything. |
| **No rate limiting on deployment-engine** | LOW | The deployment engine has no rate limiting or authentication. Anyone who can reach port 6000 can deploy to Kubernetes. |
| **No graceful shutdown in deployment-engine** | LOW | Deployment engine doesn't handle SIGTERM/SIGINT. A container stop would interrupt in-flight deployments. |

### Deployment Engine

| Weakness | Severity | Details |
|----------|----------|---------|
| **No idempotency** | HIGH | `createDeployment` and `createService` will fail if resources already exist. No check-before-create pattern. |
| **No error handling on K8s calls** | HIGH | If `createDeployment` succeeds but `createService` fails, the deployment is orphaned with no cleanup. |
| **Manifests lack production features** | MEDIUM | No resource requests/limits, no liveness/readiness probes, no env vars, no volumes, no service accounts. |
| **Pipeline not wired** | MEDIUM | The pipeline architecture exists but isn't used. `deployment.service.js` still calls the old direct K8s methods. |
| **No rollout monitoring** | MEDIUM | After creating a deployment, there's no check that pods become healthy. Returns "Pending" even after successful K8s call. |

### Frontend

| Weakness | Severity | Details |
|----------|----------|---------|
| **No API calls** | CRITICAL | The entire frontend uses hardcoded mock data. Axios is installed but never used. The UI is a static prototype. |
| **No auth UI** | HIGH | No login/register pages. No token storage. No protected routes. |
| **No loading states** | MEDIUM | Skeleton components exist but are not used anywhere. Every page renders instantly with mock data. |

### General

| Weakness | Severity | Details |
|----------|----------|---------|
| **No tests** | CRITICAL | Zero unit tests, integration tests, or E2E tests across the entire project. |
| **No Dockerfiles** | HIGH | No containers defined. The `docker-compose.yml` is empty. The project can only run via `npm run dev`. |
| **No CI/CD** | HIGH | No GitHub Actions workflows. No automated build/test/deploy pipeline. |
| **No monitoring/logging infrastructure** | HIGH | Prometheus, Grafana, Loki, Promtail are referenced but not deployed. No actual metrics or logs flow through the system. |
| **Floci is all placeholder** | HIGH | All 11 Floci endpoints return empty data. No actual S3/MinIO/Lambda/IAM/SNS/SQS services exist. |

## 4.2 Unnecessary Code / Dead Code

| File | Why It's Unnecessary |
|------|---------------------|
| `backend/src/engine/deployment.engine.js` (`buildImage`, `pushImage`, `deployToKubernetes`, `scaleDeployment`, `restartDeployment`, `rollbackDeployment`, `deleteDeploymentFromK8s`) | All are placeholders that log and return hardcoded success. They're never called by anything except `deployment.service.js` (which only calls `deployApplication` anyway). |
| `backend/src/services/dashboard.service.js` | Returns hardcoded mock data. Could be replaced by real K8s/Docker queries. |
| `dashboard/src/components/*/data.js` files | All data files (deploymentData, registryData, logsData, monitoringData, clusterData, settingsData) are pure mock data with no API calls. They'll all be replaced when the frontend is wired. |
| `pipeline/drivers/*.js` | All three drivers throw "Not Implemented" on every method. They define future interfaces but have no current functionality. |
| `dashboard/src/components/ui/Skeleton.jsx` | Exists but is never imported or used by any component. |
| `dashboard/src/components/ui/EmptyState.jsx` | Exists but is never imported or used. |

## 4.3 Coupling Issues

| Coupling | Details |
|----------|---------|
| **Logging & Monitoring share the same collection** | Both read from the `metrics` MongoDB collection, distinguished only by the `source` field. This creates a coupling between two conceptually different domains. Write operations for one could affect the other. |
| **Deployment engine and backend share @kubernetes/client-node** | Both packages include the same K8s SDK. If versions drift, behavior could differ between the two services. |
| **Backend routes defined with inline validation rules** | Validation rules for deployments are defined in the route file (deployment.routes.js), not in the model or a separate validation schema. If the model changes, the validation rules must be updated separately. |
| **Pipeline steps depend on existing manifest generators** | `GenerateManifestStep` imports from `../../manifests/`. If the manifest API changes, the step must be updated to match. |

## 4.4 Missing Abstractions

| Missing Abstraction | Impact |
|---------------------|--------|
| **Configuration service** | Environment variables are read ad-hoc with `process.env.X || "default"` scattered across files. No centralized config object or validation. |
| **Repository/DAO layer** | Services call Mongoose models directly. No abstraction between business logic and data access. Makes testing difficult (cannot mock the DB layer independently). |
| **Event bus** | The pipeline has event constants but no actual EventEmitter. No pub/sub for cross-service communication. |
| **API Gateway / Service Discovery** | No mechanism for the backend to discover or call the deployment-engine. They're two isolated servers with no connection. |
| **Authentication context** | No centralized auth context in the frontend. Token storage, refresh logic, and protected routes would need to be built from scratch. |
| **Feature flags** | No mechanism to toggle features on/off. Floci placeholders and real implementations would require code changes to swap. |

## 4.5 Recommended Improvements (Non-Breaking)

### High Priority

1. **Add JWT authentication to deployment endpoints** — Apply `authenticate` middleware to `deployment.routes.js`. Non-breaking and critical for security.

2. **Add `"loki"` to Metric source enum** — Fix the logging service bug by adding "loki" to the valid source values in `Metric.js`.

3. **Wire backend to deployment-engine** — Replace the placeholder `deployApplication()` call in `deployment.service.js` with an HTTP POST to `http://localhost:6000/deploy`. This connects the two services.

4. **Add error handling around `deployApplication`** — Wrap the engine call in try/catch in `createDeploymentService`. On failure, update the deployment status to "Failed" instead of leaving it orphaned as "Pending".

### Medium Priority

5. **Wire the PipelineRunner into deployment-engine service** — Replace the direct K8s calls in `deployment.service.js` with `PipelineRunner.run(context)`. The pipeline already has the steps defined.

6. **Implement one driver at a time** — Start with `KubernetesDriver.createDeployment()` using the existing code from `kubernetes/deployment.js`. This validates the driver interface.

7. **Add K8s idempotency** — Check if a deployment/service already exists before creating. Use patch or update-if-exists pattern.

8. **Add resource requests/limits to manifests** — The most impactful production improvement. Without these, pods can't be scheduled correctly.

### Low Priority

9. **Replace execSync with async Docker SDK** — Switch `docker.engine.js` to use `dockerode` for non-blocking Docker operations.

10. **Add centralized configuration** — Create a `config/index.js` that reads all env vars and validates them at startup.

11. **Remove dead code** — The placeholder functions in `deployment.engine.js` (buildImage, pushImage, etc.) should be removed once the pipeline is wired. The mock data files in the dashboard will be replaced when the frontend is connected.

---

*End of Complete Technical Handover — All 4 Sections*
