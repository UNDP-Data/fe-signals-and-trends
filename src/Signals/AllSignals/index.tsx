import { useContext, useEffect, useState } from 'react';
import { Modal, Pagination, PaginationProps } from 'antd';
import axios, { AxiosResponse } from 'axios';
import sortBy from 'lodash.sortby';
import { SignalDataType, SignalFiltersDataType } from '../../Types';
import { CardList } from './GridView';
import { ListView } from './ListView';
import { API_ACCESS_TOKEN } from '../../Constants';
import Context from '../../Context/Context';

interface Props {
  filters: SignalFiltersDataType;
  view: 'cardView' | 'listView';
  signalOrderBy: string;
}

export function AllSignals(props: Props) {
  const { filters, view, signalOrderBy } = props;
  const [paginationValue, setPaginationValue] = useState(1);
  const [loading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState(20);
  const [totalCount, setTotalCount] = useState<number | undefined>(undefined);
  const { role, accessToken } = useContext(Context);
  const [error, setError] = useState<undefined | string>(undefined);
  const [signalList, setSignalList] = useState<undefined | SignalDataType[]>(
    undefined,
  );

  const GetURL = (isExportLink: boolean) => {
    const steepPrimaryQueryParameter =
      filters.steep_primary === 'All Primary STEEP+V'
        ? ''
        : `&steep_primary=${filters.steep_primary}`;
    const steepSecondaryQueryParameter =
      filters.steep_secondary === 'All Secondary STEEP+V'
        ? ''
        : `&steep_secondary=${filters.steep_secondary}`;
    const ss1QueryParameter =
      filters.signature_primary === 'All Primary Signature Solutions/Enabler'
        ? ''
        : `&signature_primary=${filters.signature_primary.replaceAll(
            ' ',
            '%20',
          )}`;
    const ss2QueryParameter =
      filters.signature_secondary ===
      'All Secondary Signature Solutions/Enabler'
        ? ''
        : `&signature_secondary=${filters.signature_secondary.replaceAll(
            ' ',
            '%20',
          )}`;
    const statusQueryParameter =
      role === 'Curator' || role === 'Admin'
        ? filters.status === 'All Status'
          ? '&statuses=New&statuses=Approved'
          : `&statuses=${filters.status}`
        : '&statuses=Approved';
    const sdgQueryParameter =
      filters.sdg === 'All SDGs'
        ? ''
        : `&sdgs=${filters.sdg.replaceAll(' ', '%20')}`;
    const locationQueryParameter =
      filters.location === 'All Locations'
        ? ''
        : `&location=${filters.location}`;
    const scoreQueryParameter =
      filters.score === 'All Scores'
        ? ''
        : `&score=${filters.score.replaceAll(' ', '%20')}`;
    const createdForQueryParameter =
      filters.created_for === 'All Options'
        ? ''
        : `&created_for=${filters.created_for.replaceAll(' ', '%20')}`;
    const searchQueryParameter = filters.search
      ? `&query=${filters.search}`
      : '';
    const unitQueryParameter =
      filters.unit_region === 'All Units'
        ? ''
        : `&unit=${filters.unit_region.replaceAll(' ', '%20')}`;
    const createdByQueryParameter =
      filters.created_by && filters.created_by !== 'All'
        ? `&created_by=${filters.created_by}`
        : '';
    const orderByQueryParameter = `&order_by_field=${signalOrderBy}&order_by_direction=${
      signalOrderBy === 'created_at' || signalOrderBy === 'modified_at'
        ? 'desc'
        : 'asc'
    }`;
    const urlForExport = `https://signals-and-trends-api.azurewebsites.net/v1/export/signals?${statusQueryParameter}${steepPrimaryQueryParameter}${steepSecondaryQueryParameter}${sdgQueryParameter}${ss1QueryParameter}${ss2QueryParameter}${locationQueryParameter}${createdForQueryParameter}${createdByQueryParameter}${unitQueryParameter}${scoreQueryParameter}${searchQueryParameter}`;
    const urlForListing = `https://signals-and-trends-api.azurewebsites.net/v1/signals/list?page=${paginationValue}&per_page=${pageSize}${statusQueryParameter}${steepPrimaryQueryParameter}${steepSecondaryQueryParameter}${sdgQueryParameter}${ss1QueryParameter}${ss2QueryParameter}${locationQueryParameter}${createdForQueryParameter}${createdByQueryParameter}${unitQueryParameter}${scoreQueryParameter}${searchQueryParameter}${orderByQueryParameter}`;
    return isExportLink ? urlForExport : urlForListing;
  };

  useEffect(() => {
    setSignalList(undefined);
    axios
      .get(GetURL(false), {
        headers: {
          access_token: accessToken || API_ACCESS_TOKEN,
        },
      })
      .then((response: AxiosResponse) => {
        setSignalList(
          sortBy(response.data.data, d => Date.parse(d.created_at)).reverse(),
        );
      })
      .catch(err => {
        if (err.response?.status === 404) {
          setSignalList([]);
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
    setError(undefined);
    setSignalList(undefined);
    axios
      .get(GetURL(false), {
        headers: {
          access_token: accessToken || API_ACCESS_TOKEN,
        },
      })
      .then((response: AxiosResponse) => {
        setSignalList(
          sortBy(response.data.data, d => Date.parse(d.created_at)).reverse(),
        );
        setTotalCount(response.data.total_count);
        setPaginationValue(1);
      })
      .catch(err => {
        if (err.response?.status === 404) {
          setSignalList([]);
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
  }, [role, filters, accessToken, pageSize, signalOrderBy]);
  const onShowSizeChange: PaginationProps['onShowSizeChange'] = (
    _current,
    size,
  ) => {
    setPageSize(size);
  };

  return (
    <div className='margin-bottom-09' style={{ padding: '0 1rem' }}>
      {signalList && totalCount !== undefined ? (
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
              {totalCount > 1 ? 'signals available' : 'signal available'}
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
                        `FTSS_signals_${new Date(Date.now()).getFullYear()}-${
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
          </div>
          <div className='flex-div flex-wrap listing'>
            {signalList.length > 0 ? (
              view === 'cardView' ? (
                <CardList data={signalList} />
              ) : (
                <ListView data={signalList} />
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
                No signals available matching your criteria
              </h5>
            )}
          </div>
          {signalList.length > 0 ? (
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
