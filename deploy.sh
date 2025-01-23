#!/bin/bash

#Production
git reset --hard
git checkout master
git pull origin master 



npm i global add serve --legacy-peer-deps
npm run build
pm2 start deploy.json





#