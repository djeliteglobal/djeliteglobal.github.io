import { sql } from '../config/supabase';

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  data?: any;
  read: boolean;
  created_at: string;
}

class NotificationService {
  private initialized = false;

  async initialize(): Promise<void> {
    if (this.initialized) return;
    
    try {
      // Request notification permission
      if ('Notification' in window && Notification.permission === 'default') {
        await Notification.requestPermission();
      }
      this.initialized = true;
    } catch (error) {
      console.warn('Notification service initialization failed:', error);
    }
  }

  async getNotifications(userId: string, limit: number = 20): Promise<Notification[]> {
    try {
      const result = await sql`SELECT * FROM notifications WHERE user_id = ${userId} ORDER BY created_at DESC LIMIT ${limit}`;
      return result.rows;
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      return [];
    }
  }

  async markAsRead(notificationId: string): Promise<void> {
    try {
      await sql`UPDATE notifications SET read = true WHERE id = ${notificationId}`;
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  }

  async markAllAsRead(userId: string): Promise<void> {
    try {
      await sql`UPDATE notifications SET read = true WHERE user_id = ${userId} AND read = false`;
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  }

  async getUnreadCount(userId: string): Promise<number> {
    try {
      const result = await sql`SELECT COUNT(*) FROM notifications WHERE user_id = ${userId} AND read = false`;
      return parseInt(result.rows[0]?.count || '0');
    } catch (error) {
      console.error('Failed to get unread count:', error);
      return 0;
    }
  }

  // Show browser notification for referral success
  showReferralNotification(title: string, message: string): void {
    if (!this.initialized) return;

    try {
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(title, {
          body: message,
          icon: '/logo DJ Elite.png',
          badge: '/logo DJ Elite.png',
          tag: 'referral-success'
        });
      }
    } catch (error) {
      console.warn('Failed to show browser notification:', error);
    }
  }

  // Show message notification
  showMessageNotification(message: any, senderName: string): void {
    if (!this.initialized) return;

    try {
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(`New message from ${senderName}`, {
          body: message.content,
          icon: '/logo DJ Elite.png',
          badge: '/logo DJ Elite.png',
          tag: 'new-message'
        });
      }
    } catch (error) {
      console.warn('Failed to show message notification:', error);
    }
  }

  subscribeToNotifications(userId: string, callback: (notification: Notification) => void): () => void {
    const interval = setInterval(async () => {
      const notifications = await this.getNotifications(userId, 1);
      if (notifications[0]) {
        callback(notifications[0]);
        if (notifications[0].type === 'referral_success') {
          this.showReferralNotification(notifications[0].title, notifications[0].message);
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }

  // Create notification (for testing purposes)
  async createNotification(
    userId: string,
    type: string,
    title: string,
    message: string,
    data?: any
  ): Promise<void> {
    try {
      await sql`INSERT INTO notifications (user_id, type, title, message, data) VALUES (${userId}, ${type}, ${title}, ${message}, ${JSON.stringify(data)})`;
    } catch (error) {
      console.error('Failed to create notification:', error);
    }
  }
}

export const notificationService = new NotificationService();
