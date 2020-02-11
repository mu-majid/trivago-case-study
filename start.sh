#!/bin/bash


cd ApiGateWay
npm install

cd ../BusinessLogic
npm install

cd ../MonitoringService
npm install

cd ..
docker-compose up 