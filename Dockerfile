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
