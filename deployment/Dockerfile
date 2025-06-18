# Use Node base image
FROM node:22-alpine AS base

# Install dependencies
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Build the app
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

FROM base AS runner
WORKDIR /app

COPY --from=builder /app/deployment/entrypoint.sh /app/bin/
COPY --from=builder /app /app/

RUN chmod -R +x /app/bin

EXPOSE 3000

ENTRYPOINT ["/app/bin/entrypoint.sh"]