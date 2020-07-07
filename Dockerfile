FROM node:12

WORKDIR /app

COPY package*.json ./

RUN npm i

COPY . .

EXPOSE 3000
CMD [ "npm", "start" ]
