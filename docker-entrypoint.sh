#!/bin/sh
set -e

if [ "${RUN_MIGRATIONS_ON_BOOT:-true}" = "true" ]; then
  echo "[entrypoint] Running database migrations..."
  pnpm run migration:run:prod || {
    echo "[entrypoint] Migration failed — exiting."
    exit 1
  }
else
  echo "[entrypoint] Skipping migrations (RUN_MIGRATIONS_ON_BOOT=false)."
fi

echo "[entrypoint] Starting application..."
exec "$@"
