FROM node:18

# Create app directory
WORKDIR /app

RUN apt-get update
# Install dependencies
RUN apt-get install -y wget zsh git 

#copy project
COPY . .

RUN npm install 
RUN cp webpack_config_override node_modules/react-scripts/config/webpack.config.js 
RUN npm run-script build 
RUN npm install -g serve
RUN cd build && wget https://corentv.com/corenshows.db && cd .. 

EXPOSE 3000

ENTRYPOINT /bin/bash