# syntax=docker/dockerfile:1
FROM node:22-alpine AS base
WORKDIR /app
COPY package*.json ./

FROM base AS deps
RUN npm install

FROM deps AS development
ENV NODE_ENV=development
COPY . .
CMD ["npm", "run", "dev"]

FROM deps AS build
COPY . .
RUN npm run build

FROM node:22-alpine AS production
ENV NODE_ENV=production
WORKDIR /app
COPY package*.json ./
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
RUN npm prune --omit=dev
CMD ["node", "dist/server.js"]
