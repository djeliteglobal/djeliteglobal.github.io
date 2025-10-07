import { Handler } from '@netlify/functions';
import supertokens from 'supertokens-node';
import { middleware } from 'supertokens-node/framework/awsLambda';
import ThirdPartyEmailPassword from 'supertokens-node/recipe/thirdpartyemailpassword';
import Session from 'supertokens-node/recipe/session';

// Validate environment variables
const requiredEnvVars = {
  SUPERTOKENS_CONNECTION_URI: process.env.SUPERTOKENS_CONNECTION_URI,
  SUPERTOKENS_API_KEY: process.env.SUPERTOKENS_API_KEY,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  URL: process.env.URL
};

console.log('🔍 SuperTokens Backend - Environment Check:', {
  hasConnectionURI: !!requiredEnvVars.SUPERTOKENS_CONNECTION_URI,
  hasApiKey: !!requiredEnvVars.SUPERTOKENS_API_KEY,
  hasGoogleClientId: !!requiredEnvVars.GOOGLE_CLIENT_ID,
  hasGoogleClientSecret: !!requiredEnvVars.GOOGLE_CLIENT_SECRET,
  url: requiredEnvVars.URL
});

const missingVars = Object.entries(requiredEnvVars)
  .filter(([_, value]) => !value)
  .map(([key]) => key);

if (missingVars.length > 0) {
  console.error('❌ Missing environment variables:', missingVars);
  throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
}

try {
  supertokens.init({
    framework: 'awsLambda',
    supertokens: {
      connectionURI: requiredEnvVars.SUPERTOKENS_CONNECTION_URI!,
      apiKey: requiredEnvVars.SUPERTOKENS_API_KEY
    },
    appInfo: {
      appName: 'DJ Elite',
      apiDomain: requiredEnvVars.URL!,
      websiteDomain: requiredEnvVars.URL!,
      apiBasePath: '/api/auth',
      websiteBasePath: '/auth'
    },
    recipeList: [
      ThirdPartyEmailPassword.init({
        providers: [
          {
            config: {
              thirdPartyId: 'google',
              clients: [{
                clientId: requiredEnvVars.GOOGLE_CLIENT_ID!,
                clientSecret: requiredEnvVars.GOOGLE_CLIENT_SECRET!
              }]
            }
          }
        ]
      }),
      Session.init()
    ]
  });
  console.log('✅ SuperTokens backend initialized successfully');
} catch (error) {
  console.error('❌ SuperTokens backend initialization failed:', error);
  throw error;
}

export const handler: Handler = async (event, context) => {
  try {
    console.log('📥 SuperTokens request:', {
      path: event.path,
      method: event.httpMethod,
      headers: Object.keys(event.headers)
    });
    
    const result = await middleware()(event, context);
    
    console.log('📤 SuperTokens response:', {
      statusCode: result.statusCode
    });
    
    return result;
  } catch (error) {
    console.error('❌ SuperTokens handler error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      })
    };
  }
};