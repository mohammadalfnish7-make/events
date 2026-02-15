#!/bin/sh
set -e

# Run database migrations
echo "Running database migrations..."
npx prisma migrate deploy

# Seed database (only if needed - safe to run multiple times)
echo "Seeding database..."
npx prisma db seed || true

# Start the application
echo "Starting application..."
exec "$@"
