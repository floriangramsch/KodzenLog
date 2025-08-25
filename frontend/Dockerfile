# --- Build Stage ---
FROM node:24-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY . .

# --- Runtime Stage ---
FROM node:24-alpine

WORKDIR /app
COPY --from=builder /app ./

EXPOSE 8888
CMD ["npm", "start"]
