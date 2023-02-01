#!/bin/bash
npm install && \
npm run-script build && \
cd build && \
wget https://corentv.com/corenshows.db && \
cd .. && \
echo "run: serve -s build \n\n to serve the files" && \
serve -s build