# Multi-stage Dockerfile: build frontend with Node, then build Python backend image

### Stage 1: build React app
FROM node:18-bullseye as node-build
WORKDIR /src
COPY package*.json ./
COPY public ./public
COPY src ./src
RUN npm ci --silent
RUN npm run build

### Stage 2: runtime image with Python + system libs for WeasyPrint
FROM python:3.11-slim

# Install system packages required by WeasyPrint and build tools
RUN apt-get update \
 && apt-get install -y --no-install-recommends \
    build-essential \
    libcairo2 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libgdk-pixbuf2.0-0 \
    libffi-dev \
    shared-mime-info \
    curl \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy requirements and install Python deps
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend app files
COPY ./*.py ./
COPY Procfile ./

# Copy built frontend from node-build stage
COPY --from=node-build /src/build ./build

ENV PORT=8000
EXPOSE 8000

# Default command (Procfile compatible)
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "${PORT}"]
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build React app
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Install serve to run the app
RUN npm install -g serve

# Copy built app from builder
COPY --from=builder /app/build ./build
COPY --from=builder /app/server.js ./server.js
COPY --from=builder /app/package*.json ./
# Do not copy local data folder (Resume.csv removed)

# Install production dependencies
RUN npm install --only=production

# Expose port
EXPOSE 5000

# Set environment variables
ENV NODE_ENV=production
ENV REACT_APP_ENV=production

# Start the server
CMD ["node", "server.js"]
