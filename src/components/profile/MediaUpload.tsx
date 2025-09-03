import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface MediaUploadProps {
  onUploadComplete: (url: string) => void;
}

export const MediaUpload: React.FC<MediaUploadProps> = ({ onUploadComplete }) => {
  const [uploading, setUploading] = useState(false);
  const { currentUser } = useAuth();

  const handleUpload = async (file: File) => {
    if (!file || !currentUser) return;
    
    setUploading(true);
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
    formData.append('folder', `dj-elite/${currentUser.email}`);
    
    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/upload`,
        { method: 'POST', body: formData }
      );
      const data = await response.json();
      onUploadComplete(data.secure_url);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="border-2 border-dashed border-[color:var(--border)] rounded-lg p-8 text-center hover:border-[color:var(--accent)] transition-colors">
      <input
        type="file"
        accept="image/*,video/*"
        onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
        className="hidden"
        id="media-upload"
        disabled={uploading}
      />
      <label htmlFor="media-upload" className="cursor-pointer">
        <div className="text-[color:var(--text-secondary)]">
          {uploading ? 'Uploading...' : '📸 Upload Photo/Video'}
        </div>
        <div className="text-xs text-[color:var(--muted)] mt-2">
          Max 10MB • JPG, PNG, MP4
        </div>
      </label>
    </div>
  );
};