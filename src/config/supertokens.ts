import ThirdPartyEmailPassword from 'supertokens-auth-react/recipe/thirdpartyemailpassword';
import Session from 'supertokens-auth-react/recipe/session';

const apiDomain = import.meta.env.VITE_API_DOMAIN || window.location.origin;
const websiteDomain = window.location.origin;

console.log('🔧 SuperTokens Config:', {
  apiDomain,
  websiteDomain,
  apiBasePath: '/api/auth',
  websiteBasePath: '/auth'
});

export const SuperTokensConfig = {
  appInfo: {
    appName: 'DJ Elite',
    apiDomain,
    websiteDomain,
    apiBasePath: '/api/auth',
    websiteBasePath: '/auth'
  },
  recipeList: [
    ThirdPartyEmailPassword.init({
      signInAndUpFeature: {
        providers: [
          ThirdPartyEmailPassword.Google.init(),
          ThirdPartyEmailPassword.Facebook.init(),
        ]
      },
      onHandleEvent: async (context) => {
        console.log('🔐 SuperTokens Event:', context.action);
        if (context.action === 'SUCCESS') {
          console.log('✅ Auth successful:', context.user);
        }
      }
    }),
    Session.init({
      onHandleEvent: (context) => {
        console.log('📝 Session Event:', context.action);
      }
    })
  ]
};