# Dockerfile
FROM node:18

# Arbeitsverzeichnis erstellen und wechseln
WORKDIR /usr/src/app

# Kopiere package.json und package-lock.json
COPY package*.json ./

# Installiere Abhängigkeiten
RUN npm install

# Kopiere den Rest des Codes
COPY . .

# Exponiere Port 5000
EXPOSE 5000

# Startbefehl
CMD ["npm", "start"]
