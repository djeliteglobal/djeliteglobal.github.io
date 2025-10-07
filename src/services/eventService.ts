import { createClient } from '@supabase/supabase-js';

// Use existing Supabase client from profile service
let supabase: any;
try {
  const { supabase: existingClient } = require('./profileService');
  supabase = existingClient;
} catch {
  // Fallback if no Supabase available
  supabase = null;
}

export interface Event {
  id: string;
  title: string;
  venue: string;
  date: string;
  time: string;
  duration: number;
  budget: number;
  genres: string[];
  description: string;
  status: 'open' | 'closed' | 'booked';
  created_at: string;
  applications?: Application[];
}

export interface Application {
  id: string;
  event_id: string;
  dj_name: string;
  message: string;
  experience: string;
  equipment: string;
  rate: number;
  status: 'pending' | 'accepted' | 'rejected';
  applied_at: string;
}

export const createEvent = async (eventData: Omit<Event, 'id' | 'created_at' | 'applications'>): Promise<Event> => {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('events')
        .insert([{
          ...eventData,
          status: 'open'
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Supabase event creation failed:', error);
    }
  }
  
  // Fallback to localStorage
  const event = {
    id: Date.now().toString(),
    ...eventData,
    status: 'open' as const,
    created_at: new Date().toISOString(),
    applications: []
  };
  
  const existing = JSON.parse(localStorage.getItem('dj-events-global') || '[]');
  const updated = [event, ...existing];
  localStorage.setItem('dj-events-global', JSON.stringify(updated));
  
  return event;
};

export const fetchEvents = async (): Promise<Event[]> => {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          applications:event_applications(*)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Supabase event fetch failed:', error);
    }
  }
  
  // Fallback to localStorage
  const events = JSON.parse(localStorage.getItem('dj-events-global') || '[]');
  return events;
};

export const submitApplication = async (applicationData: Omit<Application, 'id' | 'applied_at'>): Promise<Application> => {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('event_applications')
        .insert([{
          ...applicationData,
          status: 'pending'
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Supabase application submission failed:', error);
    }
  }
  
  // Fallback to localStorage
  const application = {
    id: Date.now().toString(),
    ...applicationData,
    status: 'pending' as const,
    applied_at: new Date().toISOString()
  };
  
  const events = JSON.parse(localStorage.getItem('dj-events-global') || '[]');
  const updated = events.map((event: Event) => 
    event.id === applicationData.event_id 
      ? { ...event, applications: [...(event.applications || []), application] }
      : event
  );
  localStorage.setItem('dj-events-global', JSON.stringify(updated));
  
  return application;
};
