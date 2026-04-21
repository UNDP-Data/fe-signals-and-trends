import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
} from '@azure/msal-react';
import { Pagination } from 'antd';
import type { PaginationProps } from 'antd';
import { useContext, useState } from 'react';
import { SignInButton } from '../Components/SignInButton';
import { SignalCard } from '../Components/SignalCard';
import Context from '../Context/Context';
import { useFavorites } from '../Hooks/useFavorites';

export function MyFavorites() {
  const { updateSignalList } = useContext(Context);
  const [paginationValue, setPaginationValue] = useState(1);
  const [pageSize, setPageSize] = useState(20);

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

  const onShowSizeChange: PaginationProps['onShowSizeChange'] = (
    _current,
    size,
  ) => {
    setPageSize(size);
  };

  const paginatedSignals = (favoriteSignals || []).slice(
    (paginationValue - 1) * pageSize,
    paginationValue * pageSize,
  );

  return (
    <div
      className='margin-bottom-09'
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
        ) : isLoading ? (
          <div className='undp-loader-container'>
            <div className='undp-loader' />
          </div>
        ) : (
          <div>
            <h3 className='undp-typography margin-top-05'>My Favorites</h3>
            <div className='flex-div flex-wrap listing'>
              {favoriteSignals && favoriteSignals.length > 0 ? (
                paginatedSignals.map(signal => (
                  <SignalCard
                    data={signal}
                    key={signal.id}
                  />
                ))
              ) : (
                <h5
                  className='undp-typography bold'
                  style={{
                    backgroundColor: 'var(--gray-200)',
                    textAlign: 'center',
                    padding: 'var(--spacing-07)',
                    width: 'calc(100% - 4rem)',
                    border: '1px solid var(--gray-400)',
                  }}
                >
                  You haven&apos;t added any favorite signals yet.
                </h5>
              )}
            </div>
            {favoriteSignals && favoriteSignals.length > 0 ? (
              <div className='flex-div flex-hor-align-center margin-top-07 undp-pagination-shell'>
                <Pagination
                  className='undp-pagination'
                  onChange={e => {
                    setPaginationValue(e);
                  }}
                  defaultCurrent={1}
                  current={paginationValue}
                  total={favoriteSignals.length}
                  pageSize={pageSize}
                  showSizeChanger
                  onShowSizeChange={onShowSizeChange}
                />
              </div>
            ) : null}
          </div>
        )}
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <SignInButton buttonText='Sign In to View Admin Panel' />
      </UnauthenticatedTemplate>
    </div>
  );
}
