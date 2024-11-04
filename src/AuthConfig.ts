import { CLIENT_ID, CLIENT_SECRET, AUTHORITY } from './Constants';

export const msalConfig = {
  auth: {
    clientId: CLIENT_ID as string,
    authority: AUTHORITY as string,
    clientSecret: CLIENT_SECRET as string,
    redirectUri: '/',
    postLogoutRedirectUri: '/',
    navigateToLoginRequestUrl: false,
  },

  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: false,
  },

  piiLoggingEnabled: false,
};

export const loginRequest = {
  scopes: [`${CLIENT_ID}/.default`],
  prompt: 'select_account',
  extraQueryParameters: {
    prompt: 'consent',
  },
};
