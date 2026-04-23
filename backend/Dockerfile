# ── deps stage: install & build ──────────────────────────────────────────────
FROM node:20-alpine AS build

# native addon build tools (needed by better-sqlite3 on musl/Alpine)
RUN apk add --no-cache python3 make g++

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# ── runtime stage ─────────────────────────────────────────────────────────────
FROM node:20-alpine AS runtime

RUN apk add --no-cache python3 make g++

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=build /app/dist ./dist

# Data directory for the SQLite file (mount a volume here)
RUN mkdir -p /app/data

ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=3001 \
    DB_PATH=/app/data/pennylog.db

EXPOSE 3001

HEALTHCHECK --interval=10s --timeout=5s --retries=3 \
  CMD wget -qO- http://localhost:3001/api/health || exit 1

CMD ["node", "dist/index.js"]
