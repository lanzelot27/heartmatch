# Multi-stage build for NestJS
FROM node:20-alpine AS builder

WORKDIR /app

# Copy only package and prisma first for caching
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci

# Copy the rest of the source
COPY . .

# Set env
ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}

# Generate Prisma Client
RUN npx prisma generate

# Build the application
RUN npm run build

# ✅ Check build output
RUN ls -R dist

# Production image
FROM node:20-alpine

WORKDIR /app

# Copy package files and install production deps
COPY package*.json ./
RUN npm ci --only=production

# Copy the build output
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/prisma ./prisma

EXPOSE 3001

# ✅ Run migration and start from the actual main.js location
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/src/main.js"]
