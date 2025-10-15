export interface SpotifyTrack {
  id: string;
  name: string;
  artists: string[];
  album: string;
  image: string;
  preview_url?: string;
}

export const spotifyService = {
  async getUserTracks(accessToken: string): Promise<SpotifyTrack[]> {
    const response = await fetch('https://api.spotify.com/v1/me/tracks?limit=50', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    const data = await response.json();
    return data.items.map((item: any) => ({
      id: item.track.id,
      name: item.track.name,
      artists: item.track.artists.map((a: any) => a.name),
      album: item.track.album.name,
      image: item.track.album.images[0]?.url || '',
      preview_url: item.track.preview_url
    }));
  },

  async getUserPlaylists(accessToken: string): Promise<any[]> {
    const response = await fetch('https://api.spotify.com/v1/me/playlists?limit=50', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    const data = await response.json();
    return data.items;
  },

  async getPlaylistTracks(accessToken: string, playlistId: string): Promise<SpotifyTrack[]> {
    const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    const data = await response.json();
    return data.items.map((item: any) => ({
      id: item.track.id,
      name: item.track.name,
      artists: item.track.artists.map((a: any) => a.name),
      album: item.track.album.name,
      image: item.track.album.images[0]?.url || '',
      preview_url: item.track.preview_url
    }));
  }
};
