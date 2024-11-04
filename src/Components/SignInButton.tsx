import { IPublicClientApplication } from '@azure/msal-browser';
import { useMsal } from '@azure/msal-react';
import { loginRequest } from '../AuthConfig';

interface Props {
  buttonText?: string;
}

function signInClickHandler(instance: IPublicClientApplication) {
  instance.loginRedirect(loginRequest);
}

export function SignInButton(props: Props) {
  const { buttonText } = props;
  const { instance } = useMsal();
  return (
    <button
      className='undp-button button-secondary button-arrow'
      onClick={() => signInClickHandler(instance)}
      type='button'
      style={{ width: 'fit-content' }}
    >
      {buttonText || 'Sign in'}
    </button>
  );
}
