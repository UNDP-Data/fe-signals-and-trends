import { PublicClientApplication } from '@azure/msal-browser';
import { msalConfig } from '../AuthConfig';
import { CLIENT_ID } from '../Constants';
import { clearLocalStorage, getLocalStorage } from './UpdateLocalStrage';

const msalInstance = new PublicClientApplication(msalConfig);

export function signOutClickHandler() {
  const logoutRequest = {
    postLogoutRedirectUri: '/',
  };
  clearLocalStorage();
  msalInstance.logoutRedirect(logoutRequest);
}

export async function refreshHandler() {
  const { account } = getLocalStorage();
  if (account) {
    try {
      const res = await msalInstance.acquireTokenSilent({
        scopes: [`${CLIENT_ID}/.default`],
        account: JSON.parse(account),
      });
      return [res.accessToken, res.expiresOn];
    } catch (error) {
      clearLocalStorage();
      await signOutClickHandler();
      return [];
    }
  } else {
    clearLocalStorage();
    await signOutClickHandler();
    return [];
  }
}
