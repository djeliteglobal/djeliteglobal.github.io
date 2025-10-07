import { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';

interface ViralStats {
  referralCount: number;
  shareCount: number;
  inviteBonus: number;
  socialScore: number;
}

interface ShareData {
  platform: 'twitter' | 'instagram' | 'tiktok' | 'whatsapp' | 'copy';
  content: string;
  url: string;
}

export const useViralMechanics = () => {
  const [stats, setStats] = useState<ViralStats>({
    referralCount: 0,
    shareCount: 0,
    inviteBonus: 0,
    socialScore: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadViralStats();
  }, []);

  const loadViralStats = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get user's viral metrics
      const { data: profile } = await supabase
        .from('profiles')
        .select('referral_count, share_count, social_score')
        .eq('user_id', user.id)
        .single();

      if (profile) {
        setStats({
          referralCount: profile.referral_count || 0,
          shareCount: profile.share_count || 0,
          inviteBonus: (profile.referral_count || 0) * 5, // $5 per referral
          socialScore: profile.social_score || 0
        });
      }
    } catch (error) {
      console.error('Failed to load viral stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateShareContent = (type: 'profile' | 'match' | 'general'): ShareData[] => {
    const baseUrl = 'https://djelite.site';
    const { data: { user } } = supabase.auth.getUser();
    const referralCode = user?.id?.slice(0, 8) || 'DJAPP';

    const shareUrl = `${baseUrl}?ref=${referralCode}`;

    const content = {
      profile: {
        twitter: `🎧 Just created my DJ profile on @DJElite! Connect with DJs worldwide and find your perfect music collaborations. Join me: ${shareUrl} #DJLife #MusicNetworking`,
        instagram: `🎵 Found the perfect platform for DJs! @djelite connects music creators worldwide. Swipe, match, collaborate! 🚀`,
        tiktok: `POV: You found the Tinder for DJs 🎧✨ #DJLife #MusicApp #Collaboration`,
        whatsapp: `Hey! I'm on DJ Elite - it's like Tinder but for DJs! Perfect for finding collaborations and gigs. Check it out: ${shareUrl}`,
        copy: shareUrl
      },
      match: {
        twitter: `🔥 Just matched with an amazing DJ on @DJElite! The music networking is incredible. Join the community: ${shareUrl} #DJMatching`,
        instagram: `When you find your perfect DJ match 🎯🎧 @djelite is changing the game!`,
        tiktok: `When the algorithm matches you with the perfect DJ collab 🎵💫 #DJMatch #MusicNetworking`,
        whatsapp: `Just had an amazing match on DJ Elite! This app is perfect for finding music collaborators: ${shareUrl}`,
        copy: shareUrl
      },
      general: {
        twitter: `🎧 DJ Elite is revolutionizing music networking! Swipe, match, and collaborate with DJs worldwide. Join now: ${shareUrl} #DJCommunity`,
        instagram: `The future of DJ networking is here! 🚀🎵 @djelite`,
        tiktok: `This app is about to change DJ networking forever 🎧⚡ #DJElite #MusicTech`,
        whatsapp: `Check out DJ Elite - the coolest way to connect with DJs and find collaborations: ${shareUrl}`,
        copy: shareUrl
      }
    };

    return [
      { platform: 'twitter', content: content[type].twitter, url: shareUrl },
      { platform: 'instagram', content: content[type].instagram, url: shareUrl },
      { platform: 'tiktok', content: content[type].tiktok, url: shareUrl },
      { platform: 'whatsapp', content: content[type].whatsapp, url: shareUrl },
      { platform: 'copy', content: content[type].copy, url: shareUrl }
    ];
  };

  const trackShare = async (platform: string, type: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Increment share count
      await supabase.rpc('increment_share_count', { user_id: user.id });
      
      // Track share event
      await supabase
        .from('viral_events')
        .insert({
          user_id: user.id,
          event_type: 'share',
          platform,
          content_type: type,
          created_at: new Date().toISOString()
        });

      // Update local stats
      setStats(prev => ({
        ...prev,
        shareCount: prev.shareCount + 1,
        socialScore: prev.socialScore + 2 // +2 points per share
      }));

      console.log('📤 VIRAL: Share tracked', { platform, type });
    } catch (error) {
      console.error('Failed to track share:', error);
    }
  };

  const shareToSocial = async (shareData: ShareData, contentType: string = 'general') => {
    const { platform, content, url } = shareData;

    // Track the share
    await trackShare(platform, contentType);

    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(content)}`, '_blank');
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(content)}`, '_blank');
        break;
      case 'copy':
        await navigator.clipboard.writeText(url);
        // Show toast notification
        break;
      default:
        // For Instagram/TikTok, copy content and show instructions
        await navigator.clipboard.writeText(content);
        break;
    }
  };

  const generateReferralLink = () => {
    const { data: { user } } = supabase.auth.getUser();
    const referralCode = user?.id?.slice(0, 8) || 'DJAPP';
    return `https://djelite.site?ref=${referralCode}`;
  };

  const claimReferralBonus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { data, error } = await supabase.rpc('claim_referral_bonus', { 
        user_id: user.id 
      });

      if (error) throw error;

      // Refresh stats
      await loadViralStats();
      
      return data?.success || false;
    } catch (error) {
      console.error('Failed to claim referral bonus:', error);
      return false;
    }
  };

  return {
    stats,
    loading,
    generateShareContent,
    shareToSocial,
    generateReferralLink,
    claimReferralBonus,
    trackShare
  };
};
