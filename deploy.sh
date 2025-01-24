#!/bin/bash

#Production
git reset --hard
git checkout master
git pull origin master 



npm i --legacy-peer-deps
npm run build
pm2 start process.config.js --env production





#