import { sql } from '../config/supabase';

export interface UserPresence {
  user_id: string;
  status: 'online' | 'away' | 'offline';
  last_seen: string;
  activity: string;
}

class PresenceService {
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private currentStatus: 'online' | 'away' | 'offline' = 'offline';

  async initialize(userId: string) {
    if (!userId) return;

    await this.updatePresence('online', 'Active', userId);
    this.startHeartbeat(userId);
    
    document.addEventListener('visibilitychange', () => this.handleVisibilityChange(userId));
    window.addEventListener('beforeunload', () => {
      this.updatePresence('offline', 'Offline', userId);
    });
  }

  private startHeartbeat(userId: string) {
    this.heartbeatInterval = setInterval(async () => {
      if (this.currentStatus === 'online') {
        await this.updatePresence('online', 'Active', userId);
      }
    }, 30000);
  }

  private handleVisibilityChange = (userId: string) => {
    if (document.hidden) {
      this.updatePresence('away', 'Away', userId);
    } else {
      this.updatePresence('online', 'Active', userId);
    }
  };

  async updatePresence(status: 'online' | 'away' | 'offline', activity: string = '', userId: string) {
    if (!userId) return;
    this.currentStatus = status;

    try {
      await sql`
        INSERT INTO user_presence (user_id, status, last_seen, activity)
        VALUES (${userId}, ${status}, NOW(), ${activity})
        ON CONFLICT (user_id) DO UPDATE SET status = ${status}, last_seen = NOW(), activity = ${activity}
      `;
    } catch (error) {
      console.error('Error updating presence:', error);
    }
  }

  async getUserPresence(userId: string): Promise<UserPresence | null> {
    try {
      const result = await sql`SELECT * FROM user_presence WHERE user_id = ${userId} LIMIT 1`;
      const data = result.rows[0];
      if (!data) return null;

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
      const result = await sql`SELECT * FROM user_presence WHERE status IN ('online', 'away') AND last_seen >= ${twoMinutesAgo} ORDER BY last_seen DESC`;
      return result.rows;
    } catch (error) {
      return [];
    }
  }

  subscribeToPresence(userId: string, callback: (presence: UserPresence | null) => void) {
    const interval = setInterval(async () => {
      const presence = await this.getUserPresence(userId);
      callback(presence);
    }, 10000);

    return () => clearInterval(interval);
  }

  cleanup(userId: string) {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }
    
    this.updatePresence('offline', 'Offline', userId);
  }
}

export const presenceService = new PresenceService();
