import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../config/supabase';

interface LikedProfile {
  id: string;
  dj_name: string;
  profile_image_url: string;
  location: string;
  genres: string[];
  created_at: string;
}

export const WhoLikedYou: React.FC = () => {
  const [likedProfiles, setLikedProfiles] = useState<LikedProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    loadLikedProfiles();
  }, []);

  const loadLikedProfiles = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: userProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!userProfile) return;

      // Get profiles that liked current user
      const { data: swipes } = await supabase
        .from('swipes')
        .select(`
          *,
          swiper:profiles!swipes_swiper_id_fkey(*)
        `)
        .eq('swiped_id', userProfile.id)
        .eq('direction', 'right')
        .order('created_at', { ascending: false })
        .limit(20);

      const profiles = (swipes || []).map(swipe => ({
        ...swipe.swiper,
        created_at: swipe.created_at
      }));

      setLikedProfiles(profiles);
    } catch (error) {
      console.error('Error loading liked profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLikeBack = async (profileId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: userProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!userProfile) return;

      // Create swipe back
      await supabase
        .from('swipes')
        .insert({
          swiper_id: userProfile.id,
          swiped_id: profileId,
          direction: 'right'
        });

      // Create match
      await supabase
        .from('matches')
        .insert({
          profile1_id: userProfile.id,
          profile2_id: profileId
        });

      // Remove from liked list
      setLikedProfiles(prev => prev.filter(p => p.id !== profileId));
    } catch (error) {
      console.error('Error liking back:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[color:var(--accent)]"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Who Liked You</h2>
        <p className="text-[color:var(--text-secondary)]">
          {likedProfiles.length} DJs liked your profile
        </p>
      </div>

      {!isPremium && (
        <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg p-6 mb-6 border border-purple-500/30">
          <h3 className="text-lg font-bold mb-2">🔒 Premium Feature</h3>
          <p className="text-sm text-[color:var(--text-secondary)] mb-4">
            Upgrade to see who liked you and get unlimited matches!
          </p>
          <button className="bg-[color:var(--accent)] text-black px-6 py-2 rounded-full font-semibold hover:bg-[color:var(--accent-muted)] transition-colors">
            Upgrade Now
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        {likedProfiles.map((profile, index) => (
          <motion.div
            key={profile.id}
            className="relative bg-[color:var(--surface)] rounded-lg overflow-hidden border border-[color:var(--border)]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            {!isPremium ? (
              <div className="aspect-square bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center">
                <div className="text-4xl">🔒</div>
              </div>
            ) : (
              <img
                src={profile.profile_image_url || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMDAgNTBDMTEzLjgwNyA1MCAxMjUgNDMuODA3IDEyNSAzMEMxMjUgMTYuMTkzIDExMy44MDcgNSAxMDAgNUM4Ni4xOTMgNSA3NSAxNi4xOTMgNzUgMzBDNzUgNDMuODA3IDg2LjE5MyA1MCAxMDAgNTBaIiBmaWxsPSIjOUNBM0FGIi8+CjxwYXRoIGQ9Ik0xNTAgMTk1SDUwQzUwIDE2NS4xIDY5LjkgMTQwIDEwMCAxNDBDMTMwLjEgMTQwIDE1MCAxNjUuMSAxNTAgMTk1WiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4='}
                alt={profile.dj_name}
                className="w-full aspect-square object-cover"
              />
            )}
            
            <div className="p-3">
              <h3 className="font-semibold truncate">
                {isPremium ? profile.dj_name : '***'}
              </h3>
              <p className="text-xs text-[color:var(--text-secondary)] truncate">
                {isPremium ? profile.location : '***'}
              </p>
              
              {isPremium && (
                <div className="flex gap-1 mt-2">
                  {profile.genres?.slice(0, 2).map(genre => (
                    <span
                      key={genre}
                      className="text-xs bg-[color:var(--accent)]/20 text-[color:var(--accent)] px-2 py-0.5 rounded-full"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              )}
              
              {isPremium && (
                <button
                  onClick={() => handleLikeBack(profile.id)}
                  className="w-full mt-3 bg-[color:var(--accent)] text-black py-2 rounded-lg text-sm font-semibold hover:bg-[color:var(--accent-muted)] transition-colors"
                >
                  💚 Like Back
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {likedProfiles.length === 0 && (
        <div className="text-center py-12 text-[color:var(--text-secondary)]">
          <div className="text-4xl mb-4">💔</div>
          <p>No likes yet. Keep swiping to get discovered!</p>
        </div>
      )}
    </div>
  );
};