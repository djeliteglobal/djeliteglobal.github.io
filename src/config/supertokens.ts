import ThirdPartyEmailPassword from 'supertokens-auth-react/recipe/thirdpartyemailpassword';
import Session from 'supertokens-auth-react/recipe/session';

const apiDomain = 'https://supertokens.io/dev';
const websiteDomain = window.location.origin;

console.log('🔧 SuperTokens Config:', {
  apiDomain,
  websiteDomain,
  apiBasePath: '/auth',
  websiteBasePath: '/auth'
});

export const SuperTokensConfig = {
  appInfo: {
    appName: 'DJ Elite',
    apiDomain,
    websiteDomain,
    apiBasePath: '/auth',
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