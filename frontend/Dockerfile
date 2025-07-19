# Stage 1: Build the Vite app
# FROM node:22-bullseye AS builder

# WORKDIR /app


# # Install dependencies
# COPY package*.json ./
# RUN npm install

# # Copy app files and build
# COPY . .
# RUN npm run build

# # Stage 2: Serve with Caddy
# FROM caddy:2-alpine

# # Copy built app to Caddy's web root
# COPY --from=builder /app/dist /srv
# RUN apk add curl
# COPY CaddyFile /etc/caddy/Caddyfile

# # Optional: Custom Caddyfile for SPA routing

# EXPOSE 8080

# -------------------------------
# development 
FROM node:22-bullseye as development

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN VITE_API_URL=http://backend:3000 npm run build

# production
FROM caddy:2-alpine as production

COPY CaddyFile /etc/caddy/Caddyfile

COPY --from=development /app/dist /srv






