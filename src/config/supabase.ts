// API client with retry logic
export const sql = async (query: string, params?: any[], retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch('/.netlify/functions/neon-api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, params })
      });
      
      if (!response.ok) {
        throw new Error(`Database error: ${response.status}`);
      }
      
      const { data } = await response.json();
      return data;
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
    }
  }
};

// Legacy export for compatibility - throws errors to catch usage
export const supabase = {
  from: () => { throw new Error('Supabase deprecated - use Neon SQL'); },
  auth: { 
    getUser: async () => ({ data: { user: null }, error: new Error('Use Clerk auth') }),
    getSession: async () => ({ data: { session: null }, error: new Error('Use Clerk auth') }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
  },
  storage: {
    from: () => { throw new Error('Supabase storage deprecated'); }
  },
  rpc: () => { throw new Error('Supabase RPC deprecated'); },
  removeChannel: () => {},
  channel: () => ({
    on: () => ({}),
    subscribe: () => ({})
  })
};