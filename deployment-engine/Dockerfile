# ==========================================
# CloudDeploy Local — Deployment Engine Dockerfile
# ==========================================

# ─── Stage 1: Dependencies ──────────────────
FROM node:22-alpine AS deps

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm ci --only=production --ignore-scripts

# ─── Stage 2: Build (if applicable) ─────────
FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json* ./
COPY manifests/manifestStore.service.js ./manifests/manifestStore.service.js
COPY src ./src

# ─── Stage 3: Production ────────────────────
FROM node:22-alpine AS runner

WORKDIR /app

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 appuser

# Need Docker CLI for docker build/push operations
RUN apk add --no-cache docker-cli docker-cli-compose

# Need kubectl for Kubernetes operations
RUN apk add --no-cache curl && \
    curl -LO "https://dl.k8s.io/release/v1.32.0/bin/linux/amd64/kubectl" && \
    chmod +x kubectl && \
    mv kubectl /usr/local/bin/kubectl

COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app ./

RUN mkdir -p /app/workspace /app/manifests && \
    chown -R appuser:nodejs /app/workspace /app/manifests

USER appuser

EXPOSE 6000

ENV NODE_ENV=production

CMD ["node", "src/server.js"]
