# # Stage 1: Build the app
# FROM node:18 AS builder

# WORKDIR /app

# # Copy package files and install dependencies
# COPY package*.json ./
# RUN npm ci

# # Copy all source files
# COPY . .

# # Run build step
# RUN npm run build

# # Stage 2: Run the built app
# FROM node:18-alpine

# WORKDIR /app

# # Only copy what's needed for runtime
# COPY package*.json ./
# RUN npm install --only=production

# # Copy the build output from the builder stage
# COPY --from=builder /app/dist ./dist
# COPY --from=builder /app/migrations ./migrations
# COPY --from=builder /app/server ./server

# COPY --from=builder /app/drizzle.config.ts .
# # If you need other files like config or static assets
# # COPY --from=builder /app/config ./config

# EXPOSE 3000

# # Run the built app
# CMD ["node", "dist/index.js"]

# # CMD ["npm", "run", "dev"]


# ---------------

# development
FROM node:18-alpine as development

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

# production
FROM node:18-alpine as production

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY --from=development /app/dist ./dist
COPY --from=development /app/migrations ./migrations
COPY --from=development /app/server ./server
COPY --from=development /app/drizzle.config.ts .