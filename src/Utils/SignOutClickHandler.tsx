import { PublicClientApplication } from '@azure/msal-browser';
import { msalConfig } from '../Config';

export function signOutClickHandler() {
  const msalInstance = new PublicClientApplication(msalConfig);
  const logoutRequest = {
    postLogoutRedirectUri: '/',
  };
  msalInstance.logoutRedirect(logoutRequest);
}
