import { Handler } from '@netlify/functions';
import supertokens from 'supertokens-node';
import { middleware } from 'supertokens-node/framework/awsLambda';
import ThirdPartyEmailPassword from 'supertokens-node/recipe/thirdpartyemailpassword';
import Session from 'supertokens-node/recipe/session';

supertokens.init({
  framework: 'awsLambda',
  supertokens: {
    connectionURI: process.env.SUPERTOKENS_CONNECTION_URI!,
    apiKey: process.env.SUPERTOKENS_API_KEY
  },
  appInfo: {
    appName: 'DJ Elite',
    apiDomain: process.env.URL!,
    websiteDomain: process.env.URL!,
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
              clientId: process.env.GOOGLE_CLIENT_ID!,
              clientSecret: process.env.GOOGLE_CLIENT_SECRET!
            }]
          }
        }
      ]
    }),
    Session.init()
  ]
});

export const handler: Handler = async (event, context) => {
  return await middleware()(event, context);
};