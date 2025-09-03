import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { MediaUpload } from './MediaUpload';
import { XIcon } from '../../constants/platform';

export const ProfileEditor: React.FC = () => {
  const { currentUser } = useAuth();
  const [photos, setPhotos] = useState<string[]>([]);
  const [bio, setBio] = useState('');
  const [genres, setGenres] = useState<string[]>([]);

  const addPhoto = (url: string) => {
    if (photos.length < 6) {
      setPhotos([...photos, url]);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const saveProfile = async () => {
    // Save to Supabase
    console.log('Saving profile:', { photos, bio, genres });
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-bold text-[color:var(--text-primary)]">Edit Profile</h2>
      
      <div>
        <label className="block text-sm font-medium text-[color:var(--text-primary)] mb-2">
          Photos ({photos.length}/6)
        </label>
        <div className="grid grid-cols-3 gap-4 mb-4">
          {photos.map((photo, index) => (
            <div key={index} className="relative aspect-square">
              <img src={photo} alt={`Photo ${index + 1}`} className="w-full h-full object-cover rounded-lg" />
              <button
                onClick={() => removePhoto(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
              >
                <XIcon className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
        {photos.length < 6 && <MediaUpload onUploadComplete={addPhoto} />}
      </div>

      <div>
        <label className="block text-sm font-medium text-[color:var(--text-primary)] mb-2">
          Bio
        </label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Tell other DJs about yourself..."
          className="w-full p-3 border border-[color:var(--border)] rounded-lg bg-[color:var(--bg-secondary)] text-[color:var(--text-primary)] resize-none"
          rows={4}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[color:var(--text-primary)] mb-2">
          Favorite Genres
        </label>
        <div className="flex flex-wrap gap-2">
          {['House', 'Techno', 'Trance', 'Hip-Hop', 'EDM', 'Drum & Bass'].map(genre => (
            <button
              key={genre}
              onClick={() => setGenres(prev => 
                prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
              )}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                genres.includes(genre)
                  ? 'bg-[color:var(--accent)] text-black'
                  : 'bg-[color:var(--surface-alt)] text-[color:var(--text-secondary)]'
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={saveProfile}
        className="w-full bg-[color:var(--accent)] text-black py-3 rounded-lg font-medium hover:bg-[color:var(--accent-muted)] transition-colors"
      >
        Save Profile
      </button>
    </div>
  );
};