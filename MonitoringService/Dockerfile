FROM node:12

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies

COPY package*.json ./

RUN npm install

# Bundle app source
COPY ./src .

EXPOSE 3001
CMD [ "npm", "start" ]