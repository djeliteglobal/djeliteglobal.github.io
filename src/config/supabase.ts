import { neon } from '@neondatabase/serverless';

const connectionString = import.meta.env.VITE_NEON_DATABASE_URL || '';

export const sql = neon(connectionString);

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