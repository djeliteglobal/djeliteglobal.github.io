import { supabase } from './supabase';

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
};

export const fetchEvents = async (): Promise<Event[]> => {
  const { data, error } = await supabase
    .from('events')
    .select(`
      *,
      applications:event_applications(*)
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const submitApplication = async (applicationData: Omit<Application, 'id' | 'applied_at'>): Promise<Application> => {
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
};