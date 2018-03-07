#!/bin/sh

set -e
set -x

# Clone frontend
git clone --depth 1 https://github.com/devments/caps-angular.git frontend

# Build Angular app
cd frontend
npm install
node_modules/@angular/cli/bin/ng build --prod
mv dist ../dist
cd ..

# Build API
npm install --production

# Clean up
rm -rf frontend