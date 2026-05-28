#!/bin/sh
set -e

envsubst < /usr/share/nginx/html/runtime-config.js > /usr/share/nginx/html/runtime-config.js.tmp
mv /usr/share/nginx/html/runtime-config.js.tmp /usr/share/nginx/html/runtime-config.js

exec nginx -g "daemon off;"
