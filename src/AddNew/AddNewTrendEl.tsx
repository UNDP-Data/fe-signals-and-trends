export const metadata = {
  title: 'Add New Trend',
  description: 'Add a new trend to the system.'
};

import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import Context from '../Context/Context';
import { AuthenticatedTemplate, UnauthenticatedTemplate } from '@azure/msal-react';
import { TrendEntryFormEl } from '../Components/TrendEntryFormEl';
import { SignInButton } from '../Components/SignInButton';

export function AddNewTrendEl() {
  const navigate = useNavigate();
  const { role } = useContext(Context);
  return (
    <>
      <button
          className='undp-button button-tertiary'
          type='button'
          onClick={() => {
            navigate(-1);
          }}
        >
          ← Back
        </button>
        <h3 className='undp-typography margin-top-05'>Add New Trend</h3>
        {role === 'User' ? (
          <p className='undp-typography' style={{ color: 'var(--dark-red)' }}>
            You don&apos;t have enough right to add a trend
          </p>
        ) : (
          <TrendEntryFormEl />
        )}
    </>
  );
} 