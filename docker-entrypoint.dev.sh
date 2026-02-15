#!/bin/sh
set -e
# Install deps so node_modules volume stays in sync with package.json (e.g. after adding next-themes)
npm install
npx prisma generate
# Apply migrations so DB has all tables (e.g. PageView for analytics)
npx prisma migrate deploy
exec "$@"
