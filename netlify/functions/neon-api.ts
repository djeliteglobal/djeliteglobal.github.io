import { neon } from '@neondatabase/serverless';

const executeWithRetry = async (sql: any, query: string, params: any[], retries = 2) => {
  for (let i = 0; i <= retries; i++) {
    try {
      return await sql(query, params);
    } catch (error: any) {
      if (i === retries || !error.message?.includes('timeout')) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
};

export const handler = async (event: any) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const sql = neon(process.env.NEON_DATABASE_URL!);
    const { query, params = [] } = JSON.parse(event.body);
    
    const result = await executeWithRetry(sql, query, params);
    
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: result })
    };
  } catch (error: any) {
    console.error('Neon API Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || 'Database error' })
    };
  }
};