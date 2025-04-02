import { useContext, useEffect, useState } from 'react';
import { Modal, Pagination, PaginationProps } from 'antd';
import sortBy from 'lodash.sortby';
import { CardList } from './GridView';
import { ListView } from './ListView';
import Context from '../../Context/Context';
import { exportSignals, searchSignals } from '../../API';

interface Props {
  view: 'cardView' | 'listView';
  isArchived?: boolean;
}

export function AllSignals(props: Props) {
  const { view, isArchived } = props;
  const [paginationValue, setPaginationValue] = useState(1);
  const [loading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState(20);
  const [totalCount, setTotalCount] = useState<number | undefined>(undefined);
  const {
    role,
    signalFilters,
    signalsSortBy,
    signalList,
    updateSignalList,
    cardsToPrint,
    updateCardsToPrint,
  } = useContext(Context);
  const [error, setError] = useState<undefined | string>(undefined);

  const getQueryParams = () => {
    const params: Record<string, unknown> = {
      page: paginationValue,
      per_page: pageSize,
      order_by: isArchived ? 'modified_at' : signalsSortBy,
      direction:
        signalsSortBy === 'created_at' ||
        signalsSortBy === 'modified_at' ||
        isArchived
          ? 'desc'
          : 'asc',
      statuses: isArchived
        ? ['Archived']
        : signalFilters.status === 'All Status'
        ? role === 'Curator' || role === 'Admin'
          ? ['New', 'Approved']
          : ['Approved', 'New']
        : [signalFilters.status],
    };

    if (signalFilters.steep_primary !== 'All Primary STEEP+V') {
      params.steep_primary = signalFilters.steep_primary;
    }
    if (signalFilters.steep_secondary !== 'All Secondary STEEP+V') {
      params.steep_secondary = signalFilters.steep_secondary;
    }
    if (
      signalFilters.signature_primary !==
      'All Primary Signature Solutions/Enabler'
    ) {
      params.signature_primary = signalFilters.signature_primary;
    }
    if (
      signalFilters.signature_secondary !==
      'All Secondary Signature Solutions/Enabler'
    ) {
      params.signature_secondary = signalFilters.signature_secondary;
    }
    if (signalFilters.sdg !== 'All SDGs') {
      params.sdgs = signalFilters.sdg;
    }
    if (signalFilters.created_for !== 'All Options') {
      params.created_for = signalFilters.created_for;
    }
    if (signalFilters.horizon !== 'All Horizons') {
      params.time_horizon = signalFilters.horizon;
    }
    if (signalFilters.impact !== 'All Ratings') {
      params.impact_rating = signalFilters.impact;
    }
    if (signalFilters.search) {
      params.query = signalFilters.search;
    }
    if (signalFilters.location !== 'All Locations') {
      params.location = signalFilters.location;
    }
    if (signalFilters.bureau) {
      params.bureau = signalFilters.bureau;
    }
    if (signalFilters.score !== 'All Scores') {
      params.score = signalFilters.score;
    }
    if (signalFilters.unit_region !== 'All Units') {
      params.unit = signalFilters.unit_region;
    }
    if (signalFilters.created_by && signalFilters.created_by !== 'All') {
      params.created_by = signalFilters.created_by;
    }

    return params;
  };

  // Download all signals in excel format
  const getQueryParamsToDownloadAll = () => {
    const params: Record<string, unknown> = {
      page: paginationValue,
      per_page: totalCount,
      order_by: isArchived ? 'modified_at' : signalsSortBy,
      direction:
        signalsSortBy === 'created_at' ||
        signalsSortBy === 'modified_at' ||
        isArchived
          ? 'desc'
          : 'asc',
      statuses: isArchived
        ? ['Archived']
        : signalFilters.status === 'All Status'
        ? role === 'Curator' || role === 'Admin'
          ? ['New', 'Approved']
          : ['Approved', 'New']
        : [signalFilters.status],
    };

    if (signalFilters.steep_primary !== 'All Primary STEEP+V') {
      params.steep_primary = signalFilters.steep_primary;
    }
    if (signalFilters.steep_secondary !== 'All Secondary STEEP+V') {
      params.steep_secondary = signalFilters.steep_secondary;
    }
    if (
      signalFilters.signature_primary !==
      'All Primary Signature Solutions/Enabler'
    ) {
      params.signature_primary = signalFilters.signature_primary;
    }
    if (
      signalFilters.signature_secondary !==
      'All Secondary Signature Solutions/Enabler'
    ) {
      params.signature_secondary = signalFilters.signature_secondary;
    }
    if (signalFilters.sdg !== 'All SDGs') {
      params.sdgs = signalFilters.sdg;
    }
    if (signalFilters.created_for !== 'All Options') {
      params.created_for = signalFilters.created_for;
    }
    if (signalFilters.horizon !== 'All Horizons') {
      params.time_horizon = signalFilters.horizon;
    }
    if (signalFilters.impact !== 'All Ratings') {
      params.impact_rating = signalFilters.impact;
    }
    if (signalFilters.search) {
      params.query = signalFilters.search;
    }
    if (signalFilters.location !== 'All Locations') {
      params.location = signalFilters.location;
    }
    if (signalFilters.bureau) {
      params.bureau = signalFilters.bureau;
    }
    if (signalFilters.score !== 'All Scores') {
      params.score = signalFilters.score;
    }
    if (signalFilters.unit_region !== 'All Units') {
      params.unit = signalFilters.unit_region;
    }
    if (signalFilters.created_by && signalFilters.created_by !== 'All') {
      params.created_by = signalFilters.created_by;
    }

    return params;
  };

  useEffect(() => {
    updateSignalList(undefined);
    searchSignals(getQueryParams())
      .then(response => {
        updateSignalList(
          sortBy(response.data, d => Date.parse(d.created_at)).reverse(),
        );
        setTotalCount(response.total_count);
      })
      .catch(err => {
        if (err.response?.status === 404) {
          updateSignalList([]);
          setTotalCount(0);
        } else {
          setError(
            `${err}: ${err.response?.data}. ${
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
    searchSignals(getQueryParams())
      .then(response => {
        updateSignalList(
          sortBy(response.data, d => Date.parse(d.created_at)).reverse(),
        );
        setTotalCount(response.total_count);
        setPaginationValue(1);
      })
      .catch(err => {
        if (err.response?.status === 404) {
          updateSignalList([]);
          setTotalCount(0);
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
  }, [role, signalFilters, pageSize, signalsSortBy]);
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
                  exportSignals(getQueryParamsToDownloadAll()).then(response => {
                    const url = window.URL.createObjectURL(
                      new Blob([response]),
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
                  },
                // console.log(exportSignals)
                );
                }}
              >
                Download Excel - All {totalCount} Signals 
              </button>
            ) : null}
            {role === 'Admin' || role === 'Curator' ? (
              <button
                type='button'
                className='undp-button button-primary'
                onClick={() => {
                  setLoading(true);
                  exportSignals(getQueryParams()).then(response => {
                    const url = window.URL.createObjectURL(
                      new Blob([response]),
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
            <button
              type='button'
              className='undp-button button-primary'
              onClick={() => {
                const cardToPrintTemp = [...cardsToPrint];
                signalList.forEach(s => {
                  if (
                    cardsToPrint.findIndex(
                      el =>
                        el.id === `${s.id}` &&
                        el.mode === 'card' &&
                        el.type === 'signal',
                    ) === -1
                  ) {
                    cardToPrintTemp.push({
                      type: 'signal',
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
          <div className='flex-div flex-wrap listing'>
            {signalList.length > 0 && signalList ? (
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
