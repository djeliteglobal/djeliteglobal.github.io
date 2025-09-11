export interface Subscription {
  id: string;
  user_id: string;
  plan: 'free' | 'pro' | 'elite';
  status: 'active' | 'cancelled' | 'expired';
  stripe_subscription_id?: string;
  current_period_start: string;
  current_period_end: string;
  created_at: string;
  updated_at: string;
}

export interface SubscriptionLimits {
  connections: number;
  advanced_profile: boolean;
  direct_contact: boolean;
  priority_matching: boolean;
  community_events: boolean;
}

export const PLAN_LIMITS: Record<string, SubscriptionLimits> = {
  free: {
    connections: 5,
    advanced_profile: false,
    direct_contact: false,
    priority_matching: false,
    community_events: false
  },
  pro: {
    connections: -1, // unlimited
    advanced_profile: true,
    direct_contact: true,
    priority_matching: false,
    community_events: false
  },
  elite: {
    connections: -1, // unlimited
    advanced_profile: true,
    direct_contact: true,
    priority_matching: true,
    community_events: true
  }
};