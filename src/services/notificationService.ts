import { Message } from './messageService';

export interface NotificationOptions {
  title: string;
  body: string;
  icon?: string;
  tag?: string;
  requireInteraction?: boolean;
}

class NotificationService {
  private permission: NotificationPermission = 'default';

  constructor() {
    this.checkPermission();
  }

  private checkPermission() {
    if ('Notification' in window) {
      this.permission = Notification.permission;
    }
  }

  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return false;
    }

    if (this.permission === 'granted') {
      return true;
    }

    const permission = await Notification.requestPermission();
    this.permission = permission;
    return permission === 'granted';
  }

  showNotification(options: NotificationOptions): Notification | null {
    if (this.permission !== 'granted') {
      return null;
    }

    const notification = new Notification(options.title, {
      body: options.body,
      icon: options.icon || '/logo DJ Elite.png',
      tag: options.tag,
      requireInteraction: options.requireInteraction || false,
    });

    // Auto-close after 5 seconds
    setTimeout(() => {
      notification.close();
    }, 5000);

    return notification;
  }

  showMessageNotification(message: Message, matchName: string): void {
    // Don't show notification if page is visible
    if (!document.hidden) {
      return;
    }

    this.showNotification({
      title: `💬 New message from ${matchName}`,
      body: message.content.length > 50 
        ? message.content.substring(0, 50) + '...' 
        : message.content,
      tag: `message-${message.match_id}`,
      requireInteraction: true
    });
  }

  async initialize(): Promise<void> {
    await this.requestPermission();
  }
}

export const notificationService = new NotificationService();