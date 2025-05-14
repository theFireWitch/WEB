FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --only=prod || npm install

COPY . .

RUN npm run build

EXPOSE 8080

CMD ["node", "dist/server.js"]