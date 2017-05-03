#!/bin/bash
set -e
# allow the container to be started with `--user`
if [ "$1" = 'node' ] || [ "$1" = 'nodemon' ]; then
	exec gosu $APP_USER:$APP_USER "$@"
fi
exec "$@"
