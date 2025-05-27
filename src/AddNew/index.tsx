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
import { AddNewSprintEl } from './AddNewSprintEl';

// Helper function to map short STEEP+V names to full format
const mapSteepToFullFormat = (
  shortName: string | null,
  steepOptions: string[] | undefined,
) => {
  if (!shortName || !steepOptions) return undefined;

  return steepOptions.find(option => option.startsWith(shortName));
};

// Helper function to map short SDG names to full format
const mapSDGToFullFormat = (
  shortNames: string[] | undefined,
  sdgOptions: string[] | undefined,
) => {
  if (!shortNames || !sdgOptions) return [];

  return shortNames
    .map(
      shortName => sdgOptions.find(option => option.includes(shortName)) || '',
    )
    .filter(Boolean);
};

export function AddNewSignalEl() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { choices } = useContext(Context);

  // Parse query parameters for initial form data
  const initialFormData = {
    headline: searchParams.get('headline') || undefined,
    description: searchParams.get('description') || undefined,
    url: searchParams.get('url') || undefined,
    location: searchParams.get('location') || undefined,
    secondary_location: searchParams.get('secondary_location')
      ? ([searchParams.get('secondary_location')].filter(Boolean) as string[])
      : [],
    steep_primary: mapSteepToFullFormat(
      searchParams.get('steep_primary'),
      choices?.steep,
    ),
    signature_primary: searchParams.get('signature_primary') || undefined,
    relevance: searchParams.get('relevance') || undefined,
    created_unit: searchParams.get('created_unit') || undefined,
    keywords: [
      searchParams.get('keyword1'),
      searchParams.get('keyword2'),
      searchParams.get('keyword3'),
    ].filter(Boolean) as string[],
    sdgs: mapSDGToFullFormat(
      searchParams.get('sdgs')?.split(',').filter(Boolean),
      choices?.goal,
    ),
  };

  return (
    <div
      // className='undp-container flex-wrap margin-bottom-09'
      // style={{ maxWidth: '64rem', padding: '0 2rem', marginTop: '10rem' }}
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
        <SignalEntryFormEl draft={false} initialData={initialFormData} />
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
  const { role } = useContext(Context);
  return (
    <div
      className='flex-wrap margin-bottom-09'
      style={{ maxWidth: '64rem', padding: '0 2rem', marginTop: '10rem' }}
    >
      <h3 className='undp-typography margin-top-05'>Add New Trend</h3>
      {role === 'User' ? (
        <p className='undp-typography' style={{ color: 'var(--dark-red)' }}>
          You don&apos;t have enough right to add a trend
        </p>
      ) : (
        <TrendEntryFormEl />
      )}
    </div>
  );
}

export { AddNewSprintEl };
