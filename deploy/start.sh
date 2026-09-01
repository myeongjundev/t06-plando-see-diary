#!/bin/sh
set -eu
flask --app app:create_app db upgrade
exec waitress-serve --call --listen="0.0.0.0:${PORT:-8000}" app:create_app
