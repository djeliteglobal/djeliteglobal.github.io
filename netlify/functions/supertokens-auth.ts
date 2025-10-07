import { Handler } from '@netlify/functions';
import supertokens from 'supertokens-node';
import { middleware } from 'supertokens-node/framework/awsLambda';
import ThirdPartyEmailPassword from 'supertokens-node/recipe/thirdpartyemailpassword';
import Session from 'supertokens-node/recipe/session';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.VITE_NEON_DATABASE_URL!);

supertokens.init({
  framework: 'awsLambda',
  supertokens: {
    connectionURI: process.env.SUPERTOKENS_CONNECTION_URI || 'https://try.supertokens.com',
    apiKey: process.env.SUPERTOKENS_API_KEY
  },
  appInfo: {
    appName: 'DJ Elite',
    apiDomain: process.env.URL || 'http://localhost:8888',
    websiteDomain: process.env.URL || 'http://localhost:5173',
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
        },
        {
          config: {
            thirdPartyId: 'facebook',
            clients: [{
              clientId: process.env.FACEBOOK_CLIENT_ID!,
              clientSecret: process.env.FACEBOOK_CLIENT_SECRET!
            }]
          }
        },
        {
          config: {
            thirdPartyId: 'spotify',
            clients: [{
              clientId: process.env.SPOTIFY_CLIENT_ID!,
              clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
              scope: ['user-read-email']
            }],
            authorizationEndpoint: 'https://accounts.spotify.com/authorize',
            tokenEndpoint: 'https://accounts.spotify.com/api/token',
            userInfoEndpoint: 'https://api.spotify.com/v1/me'
          }
        },
        {
          config: {
            thirdPartyId: 'discord',
            clients: [{
              clientId: process.env.DISCORD_CLIENT_ID!,
              clientSecret: process.env.DISCORD_CLIENT_SECRET!,
              scope: ['identify', 'email']
            }],
            authorizationEndpoint: 'https://discord.com/api/oauth2/authorize',
            tokenEndpoint: 'https://discord.com/api/oauth2/token',
            userInfoEndpoint: 'https://discord.com/api/users/@me'
          }
        }
      ],
      override: {
        functions: (originalImplementation) => {
          return {
            ...originalImplementation,
            signUp: async function (input) {
              const response = await originalImplementation.signUp(input);
              
              if (response.status === 'OK') {
                await sql`
                  INSERT INTO users (id, email, provider, created_at)
                  VALUES (${response.user.id}, ${response.user.email}, 'email', NOW())
                `;
                
                await sql`
                  INSERT INTO profiles (user_id, dj_name, email)
                  VALUES (${response.user.id}, ${response.user.email.split('@')[0]}, ${response.user.email})
                `;
              }
              
              return response;
            },
            thirdPartySignInUp: async function (input) {
              const response = await originalImplementation.thirdPartySignInUp(input);
              
              if (response.status === 'OK') {
                await sql`
                  INSERT INTO users (id, email, provider, provider_id, created_at)
                  VALUES (${response.user.id}, ${response.user.email}, ${response.user.thirdParty.id}, ${response.user.thirdParty.userId}, NOW())
                  ON CONFLICT (id) DO UPDATE SET last_sign_in_at = NOW()
                `;
                
                await sql`
                  INSERT INTO profiles (user_id, dj_name, email)
                  VALUES (${response.user.id}, ${response.user.email.split('@')[0]}, ${response.user.email})
                  ON CONFLICT (user_id) DO NOTHING
                `;
              }
              
              return response;
            }
          };
        }
      }
    }),
    Session.init()
  ]
});

export const handler: Handler = async (event, context) => {
  return await middleware()(event, context);
};
