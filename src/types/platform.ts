export type Page = 'dashboard' | 'free_course' | 'free_course_access' | 'courses' | 'course_detail' | 'community' | 'opportunities' | 'events' | 'profile' | 'referrals' | 'premium' | 'premium_features' | 'audio-services' | 'settings' | 'landing';

export interface AppState {
  theme: 'light' | 'dark';
  isLoggedIn: boolean;
  page: Page;
  courseId: number | null;
  isSidebarOpen: boolean;
}

export type AppContextType = {
  appState: AppState;
  setAppState: React.Dispatch<React.SetStateAction<AppState>>;
  navigate: (page: Page, courseId?: number | null) => void;
};

export interface User {
  name: string;
  email: string;
  avatarUrl: string;
  plan: 'Free' | 'Pro Annual' | 'Pro Monthly';
}

export interface Lesson {
  id: number;
  title: string;
  duration: string;
  type: 'video' | 'quiz' | 'resource';
}

export interface Module {
  id: number;
  title: string;
  lessons: Lesson[];
}

export interface Course {
  id: number;
  title: string;
  instructor: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  category: string;
  imageUrl: string;
  progress: number;
  description: string;
  modules: Module[];
}

export interface PricingPlan {
  name: string;
  price: string;
  priceDetails: string;
  features: string[];
  isFeatured: boolean;
  cta: string;
}

export interface FaqItem {
    question: string;
    answer: string;
}

export interface Opportunity {
  id: number;
  title: string;
  venue: string;
  location: string;
  date: string;
  genres: string[];
  fee: string;
  imageUrl: string;
  images?: string[];  // Multiple images for Tinder-like navigation
  bio?: string;       // Profile bio
  age?: number;       // Age
  skills?: string[];  // Skills like Music Production, Event Production, etc.
  matchScore?: number; // Match score from matching engine
  matchReasons?: string[]; // Reasons for match
  compatibility?: { // Compatibility breakdown
    musical: number;
    geographic: number;
    social: number;
    activity: number;
  };
}
