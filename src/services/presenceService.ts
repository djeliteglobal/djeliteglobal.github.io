import { supabase } from '../config/supabase';

export interface UserPresence {
  user_id: string;
  status: 'online' | 'away' | 'offline';
  last_seen: string;
  activity: string;
}

class PresenceService {
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private currentStatus: 'online' | 'away' | 'offline' = 'offline';

  async initialize() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Set initial online status
    await this.updatePresence('online', 'Active');
    
    // Start heartbeat
    this.startHeartbeat();
    
    // Listen for page visibility changes
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
    
    // Listen for beforeunload to set offline
    window.addEventListener('beforeunload', () => {
      this.updatePresence('offline', 'Offline');
    });
  }

  private startHeartbeat() {
    this.heartbeatInterval = setInterval(async () => {
      if (this.currentStatus === 'online') {
        await this.updatePresence('online', 'Active');
      }
    }, 30000); // Update every 30 seconds
  }

  private handleVisibilityChange = () => {
    if (document.hidden) {
      this.updatePresence('away', 'Away');
    } else {
      this.updatePresence('online', 'Active');
    }
  };

  async updatePresence(status: 'online' | 'away' | 'offline', activity: string = '') {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    this.currentStatus = status;

    try {
      await supabase
        .from('user_presence')
        .upsert({
          user_id: user.id,
          status,
          last_seen: new Date().toISOString(),
          activity
        });
    } catch (error) {
      console.error('Error updating presence:', error);
    }
  }

  async getUserPresence(userId: string): Promise<UserPresence | null> {
    try {
      const { data } = await supabase
        .from('user_presence')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (!data) return null;

      // Check if user is actually online (last seen within 2 minutes)
      const lastSeen = new Date(data.last_seen).getTime();
      const now = Date.now();
      const isRecentlyActive = now - lastSeen < 2 * 60 * 1000;

      return {
        ...data,
        status: isRecentlyActive ? data.status : 'offline'
      };
    } catch (error) {
      return null;
    }
  }

  async getOnlineUsers(): Promise<UserPresence[]> {
    try {
      const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000).toISOString();
      
      const { data } = await supabase
        .from('user_presence')
        .select('*')
        .in('status', ['online', 'away'])
        .gte('last_seen', twoMinutesAgo)
        .order('last_seen', { ascending: false });

      return data || [];
    } catch (error) {
      return [];
    }
  }

  subscribeToPresence(userId: string, callback: (presence: UserPresence | null) => void) {
    const channel = supabase
      .channel(`presence:${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_presence',
          filter: `user_id=eq.${userId}`
        },
        async (payload) => {
          const presence = await this.getUserPresence(userId);
          callback(presence);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }

  cleanup() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }
    
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    
    // Set offline status
    this.updatePresence('offline', 'Offline');
  }
}

export const presenceService = new PresenceService();
