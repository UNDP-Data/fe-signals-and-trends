import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
} from '@azure/msal-react';
import { Pagination, PaginationProps } from 'antd';
import { useContext, useState } from 'react';
import { SignalCard } from '../Components/SignalCard';
import { SignInButton } from '../Components/SignInButton';
import Context from '../Context/Context';
import { useFavorites } from '../Hooks/useFavorites';
import { SignalDataType } from '../Types';

const FavoritesList = ({ signals }: { signals: SignalDataType[] }) => {
  return (
    <>
      {signals.map((signal, index) => (
        <SignalCard key={`favorite-${signal.id}-${index}`} data={signal} />
      ))}
    </>
  );
};

export function MyFavorites() {
  const { updateSignalList } = useContext(Context);
  const [paginationValue, setPaginationValue] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const {
    data,
    error,
    isLoading,
  } = useFavorites({
    page: paginationValue,
    pageSize,
    onSuccess: (data) => {
      updateSignalList(data);
    },
  });

  // Safely handle the data as an array
  const favoriteSignals = data || [];

  const totalNoOfPages = favoriteSignals.length 
    ? Math.ceil(favoriteSignals.length / pageSize) 
    : 0;

  const onShowSizeChange: PaginationProps['onShowSizeChange'] = (
    _current,
    size,
  ) => {
    setPageSize(size);
  };

  return (
    <div
      className='margin-top-13 padding-top-09 margin-bottom-09'
      style={{ paddingLeft: '1rem', paddingRight: '1rem' }}
    >
      <AuthenticatedTemplate>
        {isLoading ? (
          <div className='undp-loader-container'>
            <div className='undp-loader' />
          </div>
        ) : error ? (
          <p
            className='margin-top-00 margin-bottom-00'
            style={{ color: 'var(--dark-red)' }}
          >
            {error instanceof Error ? error.message : 'An error occurred while fetching favorites'}
          </p>
        ) : (
          <div>
            <h3 className='undp-typography margin-top-05'>My Favorites</h3>
            <div className='flex-div flex-wrap listing'>
              {favoriteSignals.length > 0 ? (
                <FavoritesList signals={favoriteSignals} />
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
            {favoriteSignals.length > 0 && (
              <div className='flex-div flex-hor-align-center margin-top-07'>
                <Pagination
                  className='undp-pagination'
                  onChange={e => {
                    setPaginationValue(e);
                  }}
                  defaultCurrent={1}
                  current={paginationValue}
                  total={totalNoOfPages * pageSize}
                  pageSize={pageSize}
                  showSizeChanger
                  onShowSizeChange={onShowSizeChange}
                />
              </div>
            )}
          </div>
        )}
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <SignInButton buttonText='Sign In to View Admin Panel' />
      </UnauthenticatedTemplate>
    </div>
  );
}
