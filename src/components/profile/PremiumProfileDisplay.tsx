import React from 'react';
import { DJProfile } from '../../types/profile';
import { DirectContact } from '../platform/DirectContact';

interface PremiumProfileDisplayProps {
  profile: DJProfile;
}

export const PremiumProfileDisplay: React.FC<PremiumProfileDisplayProps> = ({ profile }) => {
  return (
    <div className="space-y-6">
      {/* Premium Badge */}
      {profile.premium_badge && (
        <div className="flex items-center justify-center">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center">
            <span className="mr-2">✨</span>
            PRO DJ
          </div>
        </div>
      )}

      {/* Basic Info */}
      <div className="text-center">
        <h1 className="text-3xl font-bold">{profile.dj_name}</h1>
        {profile.location && <p className="text-gray-600 mt-1">{profile.location}</p>}
        {profile.bio && <p className="text-gray-700 mt-3">{profile.bio}</p>}
      </div>

      {/* Website */}
      {profile.website && (
        <div className="text-center">
          <a 
            href={profile.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            🌐 Visit Website
          </a>
        </div>
      )}

      {/* Social Links */}
      {profile.social_links && Object.keys(profile.social_links).length > 0 && (
        <div>
          <h3 className="font-bold text-lg mb-3">Social Links</h3>
          <div className="grid grid-cols-2 gap-3">
            {profile.social_links.instagram && (
              <a 
                href={profile.social_links.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center p-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:opacity-90"
              >
                <span className="mr-2">📷</span>
                Instagram
              </a>
            )}
            {profile.social_links.soundcloud && (
              <a 
                href={profile.social_links.soundcloud}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center p-3 bg-orange-500 text-white rounded-lg hover:opacity-90"
              >
                <span className="mr-2">🎵</span>
                SoundCloud
              </a>
            )}
            {profile.social_links.spotify && (
              <a 
                href={profile.social_links.spotify}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center p-3 bg-green-500 text-white rounded-lg hover:opacity-90"
              >
                <span className="mr-2">🎧</span>
                Spotify
              </a>
            )}
            {profile.social_links.youtube && (
              <a 
                href={profile.social_links.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center p-3 bg-red-500 text-white rounded-lg hover:opacity-90"
              >
                <span className="mr-2">📺</span>
                YouTube
              </a>
            )}
          </div>
        </div>
      )}

      {/* Equipment */}
      {profile.equipment && profile.equipment.length > 0 && (
        <div>
          <h3 className="font-bold text-lg mb-3">Equipment</h3>
          <div className="grid gap-2">
            {profile.equipment.map((item, index) => (
              <div key={index} className="bg-gray-100 p-3 rounded-lg flex items-center">
                <span className="mr-2">🎛️</span>
                {item}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Achievements */}
      {profile.achievements && profile.achievements.length > 0 && (
        <div>
          <h3 className="font-bold text-lg mb-3">Achievements</h3>
          <div className="grid gap-2">
            {profile.achievements.map((achievement, index) => (
              <div key={index} className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg flex items-center">
                <span className="mr-2">🏆</span>
                {achievement}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Genres & Skills */}
      <div className="grid grid-cols-2 gap-4">
        {profile.genres && profile.genres.length > 0 && (
          <div>
            <h3 className="font-bold text-lg mb-3">Genres</h3>
            <div className="flex flex-wrap gap-2">
              {profile.genres.map((genre, index) => (
                <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {genre}
                </span>
              ))}
            </div>
          </div>
        )}

        {profile.skills && profile.skills.length > 0 && (
          <div>
            <h3 className="font-bold text-lg mb-3">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill, index) => (
                <span key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Direct Contact */}
      <DirectContact profile={profile} />
    </div>
  );
};