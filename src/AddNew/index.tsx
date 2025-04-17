import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
} from '@azure/msal-react';
import { useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { SignalEntryFormEl } from '../Components/SignalEntryFormEl';
import { SignInButton } from '../Components/SignInButton';
import { TrendEntryFormEl } from '../Components/TrendEntryFormEl';
import Context from '../Context/Context';

export function AddNewSignalEl() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Parse query parameters for initial form data
  const initialFormData = {
    headline: searchParams.get('headline') || undefined,
    description: searchParams.get('description') || undefined,
    url: searchParams.get('url') || undefined,
    location: searchParams.get('location') || undefined,
    steep_primary: searchParams.get('steep_primary') || undefined,
    signature_primary: searchParams.get('signature_primary') || undefined,
    relevance: searchParams.get('relevance') || undefined,
    created_unit: searchParams.get('created_unit') || undefined,
    keywords: [
      searchParams.get('keyword1'),
      searchParams.get('keyword2'),
      searchParams.get('keyword3'),
    ].filter(Boolean) as string[],
    sdgs: searchParams.get('sdgs')?.split(',').filter(Boolean) || [],
  };

  return (
    <div
      className='undp-container flex-wrap margin-bottom-09'
      style={{ maxWidth: '64rem', padding: '0 2rem', marginTop: '10rem' }}
    >
      <AuthenticatedTemplate>
        <button
          className='undp-button button-tertiary'
          type='button'
          onClick={() => {
            navigate(-1);
          }}
        >
          ← Back
        </button>
        <h3 className='undp-typography margin-top-05'>Add New Signal</h3>
        <SignalEntryFormEl draft={false} />
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <div
          className='flex-div flex-wrap flex-hor-align-center'
          style={{ flexDirection: 'column' }}
        >
          <h6 className='undp-typography margin-bottom-03'>
            Please login to add a new a signal
          </h6>
          <SignInButton />
        </div>
      </UnauthenticatedTemplate>
    </div>
  );
}

export function AddNewTrendEl() {
  const navigate = useNavigate();
  const { role } = useContext(Context);
  return (
    <div
      className='undp-container flex-wrap margin-bottom-09'
      style={{ maxWidth: '64rem', padding: '0 2rem', marginTop: '10rem' }}
    >
      <AuthenticatedTemplate>
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
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <div
          className='flex-div flex-wrap flex-hor-align-center'
          style={{ flexDirection: 'column' }}
        >
          <h6 className='undp-typography margin-bottom-03'>
            Please login to add a new a trend
          </h6>
          <SignInButton />
        </div>
      </UnauthenticatedTemplate>
    </div>
  );
}
