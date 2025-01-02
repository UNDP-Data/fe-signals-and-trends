import { useContext, useEffect, useState } from 'react';
import { Pagination, PaginationProps } from 'antd';
import sortBy from 'lodash.sortby';
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
} from '@azure/msal-react';
import { SignInButton } from '../Components/SignInButton';
import Context from '../Context/Context';
import { searchSignals } from '../API';
import { FavoriteCardList } from '../Signals/AllSignals/FavoriteGridView';

export function MyFavorites() {
  const { userName, signalList, updateSignalList } = useContext(Context);
  const [paginationValue, setPaginationValue] = useState(1);
  const [error, setError] = useState<undefined | string>(undefined);
  const [pageSize, setPageSize] = useState(20);
  const [totalNoOfPages, setTotalNoOfPages] = useState(0);
  useEffect(() => {
    setError(undefined);
    updateSignalList(undefined);
    searchSignals({
      page: paginationValue,
      per_page: pageSize,
      statuses: ['Created'],
      created_by: userName,
    })
      .then(response => {
        updateSignalList(
          sortBy(response.data, d => Date.parse(d.created_at)).reverse(),
        );
      })
      .catch(err => {
        if (err.response?.status === 404) {
          updateSignalList([]);
        } else {
          setError(
            `${err}. ${
              err.response?.status === 500
                ? 'Please try again in some time'
                : ''
            }`,
          );
        }
      });
  }, [paginationValue]);
  useEffect(() => {
    setError(undefined);
    updateSignalList(undefined);
    searchSignals({
      page: 1,
      per_page: pageSize,
      statuses: ['Created'],
      created_by: userName,
    })
      .then(response => {
        updateSignalList(
          sortBy(response.data, d => Date.parse(d.created_at)).reverse(),
        );
        setPaginationValue(1);
        setTotalNoOfPages(response.total_pages);
      })
      .catch(err => {
        if (err.response?.status === 404) {
          updateSignalList([]);
        } else {
          setError(
            `${err}. ${
              err.response?.status === 500
                ? 'Please try again in some time'
                : ''
            }`,
          );
        }
      });
  }, [userName, pageSize]);
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
        {signalList ? (
          <div>
            <h3 className='undp-typography margin-top-05'>My Favorites</h3>
            <div className='flex-div flex-wrap listing'>
              {signalList.length > 0 ? (
                <FavoriteCardList />
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
                  Opps... You have no favorite signals
                </h5>
              )}
            </div>
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
          </div>
        ) : error ? (
          <p
            className='margin-top-00 margin-bottom-00'
            style={{ color: 'var(--dark-red)' }}
          >
            {error}
          </p>
        ) : (
          <div className='undp-loader-container'>
            <div className='undp-loader' />
          </div>
        )}
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <SignInButton buttonText='Sign In to View Admin Panel' />
      </UnauthenticatedTemplate>
    </div>
  );
}
