FROM node:18-alpine
LABEL authors="Mark Botros"

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 8080

CMD ["npm", "run", "start:dev"]