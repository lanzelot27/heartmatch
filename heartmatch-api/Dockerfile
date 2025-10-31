# =========================
# Stage 1: Build
# =========================
FROM node:20-alpine AS builder
WORKDIR /app

# Copy only what's needed first (for better caching)
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci

# Copy all source files
COPY . .

# ✅ Ensure .env is available during build (for Prisma generate)
COPY .env .env

# Generate Prisma client
RUN npx prisma generate

# Build NestJS
RUN npm run build

# =========================
# Stage 2: Production
# =========================
FROM node:20-alpine
WORKDIR /app

# Copy only production dependencies
COPY package*.json ./
RUN npm ci --only=production

# ✅ Copy .env file (important so Prisma sees DATABASE_URL)
COPY .env .env

# Copy built output and Prisma files from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

EXPOSE 3001

# ✅ Run migrations and start the app
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/src/main.js"]
