# Frontend Dockerfile
FROM node:18-alpine

WORKDIR /usr/src/app

# Kopiere package.json und package-lock.json und installiere die Abhängigkeiten
COPY package*.json ./
RUN npm install

# Kopiere die restlichen Dateien in das Arbeitsverzeichnis
COPY . .

# Exponiere den Port 8080 für http-server
EXPOSE 8080

# Starte den http-server mit dem Proxy-Flag
CMD ["npx", "http-server", "-p", "8080", "--proxy", "http://backend:5000"]
