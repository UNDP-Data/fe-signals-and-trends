import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useIsAuthenticated,
} from '@azure/msal-react';
import { useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { SignalEntryFormEl } from '../../Components/SignalEntryFormEl';
import { SignInButton } from '../../Components/SignInButton';
import Context from '../../Context/Context';
import { SignalDataType, StatusDataType } from '../../Types';
import { readSignal, updateSignal as updateSignalApi } from '../../API';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function EditSignal() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { role, updateNotificationText } = useContext(Context);
  const isAuthenticated = useIsAuthenticated();
  const queryClient = useQueryClient();

  // Fetch the signal using React Query
  const {
    data: signal,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['signal', id],
    queryFn: () => readSignal(Number(id)),
    enabled: isAuthenticated && !!id,
  });

  console.log({signal});

  // Mutation for updating the signal
  const updateSignalMutation = useMutation({
    mutationFn: (data: any) =>
      updateSignalApi(Number(id), {
        ...data,
        created_by: data.created_by || '',
      }),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['signal', id] });
      // Navigate depending on status
      if (variables.status === 'Draft') {
        navigate('/my-drafts');
        updateNotificationText('Successfully saved the signal to draft');
      } else {
        navigate('/signals');
        updateNotificationText('Successfully submitted the signal for review');
      }
    },
    onError: (err: any) => {
      updateNotificationText(
        `${err}. ${err.response?.status === 500 ? 'Please try again in some time' : ''}`
      );
    },
  });

  // Handler for form submission
  const handleSubmit = async (data: any) => {
    return new Promise<void>((resolve, reject) => {
      updateSignalMutation.mutate(data, {
        onSuccess: () => resolve(),
        onError: () => reject(),
      });
    });
  };

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
          Edit Signal
          {signal && signal.headline ? `: ${signal.headline}` : ''}
        </h3>
        {isLoading ? (
          <div className='undp-loader-container'>
            <div className='undp-loader' />
          </div>
        ) : isError ? (
          <p
            className='undp-typography margin-top-07 padding-top-07 padding-bottom-07'
            style={{
              textAlign: 'center',
              backgroundColor: 'var(--gray-200)',
              color: 'var(--dark-red)',
            }}
          >
            Error: There is an error loading the signal please try again
          </p>
        ) : signal && signal.status !== 'Draft' ? (
          role === 'User' ? (
            <p className='undp-typography' style={{ color: 'var(--dark-red)' }}>
              Admin or curator rights required to edit a signal
            </p>
          ) : (
            <SignalEntryFormEl
              updateSignal={signal}
              draft={signal.status === 'Draft'}
              onSubmit={handleSubmit}
            />
          )
        ) : signal ? (
          <SignalEntryFormEl
            updateSignal={signal}
            draft={signal.status === 'Draft'}
            onSubmit={handleSubmit}
          />
        ) : null}
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
