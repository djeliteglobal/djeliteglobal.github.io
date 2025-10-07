#!/bin/bash

# Supabase Database Dump Script
# Connection details for Session Pooler
DB_HOST="aws-1-us-west-1.pooler.supabase.com"
DB_PORT="6543"
DB_NAME="postgres"
DB_USER="postgres.sxdlagcwryzzozyuznth"
DUMP_FILE="supabase-dump-$(date +%Y%m%d-%H%M%S).sql"

echo "Creating database dump..."

# Export schema and data
pg_dump -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" \
  --no-owner --no-privileges --clean --if-exists \
  -f "$DUMP_FILE"

echo "Dump created: $DUMP_FILE"

echo "Done!"