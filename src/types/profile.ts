export interface DJProfile {
  id: string;
  dj_name: string;
  bio?: string;
  age?: number;
  location?: string;
  genres?: string[];
  experience_level?: string;
  images?: string[];
  skills?: string[];
  is_active?: boolean;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
  // Premium features
  website?: string;
  social_links?: {
    instagram?: string;
    soundcloud?: string;
    spotify?: string;
    youtube?: string;
  };
  equipment?: string[];
  achievements?: string[];
  portfolio_tracks?: string[];
  contact_info?: {
    email?: string;
    phone?: string;
  };
  premium_badge?: boolean;
  // Matching engine properties
  matchScore?: number;
  matchReasons?: string[];
  compatibility?: {
    musical: number;
    geographic: number;
    social: number;
    activity: number;
  };
}

export interface SwipeResult {
  match: boolean;
  is_super?: boolean;
  error?: string;
}