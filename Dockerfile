FROM node:24-bookworm-slim AS frontend
WORKDIR /build/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

FROM python:3.12-slim
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1 REQUIRE_POSTGRES=1 PORT=8000
ENV STATIC_DIST=/app/frontend/dist
WORKDIR /app/backend
COPY backend/pyproject.toml ./
COPY backend/app ./app
COPY backend/migrations ./migrations
RUN pip install --no-cache-dir . && useradd --create-home diary
COPY --from=frontend /build/frontend/dist /app/frontend/dist
COPY contracts /app/contracts
COPY deploy/start.sh /app/start.sh
RUN chmod +x /app/start.sh && chown -R diary:diary /app
USER diary
EXPOSE 8000
CMD ["/app/start.sh"]
