import { PublicClientApplication } from '@azure/msal-browser';
import { msalConfig } from '../AuthConfig';
import { CLIENT_ID } from '../Constants';

const msalInstance = new PublicClientApplication(msalConfig);

export function signOutClickHandler() {
  const logoutRequest = {
    postLogoutRedirectUri: '/',
  };
  localStorage.removeItem('token');
  localStorage.removeItem('tokenExp');
  msalInstance.logoutRedirect(logoutRequest);
}

export async function refreshHandler() {
  try {
    const res = await msalInstance.acquireTokenSilent({
      scopes: [`${CLIENT_ID}/.default`],
    });

    return [res.accessToken, res.expiresOn];
  } catch (error) {
    localStorage.removeItem('token');
    return [];
  }
}
