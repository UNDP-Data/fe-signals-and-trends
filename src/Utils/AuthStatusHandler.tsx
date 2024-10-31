import { PublicClientApplication } from '@azure/msal-browser';
import { msalConfig } from '../Config';
import { CLIENT_ID } from '../Constants';

export function signOutClickHandler() {
  const msalInstance = new PublicClientApplication(msalConfig);
  const logoutRequest = {
    postLogoutRedirectUri: '/',
  };
  localStorage.removeItem('token');
  localStorage.removeItem('tokenExp');
  msalInstance.logoutRedirect(logoutRequest);
}

export async function refreshHandler() {
  const msalInstance = new PublicClientApplication(msalConfig);

  const res = await msalInstance.acquireTokenSilent({
    scopes: [`${CLIENT_ID}/.default`],
  });

  return [res.accessToken, res.expiresOn];
}
