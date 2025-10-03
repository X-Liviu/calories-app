FROM node:20

WORKDIR /usr/src/app

# Copiar solo los archivos de dependencias primero para aprovechar la caché de Docker
COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "run", "devDocker"]
