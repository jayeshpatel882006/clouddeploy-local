# ==========================================
# CloudDeploy Local — Backend Dockerfile
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
COPY src ./src

# ─── Stage 3: Production ────────────────────
FROM node:22-alpine AS runner

WORKDIR /app

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 appuser

COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app ./

USER appuser

EXPOSE 5001

ENV NODE_ENV=production

CMD ["node", "src/server.js"]
