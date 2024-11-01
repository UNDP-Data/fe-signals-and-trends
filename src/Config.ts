import { CLIENT_ID } from './Constants';

export const msalConfig = {
  auth: {
    clientId: CLIENT_ID as string,
    clientSecret: process.env.INPUT_CLIENT_SECRET_FOR_MSAL as string,
    redirectUri: '/',
    postLogoutRedirectUri: '/',
    authority:
      'https://login.microsoftonline.com/b3e5db5e-2944-4837-99f5-7488ace54319',
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: false,
  },
};

export const loginRequest = {
  scopes: [`${CLIENT_ID}/.default`],
  prompt: 'select_account',
  extraQueryParameters: {
    prompt: 'consent',
  },
};
