#!/bin/bash

# Load from environment variables or use defaults
SUPABASE_CONN="${SUPABASE_CONN:-postgresql://postgres:connec888---@db.sxdlagcwryzzozyuznth.supabase.co:5432/postgres}"
NEON_CONN="${NEON_CONN:-postgresql://neondb_owner:npg_BXyqcCa45lEU@ep-lively-shadow-aegbkbau-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require}"

echo "🚀 Migrating data from Supabase to Neon..."
echo ""

# Export data from Supabase (only public schema tables with data)
echo "📤 Exporting data from Supabase..."
pg_dump "$SUPABASE_CONN" \
  --data-only \
  --schema=public \
  --no-owner \
  --no-privileges \
  --disable-triggers \
  -f supabase-data.sql

if [ $? -eq 0 ]; then
    echo "✅ Data exported successfully!"
    echo ""
    echo "📥 Importing data to Neon..."
    
    # Import data to Neon
    psql "$NEON_CONN" -f supabase-data.sql
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ Data migration completed!"
        echo "🎵 All your DJ Elite data is now on Neon!"
        echo ""
        echo "📊 Verifying data:"
        psql "$NEON_CONN" -c "SELECT 
            t.table_name,
            (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name AND table_schema = 'public') as columns,
            pg_class.reltuples::bigint as row_count
        FROM information_schema.tables t
        JOIN pg_class ON pg_class.relname = t.table_name
        WHERE t.table_schema = 'public' AND t.table_type = 'BASE TABLE'
        ORDER BY t.table_name;"
        
        echo ""
        echo "🧹 Cleanup: Remove supabase-data.sql? (y/n)"
        read -r cleanup
        if [ "$cleanup" = "y" ]; then
            rm supabase-data.sql
            echo "✅ Cleaned up export file"
        fi
    else
        echo "❌ Data import failed!"
        exit 1
    fi
else
    echo "❌ Data export failed!"
    echo "Make sure your Supabase connection string is correct (line 4)"
    exit 1
fi
