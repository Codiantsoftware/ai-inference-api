# =============== Build Stage ===============
# This stage installs all dependencies and builds the application
FROM node:22-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files for dependency installation
COPY package*.json ./

# Install all dependencies (including dev dependencies)
RUN npm ci

# Copy source code
COPY . .

# =============== Test Stage ===============
# This stage runs the test suite
FROM builder AS tester
RUN npm test

# =============== Production Stage ===============
# This stage creates the final production image
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy package files and install only production dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy built application from builder stage
COPY --from=builder /app/src ./src

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Expose the application port
EXPOSE 3000

# Configure health check
# - Runs every 30 seconds
# - Times out after 3 seconds
# - Allows 3 retries
# - Has a 5-second start period
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

# Start the application
CMD ["node", "src/app.js"] 