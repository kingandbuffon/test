FROM node:14.17.0-alpine

RUN mkdir -p /home/test-app
WORKDIR /home/test-app

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV
ENV PATH /home/test-app/node_modules/.bin:$PATH

COPY package*.json /home/test-app
RUN npm install

COPY . .

ENV PORT 5000
EXPOSE $PORT
CMD [ "npm", "start" ]
