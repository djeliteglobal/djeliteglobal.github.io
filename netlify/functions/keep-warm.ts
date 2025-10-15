import { schedule } from '@netlify/functions';
import { neon } from '@neondatabase/serverless';

export const handler = schedule('*/5 * * * *', async () => {
  try {
    const sql = neon(process.env.NEON_DATABASE_URL!);
    await sql`SELECT 1`;
    console.log('Database pinged successfully');
    return { statusCode: 200 };
  } catch (error) {
    console.error('Ping failed:', error);
    return { statusCode: 500 };
  }
});
