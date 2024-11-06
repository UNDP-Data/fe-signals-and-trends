import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useIsAuthenticated,
} from '@azure/msal-react';
import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { SignInButton } from '../../Components/SignInButton';
import { TrendEntryFormEl } from '../../Components/TrendEntryFormEl';
import Context from '../../Context/Context';
import { TrendDataType } from '../../Types';
import { readTrend } from '../../API';

export function EditTrend() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { role } = useContext(Context);
  const [trend, setTrend] = useState<TrendDataType | undefined>(undefined);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [error, setError] = useState<any>(undefined);
  const isAuthenticated = useIsAuthenticated();
  useEffect(() => {
    if (isAuthenticated) {
      setError(undefined);

      readTrend(Number(id))
        .then(response => {
          setTrend(response);
        })
        .catch(err => {
          setError(
            `${err}: ${
              err.response?.status === 404
                ? 'No trend available with the selected ID'
                : err.response?.data
            }. ${
              err.response?.status === 500
                ? 'Please try again in some time'
                : ''
            }`,
          );
        });
    }
  }, [id, isAuthenticated]);
  return (
    <div
      className='undp-container flex-wrap margin-bottom-09'
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
          Edit Trend{trend ? `: ${trend.headline}` : null}
        </h3>
        {role === 'User' ? (
          <p className='undp-typography' style={{ color: 'var(--dark-red)' }}>
            Admin or curator rights required to edit a trend
          </p>
        ) : (
          <>
            {error ? (
              <p
                className='undp-typography margin-top-07 padding-top-07 padding-bottom-07'
                style={{
                  textAlign: 'center',
                  backgroundColor: 'var(--gray-200)',
                  color: 'var(--dark-red)',
                }}
              >
                {error}
              </p>
            ) : null}
            {!error && !trend ? (
              <div className='undp-loader-container'>
                <div className='undp-loader' />
              </div>
            ) : trend ? (
              <TrendEntryFormEl updateTrend={trend} />
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
            Please login to edit a trend
          </h6>
          <SignInButton />
        </div>
      </UnauthenticatedTemplate>
    </div>
  );
}
