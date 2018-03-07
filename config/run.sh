#!/bin/sh

set -e

PORT=${PORT:=80}
TLS=${TLS:=off}
NODE_ENV=${NODE_ENV:=production}

# Wait for mongo
sleep 5

# Start API server
node index.js &

# Start HTTP server
caddy -conf config/Caddyfile -root dist