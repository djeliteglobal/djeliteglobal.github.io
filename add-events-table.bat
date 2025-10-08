@echo off
echo.
echo ========================================
echo   ADD EVENTS TABLE TO NEON
echo ========================================
echo.
echo This will add the events and event_applications tables to your Neon database.
echo.
set /p NEON_URL="Enter your Neon connection string: "
echo.
echo Connecting to Neon and creating tables...
echo.
psql "%NEON_URL%" -c "CREATE TABLE IF NOT EXISTS events (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), title TEXT NOT NULL, venue TEXT NOT NULL, date DATE NOT NULL, time TEXT NOT NULL, duration INTEGER NOT NULL, budget DECIMAL(10,2) NOT NULL, genres TEXT[] DEFAULT '{}', description TEXT, status TEXT CHECK (status IN ('open', 'closed', 'booked')) DEFAULT 'open', created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW());"
echo.
psql "%NEON_URL%" -c "CREATE TABLE IF NOT EXISTS event_applications (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), event_id UUID REFERENCES events(id) ON DELETE CASCADE, dj_name TEXT NOT NULL, message TEXT, experience TEXT, equipment TEXT, rate DECIMAL(10,2), status TEXT CHECK (status IN ('pending', 'accepted', 'rejected')) DEFAULT 'pending', applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW());"
echo.
psql "%NEON_URL%" -c "CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);"
psql "%NEON_URL%" -c "CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);"
psql "%NEON_URL%" -c "CREATE INDEX IF NOT EXISTS idx_applications_event ON event_applications(event_id);"
echo.
echo ========================================
echo   TABLES CREATED!
echo ========================================
echo.
pause
