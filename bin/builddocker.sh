#!/usr/bin/bash
cd ../
docker build . -t corentv/corentv && docker run --rm -it -p 3000:3000 --name node-docker corentv/corentv:latest /bin/bash
