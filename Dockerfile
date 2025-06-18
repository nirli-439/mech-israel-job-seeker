# Multi-stage Dockerfile for building and serving the Vite React app

# Build stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine
WORKDIR /app
COPY --from=build /app/dist ./dist
RUN npm install -g vite

# Database connection build arguments
ARG DATABASE_URL
ARG DB_HOST
ARG DB_PORT
ARG DB_NAME
ARG DB_USER
ARG DB_PASSWORD

# Set environment variables for runtime
ENV DATABASE_URL=${DATABASE_URL} \
    DB_HOST=${DB_HOST} \
    DB_PORT=${DB_PORT} \
    DB_NAME=${DB_NAME} \
    DB_USER=${DB_USER} \
    DB_PASSWORD=${DB_PASSWORD}

EXPOSE 8080
CMD ["vite", "preview", "--port", "8080", "--host", "0.0.0.0"]
