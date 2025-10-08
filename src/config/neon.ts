import { neon } from '@neondatabase/serverless';

const connectionString = import.meta.env.VITE_NEON_DATABASE_URL;

if (!connectionString) {
  throw new Error('Missing VITE_NEON_DATABASE_URL');
}

export const sql = neon(connectionString);
