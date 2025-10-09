import { Handler } from '@netlify/functions';

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    const formData = JSON.parse(event.body || '{}');
    
    // Log the submission (replace with actual database save)
    console.log('Agency signup:', formData);
    
    // TODO: Save to database
    // await saveAgencyApplication(formData);
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ 
        success: true, 
        message: 'Application submitted successfully' 
      })
    };
  } catch (error) {
    console.error('Agency signup error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};