import { supabase } from '../config/supabase';

export const migrateDjNames = async (): Promise<void> => {
  try {
    console.log('🔄 Starting DJ name migration for current user...');
    
    // Get current user's profile only
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    if (!currentUser) {
      console.log('❌ No authenticated user');
      return;
    }
    
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, user_id, dj_name')
      .eq('user_id', currentUser.id);
    
    if (profilesError) {
      console.error('❌ Failed to fetch profile:', profilesError);
      return;
    }
    
    if (!profiles || profiles.length === 0) {
      console.log('✅ No profile found for current user');
      return;
    }
    
    console.log(`🔍 Found ${profiles.length} profile(s) to check`);
    let updatedCount = 0;
    
    for (const profile of profiles) {
      try {
        // Skip if not current user (can't access other users' auth data)
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        if (!currentUser || profile.user_id !== currentUser.id) {
          console.log(`⚠️ Skipping profile ${profile.id} - not current user`);
          continue;
        }
        
        const user = currentUser;
        
        // Determine new DJ name
        let newDjName = null;
        
        // Try OAuth provider names first
        const oauthName = user.user_metadata?.full_name || user.user_metadata?.name;
        if (oauthName && oauthName !== profile.dj_name) {
          newDjName = oauthName;
        }
        // Fallback to email username if current name is generic
        else if (user.email && (
          profile.dj_name === 'New DJ' || 
          !profile.dj_name || 
          profile.dj_name.trim() === '' ||
          profile.dj_name === 'DJ'
        )) {
          newDjName = user.email.split('@')[0];
        }
        
        // Update if we have a new name
        if (newDjName) {
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ dj_name: newDjName })
            .eq('id', profile.id);
          
          if (updateError) {
            console.error(`❌ Failed to update profile ${profile.id}:`, updateError);
          } else {
            console.log(`✅ Updated ${profile.dj_name} → ${newDjName}`);
            updatedCount++;
          }
        }
        
      } catch (error) {
        console.error(`❌ Error processing profile ${profile.id}:`, error);
      }
    }
    
    console.log(`🎉 Migration complete! Updated ${updatedCount} profile(s)`);
    
    if (updatedCount > 0) {
      // Refresh the page to show updated name
      setTimeout(() => window.location.reload(), 1000);
    }
    
  } catch (error) {
    console.error('💥 Migration failed:', error);
  }
};

// Auto-run migration on import (for development)
if (typeof window !== 'undefined') {
  console.log('🚀 DJ Name Migration available - call migrateDjNames() to run');
}
