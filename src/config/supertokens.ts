import ThirdPartyEmailPassword from 'supertokens-auth-react/recipe/thirdpartyemailpassword';
import Session from 'supertokens-auth-react/recipe/session';

export const SuperTokensConfig = {
  appInfo: {
    appName: 'DJ Elite',
    apiDomain: import.meta.env.VITE_API_DOMAIN || window.location.origin,
    websiteDomain: window.location.origin,
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
      }
    }),
    Session.init()
  ]
};