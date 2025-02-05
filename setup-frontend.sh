#!/bin/bash

echo "Initializing React App..."
npx create-react-app snitch-app-frontend
cd snitch-app-frontend

echo "Installing Dependencies..."
npm install socket.io-client
npm install firebase

echo "Starting the App..."
npm start

