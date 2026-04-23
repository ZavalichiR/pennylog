# ── build stage ───────────────────────────────────────────────────────────────
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json tsconfig.node.json vite.config.ts ./
COPY index.html ./
COPY src ./src
RUN npm run build

# ── serve stage ───────────────────────────────────────────────────────────────
FROM nginx:1.27-alpine AS runtime

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Raise the error log threshold so [notice] startup lines are suppressed
RUN sed -i 's/error_log .*/error_log \/dev\/stderr warn;/' /etc/nginx/nginx.conf

EXPOSE 80

# Print a single startup line then hand off to nginx
CMD ["sh", "-c", "printf 'PennyLog frontend → http://localhost:8080\\n' && exec nginx -g 'daemon off;'"]
