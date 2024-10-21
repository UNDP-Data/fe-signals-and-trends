import { useContext, useEffect, useState } from 'react';
import { Modal, Pagination, PaginationProps } from 'antd';
import sortBy from 'lodash.sortby';
import axios, { AxiosResponse } from 'axios';
import { CardList } from './GridView';
import { ListView } from './ListView';
import { API_ACCESS_TOKEN } from '../../Constants';
import Context from '../../Context/Context';

interface Props {
  view: 'cardView' | 'listView';
  isArchived?: boolean;
}

export function AllTrends(props: Props) {
  const { view, isArchived } = props;
  const {
    role,
    accessToken,
    trendFilters,
    trendsSortBy,
    trendList,
    updateTrendList,
    cardsToPrint,
    updateCardsToPrint,
  } = useContext(Context);
  const [paginationValue, setPaginationValue] = useState(1);
  const [loading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState(20);
  const [totalCount, setTotalCount] = useState<undefined | number>(undefined);
  const [error, setError] = useState<undefined | string>(undefined);
  const onShowSizeChange: PaginationProps['onShowSizeChange'] = (
    _current,
    size,
  ) => {
    setPageSize(size);
  };
  const GetURL = (isExportLink: boolean) => {
    const steepPrimaryQueryParameter =
      trendFilters.steep_primary === 'All Primary STEEP+V'
        ? ''
        : `&steep_primary=${trendFilters.steep_primary}`;
    const steepSecondaryQueryParameter =
      trendFilters.steep_secondary === 'All Secondary STEEP+V'
        ? ''
        : `&steep_secondary=${trendFilters.steep_secondary}`;
    const ss1QueryParameter =
      trendFilters.signature_primary ===
      'All Primary Signature Solutions/Enabler'
        ? ''
        : `&signature_primary=${trendFilters.signature_primary.replaceAll(
            ' ',
            '%20',
          )}`;
    const ss2QueryParameter =
      trendFilters.signature_secondary ===
      'All Secondary Signature Solutions/Enabler'
        ? ''
        : `&signature_secondary=${trendFilters.signature_secondary.replaceAll(
            ' ',
            '%20',
          )}`;
    const sdgQueryParameter =
      trendFilters.sdg === 'All SDGs'
        ? ''
        : `&sdgs=${trendFilters.sdg.replaceAll(' ', '%20')}`;
    const createdForQueryParameter =
      trendFilters.created_for === 'All Options'
        ? ''
        : `&created_for=${trendFilters.created_for.replaceAll(' ', '%20')}`;
    const horizonQueryParameter =
      trendFilters.horizon === 'All Horizons'
        ? ''
        : `&time_horizon=${trendFilters.horizon.replace('+', '%2B')}`;
    const ratingQueryParameter =
      trendFilters.impact === 'All Ratings'
        ? ''
        : `&impact_rating=${trendFilters.impact}`;
    const statusQueryParameter = isArchived
      ? `statuses=Archived`
      : trendFilters.status === 'All Status'
      ? role === 'Admin' || role === 'Curator'
        ? 'statuses=Approved&statuses=New'
        : 'statuses=Approved'
      : `statuses=${trendFilters.status}`;
    const searchQueryParameter = trendFilters.search
      ? `&query=${trendFilters.search}`
      : '';
    const orderByQueryParameter = `&order_by_field=${
      isArchived ? 'modified_at' : trendsSortBy
    }&order_by_direction=${
      trendsSortBy === 'created_at' ||
      trendsSortBy === 'modified_at' ||
      isArchived
        ? 'desc'
        : 'asc'
    }`;
    const urlForExport = `https://signals-and-trends-api.azurewebsites.net/v1/export/trends?${statusQueryParameter}${steepPrimaryQueryParameter}${steepSecondaryQueryParameter}${sdgQueryParameter}${ss1QueryParameter}${ss2QueryParameter}${createdForQueryParameter}${horizonQueryParameter}${ratingQueryParameter}${searchQueryParameter}${orderByQueryParameter}`;
    const urlForListing = `https://signals-and-trends-api.azurewebsites.net/v1/trends/list?page=${paginationValue}&per_page=${pageSize}&${statusQueryParameter}${steepPrimaryQueryParameter}${steepSecondaryQueryParameter}${sdgQueryParameter}${ss1QueryParameter}${ss2QueryParameter}${createdForQueryParameter}${horizonQueryParameter}${ratingQueryParameter}${searchQueryParameter}${orderByQueryParameter}`;
    return isExportLink ? urlForExport : urlForListing;
  };
  useEffect(() => {
    updateTrendList(undefined);
    setError(undefined);
    axios
      .get(GetURL(false), {
        headers: {
          access_token: accessToken || API_ACCESS_TOKEN,
        },
      })
      .then((response: AxiosResponse) => {
        updateTrendList(
          sortBy(response.data.data, d => Date.parse(d.created_at)).reverse(),
        );
      })
      .catch(err => {
        if (err.response?.status === 404) {
          updateTrendList([]);
          setTotalCount(0);
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
    updateTrendList(undefined);
    setError(undefined);
    axios
      .get(GetURL(false), {
        headers: {
          access_token: accessToken || API_ACCESS_TOKEN,
        },
      })
      .then((response: AxiosResponse) => {
        updateTrendList(
          sortBy(response.data.data, d => Date.parse(d.created_at)).reverse(),
        );
        setTotalCount(response.data.total_count);
        setPaginationValue(1);
      })
      .catch(err => {
        if (err.response?.status === 404) {
          updateTrendList([]);
          setTotalCount(0);
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
  }, [trendFilters, pageSize, trendsSortBy]);
  return (
    <div style={{ padding: '0 1rem' }} className='margin-bottom-09'>
      {trendList && totalCount !== undefined ? (
        <div>
          <div
            className='margin-bottom-05 flex-div'
            style={{
              padding: '1rem',
              backgroundColor: 'var(--gray-200)',
              justifyContent: 'center',
              width: 'calc(100% - 2rem)',
              alignItems: 'center',
            }}
          >
            <div className='bold'>
              {totalCount}{' '}
              {totalCount > 1 ? 'trends available' : 'trend available'}
            </div>
            {role === 'Admin' || role === 'Curator' ? (
              <button
                type='button'
                className='undp-button button-primary'
                onClick={() => {
                  setLoading(true);
                  axios
                    .get(GetURL(true), {
                      headers: {
                        access_token: accessToken,
                      },
                      responseType: 'blob',
                    })
                    .then((response: AxiosResponse) => {
                      const url = window.URL.createObjectURL(
                        new Blob([response.data]),
                      );
                      const link = document.createElement('a');
                      link.href = url;
                      link.setAttribute(
                        'download',
                        `FTSS_trends_${new Date(Date.now()).getFullYear()}-${
                          new Date(Date.now()).getMonth() + 1
                        }-${new Date(Date.now()).getDate()}.xlsx`,
                      );
                      document.body.appendChild(link);
                      link.click();
                      setLoading(false);
                    });
                }}
              >
                Download Excel
              </button>
            ) : null}
            <button
              type='button'
              className='undp-button button-primary'
              onClick={() => {
                const cardToPrintTemp = [...cardsToPrint];
                trendList.forEach(s => {
                  if (
                    cardsToPrint.findIndex(
                      el =>
                        el.id === `${s.id}` &&
                        el.mode === 'card' &&
                        el.type === 'trend',
                    ) === -1
                  ) {
                    cardToPrintTemp.push({
                      type: 'trend',
                      mode: 'card',
                      id: `${s.id}`,
                    });
                  }
                });
                updateCardsToPrint(cardToPrintTemp);
              }}
            >
              Add signals on page to PDF
            </button>
          </div>
          <div className='flex-div flex-wrap'>
            {trendList.length > 0 && trendList ? (
              view === 'cardView' ? (
                <CardList />
              ) : (
                <ListView />
              )
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
                No trends available matching your criteria
              </h5>
            )}
          </div>
          {trendList.length > 0 ? (
            <div className='flex-div flex-hor-align-center margin-top-07'>
              <Pagination
                className='undp-pagination'
                onChange={e => {
                  setPaginationValue(e);
                }}
                defaultCurrent={1}
                current={paginationValue}
                total={totalCount}
                pageSize={pageSize}
                showSizeChanger
                onShowSizeChange={onShowSizeChange}
              />
            </div>
          ) : null}
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
      <Modal className='undp-modal undp-loading-modal' title='' open={loading}>
        <div style={{ margin: 'auto' }}>
          <div className='undp-loader' style={{ margin: 'auto' }} />
        </div>
      </Modal>
    </div>
  );
}
