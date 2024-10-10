import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
} from '@azure/msal-react';
import { LoggedOutHeader } from './LoggedOutHeader';
import { LoggedInHeader } from './LoggedInHeader';

interface Props {
  signOutClickHandler: () => void;
  loginError?: boolean;
}

export function Header(props: Props) {
  const { signOutClickHandler, loginError } = props;

  return (
    <>
      <AuthenticatedTemplate>
        {loginError ? (
          <LoggedOutHeader />
        ) : (
          <LoggedInHeader signOutClickHandler={signOutClickHandler} />
        )}
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <LoggedOutHeader />
      </UnauthenticatedTemplate>
    </>
  );
}
