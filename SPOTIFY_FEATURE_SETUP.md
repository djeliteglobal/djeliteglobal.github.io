# Spotify Song Import Feature - Setup Guide

## Overview
Users can now import their favorite Spotify songs and display them on their profile and swipe cards.

## Database Migration Required

Run this SQL in your Supabase SQL Editor:

```sql
-- Add spotify_songs column to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS spotify_songs JSONB DEFAULT '[]'::jsonb;

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_profiles_spotify_songs ON profiles USING GIN (spotify_songs);
```

## Features Implemented

### 1. Profile Editor
- **Import from Spotify**: Button to connect and load user's Spotify library
- **Song Selection**: Users can select up to 5 songs from their library
- **Visual Display**: Shows album art, song name, and artists
- **Easy Management**: Add/remove songs with one click

### 2. Swipe Cards
- **Top Tracks Display**: Shows up to 3 selected songs on each profile card
- **Compact Design**: Album art + song info in a clean layout
- **Always Visible**: Displayed prominently below genres, above "More Info"

### 3. Data Structure
Songs are stored as JSONB array with this structure:
```json
[
  {
    "id": "spotify_track_id",
    "name": "Song Name",
    "artists": ["Artist 1", "Artist 2"],
    "album": "Album Name",
    "image": "https://album-art-url.jpg"
  }
]
```

## How It Works

### For Users:
1. Go to Profile Editor
2. Click "🎵 Import from Spotify" button
3. Select up to 5 favorite songs
4. Click "Save Profile"
5. Songs now appear on their profile cards when others swipe

### Technical Flow:
1. Uses Clerk's Spotify OAuth integration
2. Fetches user's saved tracks via Spotify API
3. Stores selected songs in `profiles.spotify_songs` column
4. Displays on swipe cards via `UltraFastSwipeCard` component

## Files Modified

1. **add-spotify-songs.sql** - Database migration
2. **src/services/spotifyService.ts** - NEW: Spotify API integration
3. **src/types/profile.ts** - Added `spotify_songs` field to DJProfile type
4. **src/components/pages/index.tsx** - Added Spotify import UI to InlineProfileEditor
5. **src/components/swipe/UltraFastSwipeCard.tsx** - Added song display to cards

## Testing Checklist

- [ ] Run SQL migration in Supabase
- [ ] Verify Spotify OAuth is enabled in Clerk (already done)
- [ ] Test importing songs from Spotify
- [ ] Test selecting/deselecting songs (max 5)
- [ ] Test saving profile with songs
- [ ] Test viewing songs on swipe cards
- [ ] Test with users who have no songs selected

## Notes

- Maximum 5 songs per profile (prevents clutter)
- Songs display on cards even when "More Info" is collapsed
- Gracefully handles users without Spotify connected
- Uses Clerk's OAuth token for Spotify API calls
- No additional API keys needed (uses Clerk's Spotify integration)
