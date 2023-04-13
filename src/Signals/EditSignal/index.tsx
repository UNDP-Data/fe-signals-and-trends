import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useIsAuthenticated,
} from '@azure/msal-react';
import axios, { AxiosError } from 'axios';
import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { SignalEntryFormEl } from '../../Components/SignalEntryFormEl';
import { SignInButton } from '../../Components/SignInButton';
import { API_ACCESS_TOKEN } from '../../Constants';
import Context from '../../Context/Context';
import { SignalDataType } from '../../Types';

export function EditSignal() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { role } = useContext(Context);
  const [signal, setSignal] = useState<SignalDataType | undefined>(undefined);
  const isAuthenticated = useIsAuthenticated();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [err, setError] = useState<any>(undefined);
  useEffect(() => {
    if (isAuthenticated) {
      axios
        .get(
          `https://signals-and-trends-api.azurewebsites.net/v1/signals/fetch?ids=${id}`,
          {
            headers: {
              access_token: API_ACCESS_TOKEN,
            },
          },
        )
        .catch((error: AxiosError) => {
          setError(error.toJSON());
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .then((response: any) => {
          setSignal(response.data[0]);
        });
    }
  }, [id, isAuthenticated]);
  return (
    <div
      className='undp-container flex-wrap margin-bottom-13'
      style={{ maxWidth: '64rem', padding: '0 1rem', marginTop: '10rem' }}
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
        <h3 className='undp-typography margin-top-05'>
          Edit Signal{signal ? `: ${signal.headline}` : null}
        </h3>
        {role === 'Visitor' ? (
          <p className='undp-typography' style={{ color: 'var(--dark-red)' }}>
            You don&apos;t have enough right to edit a trend
          </p>
        ) : (
          <>
            {err ? (
              <p
                className='undp-typography margin-top-07 padding-top-07 padding-bottom-07'
                style={{
                  textAlign: 'center',
                  backgroundColor: 'var(--gray-200)',
                  color: 'var(--dark-red)',
                }}
              >
                Error {err.status}: There is an error loading the signal please
                try again
              </p>
            ) : null}
            {!err && !signal ? (
              <div className='undp-loader-container'>
                <div className='undp-loader' />
              </div>
            ) : signal ? (
              <SignalEntryFormEl updateSignal={signal} />
            ) : null}
          </>
        )}
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <div
          className='flex-div flex-wrap flex-hor-align-center'
          style={{ flexDirection: 'column' }}
        >
          <h6 className='undp-typography margin-bottom-03'>
            Please login to edit a signal
          </h6>
          <SignInButton />
        </div>
      </UnauthenticatedTemplate>
    </div>
  );
}