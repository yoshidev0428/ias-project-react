#!/bin/bash -e
cd "$(dirname "$0")"
echo ------ Starting Backend
git pull
docker compose build
echo ------ Docker Build Complete
docker compose up -d
echo ------ Started Backend
cd vue
echo ------ Starting Frontend
npm install
npm run serve
