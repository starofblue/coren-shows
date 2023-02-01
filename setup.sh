#!/bin/bash
nvm install v16.19.0 && nvm use v16.19.0 && npm install && npm run-script build && npm install -g serve && cd build && wget https://corentv.com/corenshows.db && cd ..
echo "run: serve -s build"
echo "to serve the files"