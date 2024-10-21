import { CLIENT_ID, REDIRECT_URL } from './Constants';

export const msalConfig = {
  auth: {
    clientId: CLIENT_ID as string,
    redirectUri: REDIRECT_URL as string,
    clientSecret: process.env.INPUT_CLIENT_SECRET_FOR_MSAL as string,
    authority:
      'https://login.microsoftonline.com/b3e5db5e-2944-4837-99f5-7488ace54319',
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: false,
  },
};
// Add scopes here for ID token to be used at Microsoft identity platform endpoints.
export const loginRequest = {
  scopes: [`${CLIENT_ID}/.default`],
  prompt: 'select_account', // This is optional, but useful to ensure the user is prompted to sign in
  extraQueryParameters: {
    prompt: 'consent',
  },
};
