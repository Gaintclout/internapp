FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN chmod -R 755 /app/node_modules

EXPOSE 5174

CMD ["npm","run","dev"]