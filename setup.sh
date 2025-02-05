#!/bin/bash
mkdir messaging-app && cd messaging-app
npm init -y
npm install express socket.io cors dotenv

chmod +x setup.sh

./setup.sh