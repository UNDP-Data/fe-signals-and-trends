import { useContext, useEffect, useState } from 'react';
import axios, { AxiosResponse } from 'axios';
import { Pagination, PaginationProps } from 'antd';
import sortBy from 'lodash.sortby';
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
} from '@azure/msal-react';
import { SignInButton } from '../Components/SignInButton';
import Context from '../Context/Context';
import { CardList } from '../Signals/AllSignals/GridView';

export function MyDrafts() {
  const { accessToken, userName, signalList, updateSignalList } =
    useContext(Context);
  const [paginationValue, setPaginationValue] = useState(1);
  const [error, setError] = useState<undefined | string>(undefined);
  const [pageSize, setPageSize] = useState(20);
  const [totalNoOfPages, setTotalNoOfPages] = useState(0);
  useEffect(() => {
    setError(undefined);
    updateSignalList(undefined);
    axios
      .get(
        `https://signals-and-trends-api.azurewebsites.net/v1/signals/list?&page=${paginationValue}&per_page=${pageSize}&statuses=Draft&created_by=${userName}`,
        {
          headers: {
            access_token: accessToken,
          },
        },
      )
      .then((response: AxiosResponse) => {
        updateSignalList(
          sortBy(response.data.data, d => Date.parse(d.created_at)).reverse(),
        );
      })
      .catch(err => {
        if (err.response?.status === 404) {
          updateSignalList([]);
        } else {
          setError(
            `Error code ${err.response?.status}: ${err.response?.data}. ${
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
    axios
      .get(
        `https://signals-and-trends-api.azurewebsites.net/v1/signals/list?&page=1&per_page=${pageSize}&statuses=Draft&created_by=${userName}`,
        {
          headers: {
            access_token: accessToken,
          },
        },
      )
      .then((response: AxiosResponse) => {
        updateSignalList(
          sortBy(response.data.data, d => Date.parse(d.created_at)).reverse(),
        );
        setPaginationValue(1);
        setTotalNoOfPages(response.data.total_pages);
      })
      .catch(err => {
        if (err.response?.status === 404) {
          updateSignalList([]);
        } else {
          setError(
            `Error code ${err.response?.status}: ${err.response?.data}. ${
              err.response?.status === 500
                ? 'Please try again in some time'
                : ''
            }`,
          );
        }
      });
  }, [accessToken, userName, pageSize]);
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
            <h3 className='undp-typography margin-top-05'>My Drafts</h3>
            <div className='flex-div flex-wrap listing'>
              {signalList.length > 0 ? (
                <CardList />
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
                  No signals available matching your criteria
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
