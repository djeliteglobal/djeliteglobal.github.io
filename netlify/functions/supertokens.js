const supertokens = require('supertokens-node');
const { middleware } = require('supertokens-node/framework/awsLambda');
const ThirdPartyEmailPassword = require('supertokens-node/recipe/thirdpartyemailpassword');
const Session = require('supertokens-node/recipe/session');

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
      connectionURI: requiredEnvVars.SUPERTOKENS_CONNECTION_URI,
      apiKey: requiredEnvVars.SUPERTOKENS_API_KEY
    },
    appInfo: {
      appName: 'DJ Elite',
      apiDomain: requiredEnvVars.URL,
      websiteDomain: requiredEnvVars.URL,
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
                clientId: requiredEnvVars.GOOGLE_CLIENT_ID,
                clientSecret: requiredEnvVars.GOOGLE_CLIENT_SECRET
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

exports.handler = async (event, context) => {
  try {
    console.log('📥 SuperTokens request:', {
      path: event.path,
      rawPath: event.rawUrl,
      method: event.httpMethod,
      headers: Object.keys(event.headers)
    });
    
    // Health check endpoint
    if (event.path.includes('/health')) {
      return {
        statusCode: 200,
        body: JSON.stringify({ status: 'ok', message: 'SuperTokens function is running' })
      };
    }
    
    // Ensure path starts with /api/auth for SuperTokens
    let authPath = event.path;
    if (authPath.includes('/.netlify/functions/supertokens')) {
      authPath = authPath.replace('/.netlify/functions/supertokens', '');
    }
    if (!authPath.startsWith('/api/auth')) {
      authPath = '/api/auth' + authPath;
    }
    
    const modifiedEvent = {
      ...event,
      path: authPath
    };
    
    console.log('🔄 Modified path:', modifiedEvent.path);
    
    const result = await middleware()(modifiedEvent, context);
    
    console.log('📤 SuperTokens response:', {
      statusCode: result.statusCode,
      headers: result.headers ? Object.keys(result.headers) : []
    });
    
    return result;
  } catch (error) {
    console.error('❌ SuperTokens handler error:', error);
    console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack');
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      })
    };
  }
};
