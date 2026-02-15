#!/bin/sh
set -e

# Run database migrations
echo "Running database migrations..."
./node_modules/.bin/prisma migrate deploy

# Seed database (only if needed - safe to run multiple times)
echo "Seeding database..."
./node_modules/.bin/prisma db seed || true

# Start the application
echo "Starting application..."
exec "$@"
