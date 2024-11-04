import { IPublicClientApplication } from '@azure/msal-browser';
import { useMsal } from '@azure/msal-react';
import { loginRequest } from '../AuthConfig';

function signInClickHandler(instance: IPublicClientApplication) {
  instance.loginRedirect(loginRequest);
}

export function SignInButtonForHeader() {
  const { instance } = useMsal();
  return (
    <button
      className='undp-button button-secondary'
      onClick={() => signInClickHandler(instance)}
      type='button'
      style={{ width: 'fit-content' }}
    >
      Sign in
    </button>
  );
}
