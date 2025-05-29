import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
} from '@azure/msal-react';
import { useContext } from 'react';
import { SignInButton } from '../Components/SignInButton';
import { SignalsList } from '../Components/SignalViews';
import Context from '../Context/Context';
import { useFavorites } from '../Hooks/useFavorites';

export function MyFavorites() {
  const { updateSignalList } = useContext(Context);

  const {
    data: favoriteSignals,
    error,
    isLoading,
  } = useFavorites({
    page: 1, // Default to first page
    pageSize: 100, // Use a large page size to get all favorites
    onSuccess: (data) => {
      updateSignalList(data);
    },
  });

  return (
    <div
      className='margin-top-13 padding-top-09 margin-bottom-09'
      style={{ paddingLeft: '1rem', paddingRight: '1rem' }}
    >
      <AuthenticatedTemplate>
        {error ? (
          <p
            className='margin-top-00 margin-bottom-00'
            style={{ color: 'var(--dark-red)' }}
          >
            {error instanceof Error ? error.message : 'An error occurred while fetching favorites'}
          </p>
        ) : (
          <SignalsList
            signals={favoriteSignals || []}
            title="My Favorites"
            loading={isLoading}
            emptyStateMessage="You haven't added any favorite signals yet."
            showViewToggle={true}
            showPagination={true}
          />
        )}
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <SignInButton buttonText='Sign In to View Admin Panel' />
      </UnauthenticatedTemplate>
    </div>
  );
}
