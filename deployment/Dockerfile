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

RUN \
  if [ -f yarn.lock ]; then yarn run build; \
  elif [ -f package-lock.json ]; then npm run build; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm run build; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Final stage - Serve the built app using nginx
FROM nginx:stable-alpine AS runner
WORKDIR /app

# Copy the build output to the nginx html directory
COPY --from=builder /app/dist /usr/share/nginx/html

COPY --from=builder /app/deployment/entrypoint.sh /app/bin/
COPY --from=builder /app/deployment/nginx.conf /etc/nginx/conf.d/default.conf

RUN chmod -R +x /app/bin

# Expose the default HTTP port
EXPOSE 80

# Start nginx to serve the static files
ENTRYPOINT ["/app/bin/entrypoint.sh"]
