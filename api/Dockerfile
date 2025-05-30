# --- Build Stage ---
FROM node:24-slim AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY . .

# --- Runtime Stage ---
FROM node:24-slim

WORKDIR /app
COPY --from=builder /app ./

EXPOSE 7777
CMD ["npm", "start"]
