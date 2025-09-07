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
}

export interface SwipeResult {
  match: boolean;
  is_super?: boolean;
  error?: string;
}