// Using existing profile service infrastructure
const supabase = {
  from: (table: string) => ({
    insert: (data: any[]) => ({
      select: () => ({
        single: async () => ({ data: { id: Date.now().toString(), ...data[0] }, error: null })
      })
    }),
    select: (columns?: string) => ({
      order: (column: string, options?: any) => ({
        then: async (resolve: any) => resolve({ data: [], error: null })
      })
    })
  })
};

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
  // Fallback to localStorage for now
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
  // Fallback to localStorage for now
  const events = JSON.parse(localStorage.getItem('dj-events-global') || '[]');
  return events;
};

export const submitApplication = async (applicationData: Omit<Application, 'id' | 'applied_at'>): Promise<Application> => {
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