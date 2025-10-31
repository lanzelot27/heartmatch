# --- Build Stage ---
FROM node:20-alpine AS builder
WORKDIR /app

# Copy dependencies and Prisma
COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci
COPY . .

ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}

# Generate Prisma client and build app
RUN npx prisma generate
RUN npm run build

# --- Production Stage ---
FROM node:20-alpine AS runner
WORKDIR /app

# Copy only what’s needed
COPY package*.json ./
RUN npm ci --only=production

COPY prisma ./prisma/
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

EXPOSE 3001

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main.js"]
