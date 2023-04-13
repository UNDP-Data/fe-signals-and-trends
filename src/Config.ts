export const msalConfig = {
  auth: {
    clientId: 'b2654b80-5b9a-4452-bc77-f39f3e834d4d',
    redirectUri: import.meta.env.VITE_REDIRECT_URL,
    authority: 'https://login.microsoftonline.com/common',
  },
  cache: {
    cacheLocation: 'localStorage',
  },
};

// Add scopes here for ID token to be used at Microsoft identity platform endpoints.
export const loginRequest = {
  scopes: ['User.Read'],
};

export const graphConfig = {
  graphMeEndpoint: 'https://graph.microsoft.com/v1.0/me',
};