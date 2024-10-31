/* eslint-disable react/no-unstable-nested-components */
import {
  Collapse,
  Input,
  Modal,
  Pagination,
  PaginationProps,
  Select,
  Tabs,
} from 'antd';
import sortBy from 'lodash.sortby';
import { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { TrendDataType, TrendFiltersDataType } from '../Types';
import Context from '../Context/Context';
import { searchTrends } from '../api';

interface Props {
  setTrendModal: (_d: boolean) => void;
  selectedTrendsList: number[];
  setSelectedTrendsList: (_d: number[]) => void;
}

const RadioOutline = styled.div`
  border: 1px solid var(--gray-400);
  border-radius: 2px;
  font-size: 0.75rem;
  padding: 0.5rem;
  background-color: var(--gray-300);
  font-weight: bold;
  text-transform: uppercase !important;
  width: 56px;
  text-align: center;
`;

export function AddTrendsModal(props: Props) {
  const { setTrendModal, selectedTrendsList, setSelectedTrendsList } = props;
  const { choices } = useContext(Context);
  const [paginationValue, setPaginationValue] = useState(1);
  const [activeTab, setActiveTab] = useState('1');
  const [pageSize, setPageSize] = useState(20);
  const [error, setError] = useState<undefined | string>(undefined);
  const [totalNoOfPages, setTotalNoOfPages] = useState(0);
  const [trendsList, setTrendsList] = useState<TrendDataType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState<undefined | string>(undefined);
  const [idsList, setIdsList] = useState<string[]>([]);
  const [filters, setFilters] = useState<TrendFiltersDataType>({
    impact: 'All Ratings',
    horizon: 'All Horizons',
    steep_primary: 'All Primary STEEP+V',
    steep_secondary: 'All Secondary STEEP+V',
    sdg: 'All SDGs',
    signature_primary: 'All Primary Signature Solutions/Enabler',
    signature_secondary: 'All Secondary Signature Solutions/Enabler',
    created_for: 'All Options',
    status: 'All Status',
    search: undefined,
  });
  const onShowSizeChange: PaginationProps['onShowSizeChange'] = (
    _current,
    size,
  ) => {
    setPageSize(size);
  };
  const fetchIds = (ids: string[]) => {
    if (ids?.length > 0 && ids[0] !== '') {
      setLoading(true);
      setError(undefined);
      const trendsIds = ids
        .map(id => Number(id))
        .filter(id => !Number.isNaN(id));
      searchTrends({ ids: trendsIds })
        .then(response => {
          setTrendsList(
            sortBy(response.data, d => Date.parse(d.created_at)).reverse(),
          );
          setLoading(false);
        })
        .catch(err => {
          if (err.response?.status === 404) {
            setTrendsList([]);
            setLoading(false);
          } else if (err.response?.status === 500) {
            setError(
              `Error code ${err.response?.status}: ${err.response?.data}. ${
                err.response?.status === 500
                  ? 'Please try again in some time'
                  : ''
              }`,
            );
            setLoading(false);
          } else if (err.response?.status === 422) {
            setError(
              `Error code ${err.response?.status}: ${
                err.response?.status === 422
                  ? 'Please check if the input to this field is correct, IDs are numerical and must be separated by commas'
                  : ''
              }`,
            );
            setLoading(false);
          }
        });
    } else {
      setFilters({
        impact: 'All Ratings',
        horizon: 'All Horizons',
        steep_primary: 'All Primary STEEP+V',
        steep_secondary: 'All Secondary STEEP+V',
        sdg: 'All SDGs',
        signature_primary: 'All Primary Signature Solutions/Enabler',
        signature_secondary: 'All Secondary Signature Solutions/Enabler',
        created_for: 'All Options',
        status: 'All Status',
        search: undefined,
      });
    }
  };

  const getQueryParams = () => {
    const params: Record<string, unknown> = {
      page: paginationValue,
      per_page: pageSize,
      statuses: ['Approved'],
    };

    if (filters.horizon !== 'All Horizons') {
      params.time_horizon = filters.horizon;
    }
    if (filters.impact !== 'All Ratings') {
      params.impact_rating = filters.impact;
    }
    if (filters.steep_primary !== 'All Primary STEEP+V') {
      params.steep_primary = filters.steep_primary;
    }
    if (filters.steep_secondary !== 'All Secondary STEEP+V') {
      params.steep_secondary = filters.steep_secondary;
    }
    if (
      filters.signature_primary !== 'All Primary Signature Solutions/Enabler'
    ) {
      params.signature_primary = filters.signature_primary;
    }
    if (
      filters.signature_secondary !==
      'All Secondary Signature Solutions/Enabler'
    ) {
      params.signature_secondary = filters.signature_secondary;
    }
    if (filters.sdg !== 'All SDGs') {
      params.sdgs = filters.sdg;
    }
    if (filters.created_for !== 'All Options') {
      params.created_for = filters.created_for;
    }
    if (filters.search) {
      params.query = filters.search;
    }

    return params;
  };

  useEffect(() => {
    setLoading(true);
    setError(undefined);

    searchTrends(getQueryParams())
      .then(response => {
        setTrendsList(
          sortBy(response.data, d => Date.parse(d.created_at)).reverse(),
        );
        setLoading(false);
      })
      .catch(err => {
        if (err.response?.status === 404) {
          setTrendsList([]);
          setLoading(false);
        } else {
          setError(
            `Error code ${err.response?.status}: ${err.response?.data}. ${
              err.response?.status === 500
                ? 'Please try again in some time'
                : ''
            }`,
          );
          setLoading(false);
        }
      });
  }, [paginationValue]);

  useEffect(() => {
    setLoading(true);
    setError(undefined);

    searchTrends(getQueryParams())
      .then(response => {
        setTrendsList(
          sortBy(response.data, d => Date.parse(d.created_at)).reverse(),
        );
        setTotalNoOfPages(response.total_pages);
        setPaginationValue(1);
        setLoading(false);
      })
      .catch(err => {
        if (err.response?.status === 404) {
          setTrendsList([]);
          setLoading(false);
        } else {
          setError(
            `Error code ${err.response?.status}: ${err.response?.data}. ${
              err.response?.status === 500
                ? 'Please try again in some time'
                : ''
            }`,
          );
          setLoading(false);
        }
      });
  }, [filters, pageSize]);

  return (
    <Modal
      className='undp-modal'
      open
      title='Select Trends'
      onOk={() => {
        setTrendModal(false);
      }}
      onCancel={() => {
        setTrendModal(false);
      }}
      width={960}
    >
      <p className='undp-typography italics margin-bottom-07'>
        Trends are connected or decoupled when you click on the trend&apos;s
        add/remove button
      </p>
      <Tabs
        defaultActiveKey='1'
        className='undp-tabs'
        onChange={e => {
          setFilters({
            impact: 'All Ratings',
            horizon: 'All Horizons',
            steep_primary: 'All Primary STEEP+V',
            steep_secondary: 'All Secondary STEEP+V',
            sdg: 'All SDGs',
            signature_primary: 'All Primary Signature Solutions/Enabler',
            signature_secondary: 'All Secondary Signature Solutions/Enabler',
            created_for: 'All Options',
            status: 'All Status',
            search: undefined,
          });
          setIdsList([]);
          setActiveTab(e);
        }}
        items={[
          {
            label: 'Filter trends',
            key: '1',
            children: (
              <div>
                <div className='flex-div margin-top-00 margin-bottom-05 flex-wrap'>
                  <Select
                    className='undp-select'
                    style={{
                      flexGrow: 1,
                      width: 'calc(50% - 0.667rem)',
                    }}
                    placeholder='Please select'
                    defaultValue='All Horizons'
                    value={filters.horizon}
                    showSearch
                    allowClear
                    disabled={loading}
                    onChange={values => {
                      const val = values ? `${values}` : 'All Horizons';
                      setFilters({
                        ...filters,
                        horizon: val,
                      });
                    }}
                    clearIcon={<div className='clearIcon' />}
                  >
                    <Select.Option
                      className='undp-select-option'
                      key='All Horizons'
                    >
                      All Horizons
                    </Select.Option>
                    {choices?.horizon.map(d => (
                      <Select.Option className='undp-select-option' key={d}>
                        {d}
                      </Select.Option>
                    ))}
                  </Select>
                  <Select
                    className='undp-select'
                    style={{
                      flexGrow: 1,
                      width: 'calc(50% - 0.667rem)',
                    }}
                    placeholder='Please select'
                    defaultValue='All Ratings'
                    value={filters.impact}
                    showSearch
                    disabled={loading}
                    allowClear
                    onChange={values => {
                      const val = values ? `${values}` : 'All Ratings';
                      setFilters({
                        ...filters,
                        impact: val,
                      });
                    }}
                    clearIcon={<div className='clearIcon' />}
                  >
                    <Select.Option
                      className='undp-select-option'
                      key='All Ratings'
                    >
                      All Ratings
                    </Select.Option>
                    {choices?.rating.map(d => (
                      <Select.Option className='undp-select-option' key={d}>
                        {d}
                      </Select.Option>
                    ))}
                  </Select>
                  <Select
                    className='undp-select'
                    style={{ width: 'calc(25% - 0.75rem)' }}
                    placeholder='Please select'
                    defaultValue='All Primary STEEP+V'
                    value={filters.steep_primary}
                    showSearch
                    allowClear
                    disabled={loading}
                    onChange={values => {
                      const val = values ? `${values}` : 'All Primary STEEP+V';
                      setFilters({
                        ...filters,
                        steep_primary: val,
                      });
                    }}
                    clearIcon={<div className='clearIcon' />}
                  >
                    <Select.Option
                      className='undp-select-option'
                      key='All Primary STEEP+V'
                    >
                      All Primary STEEP+V
                    </Select.Option>
                    {choices?.steep.map(d => (
                      <Select.Option className='undp-select-option' key={d}>
                        {d}
                      </Select.Option>
                    ))}
                  </Select>
                  <Select
                    className='undp-select'
                    style={{ width: 'calc(25% - 0.75rem)' }}
                    placeholder='Please select'
                    defaultValue='All Secondary STEEP+V'
                    value={filters.steep_secondary}
                    showSearch
                    allowClear
                    disabled={loading}
                    onChange={values => {
                      const val = values
                        ? `${values}`
                        : 'All Secondary STEEP+V';
                      setFilters({
                        ...filters,
                        steep_secondary: val,
                      });
                    }}
                    clearIcon={<div className='clearIcon' />}
                  >
                    <Select.Option
                      className='undp-select-option'
                      key='All Secondary STEEP+V'
                    >
                      All Secondary STEEP+V
                    </Select.Option>
                    {choices?.steep.map(d => (
                      <Select.Option className='undp-select-option' key={d}>
                        {d}
                      </Select.Option>
                    ))}
                  </Select>
                  <Select
                    className='undp-select'
                    style={{ width: 'calc(25% - 0.75rem)' }}
                    placeholder='Please select'
                    defaultValue='All Primary Signature Solutions/Enabler'
                    value={filters.signature_primary}
                    showSearch
                    allowClear
                    disabled={loading}
                    onChange={values => {
                      const val = values
                        ? `${values}`
                        : 'All Primary Signature Solutions/Enabler';
                      setFilters({
                        ...filters,
                        signature_primary: val,
                      });
                    }}
                    clearIcon={<div className='clearIcon' />}
                  >
                    <Select.Option
                      className='undp-select-option'
                      key='All Primary Signature Solutions/Enabler'
                    >
                      All Primary Signature Solutions/Enabler
                    </Select.Option>
                    {choices?.signature.map(d => (
                      <Select.Option className='undp-select-option' key={d}>
                        {d}
                      </Select.Option>
                    ))}
                  </Select>
                  <Select
                    className='undp-select'
                    style={{ width: 'calc(25% - 0.75rem)' }}
                    placeholder='Please select'
                    defaultValue='All Secondary Signature Solutions/Enabler'
                    value={filters.signature_secondary}
                    showSearch
                    allowClear
                    disabled={loading}
                    onChange={values => {
                      const val = values
                        ? `${values}`
                        : 'All Secondary Signature Solutions/Enabler';
                      setFilters({
                        ...filters,
                        signature_secondary: val,
                      });
                    }}
                    clearIcon={<div className='clearIcon' />}
                  >
                    <Select.Option
                      className='undp-select-option'
                      key='All Secondary Signature Solutions/Enabler'
                    >
                      All Secondary Signature Solutions/Enabler
                    </Select.Option>
                    {choices?.signature.map(d => (
                      <Select.Option className='undp-select-option' key={d}>
                        {d}
                      </Select.Option>
                    ))}
                  </Select>
                  <Select
                    className='undp-select'
                    style={{
                      flexGrow: 1,
                      width: 'calc(50% - 0.667rem)',
                    }}
                    placeholder='Please select'
                    defaultValue='All SDGs'
                    value={filters.sdg}
                    showSearch
                    allowClear
                    disabled={loading}
                    onChange={values => {
                      const val = values ? `${values}` : 'All SDGs';
                      setFilters({
                        ...filters,
                        sdg: val,
                      });
                    }}
                    clearIcon={<div className='clearIcon' />}
                  >
                    <Select.Option
                      className='undp-select-option'
                      key='All SDGs'
                    >
                      All SDGs
                    </Select.Option>
                    {choices?.goal.map(d => (
                      <Select.Option className='undp-select-option' key={d}>
                        {d}
                      </Select.Option>
                    ))}
                  </Select>
                  <Select
                    className='undp-select'
                    style={{
                      flexGrow: 1,
                      width: 'calc(50% - 0.667rem)',
                    }}
                    placeholder='Please select'
                    defaultValue='All Options'
                    value={filters.created_for}
                    showSearch
                    allowClear
                    onChange={values => {
                      setFilters({
                        ...filters,
                        created_for: values || 'All Options',
                      });
                    }}
                    clearIcon={<div className='clearIcon' />}
                  >
                    {choices?.created_for.map(d => (
                      <Select.Option className='undp-select-option' key={d}>
                        {d}
                      </Select.Option>
                    ))}
                  </Select>
                </div>
                <div
                  style={{ width: '100%' }}
                  className='flex-div gap-00 margin-bottom-05'
                >
                  <Input
                    placeholder='Search for a trend'
                    className='undp-input'
                    size='large'
                    value={searchQuery}
                    onChange={d => {
                      setSearchQuery(d.target.value);
                    }}
                    onPressEnter={() => {
                      setFilters({ ...filters, search: searchQuery });
                    }}
                  />
                  <button
                    type='button'
                    className='undp-button button-secondary'
                    onClick={() => {
                      setFilters({ ...filters, search: searchQuery });
                    }}
                  >
                    Search
                  </button>
                </div>
              </div>
            ),
          },
          {
            label: 'Search by ID',
            key: '2',
            children: (
              <div>
                <p className='label'>
                  Fill in one ID, or multiple IDs separated by commas
                </p>
                <div
                  style={{ width: '100%' }}
                  className='flex-div margin-bottom-06'
                >
                  <div
                    className='gap-00 flex-div'
                    style={{
                      flexGrow: 1,
                      width: 'calc(50% - 0.667rem)',
                    }}
                  >
                    <Input
                      placeholder='Search for a signal by ID'
                      className='undp-input'
                      size='large'
                      value={idsList}
                      onChange={d => {
                        setIdsList(d.target.value.split(','));
                      }}
                      onPressEnter={() => {
                        fetchIds(idsList);
                      }}
                    />
                    <button
                      type='button'
                      className='undp-button button-secondary'
                      onClick={() => {
                        fetchIds(idsList);
                      }}
                    >
                      Search
                    </button>
                  </div>
                </div>
              </div>
            ),
          },
        ]}
      />
      {loading ? (
        <div className='undp-loader-container'>
          <div className='undp-loader' />
        </div>
      ) : error ? (
        <p
          className='margin-top-00 margin-bottom-00'
          style={{ color: 'var(--dark-red)' }}
        >
          {error}
        </p>
      ) : trendsList.length > 0 ? (
        <div>
          <div className='margin-bottom-09'>
            <Collapse
              expandIconPosition='start'
              className='undp-accordion-with-bg'
              expandIcon={({ isActive }) => (
                <img
                  src='https://design.undp.org/icons/chevron-right.svg'
                  alt='chevron-left-icon'
                  style={{ rotate: `${isActive ? '90deg' : '0deg'}` }}
                />
              )}
            >
              {trendsList.map((d, i) => (
                <Collapse.Panel
                  key={i}
                  header={`${d.headline} (ID:${d.id})`}
                  className='undp-accordion-with-bg-item'
                  extra={
                    <RadioOutline
                      onClick={e => {
                        e.stopPropagation();
                        if (
                          selectedTrendsList?.findIndex(el => el === d.id) ===
                          -1
                        ) {
                          const arr = [...selectedTrendsList];
                          arr.push(d.id);
                          setSelectedTrendsList(arr);
                        } else {
                          setSelectedTrendsList([
                            ...selectedTrendsList.filter(el => el !== d.id),
                          ]);
                        }
                      }}
                    >
                      {selectedTrendsList ? (
                        selectedTrendsList.findIndex(
                          selTrend => selTrend === d.id,
                        ) === -1 ? (
                          <div style={{ color: 'var(--blue-600)' }}>+ Add</div>
                        ) : (
                          <div style={{ color: 'var(--dark-red)' }}>
                            - Remove
                          </div>
                        )
                      ) : (
                        <div style={{ color: 'var(--blue-600)' }}>+ Add</div>
                      )}
                    </RadioOutline>
                  }
                >
                  <p
                    className='undp-typography margin-bottom-00 small-font'
                    style={{ textAlign: 'left' }}
                  >
                    {d.description}
                  </p>
                </Collapse.Panel>
              ))}
            </Collapse>
          </div>
          {activeTab === '1' ? (
            <div className='flex-div flex-hor-align-center margin-bottom-07'>
              <Pagination
                className='undp-pagination'
                onChange={e => {
                  setPaginationValue(e);
                }}
                defaultCurrent={1}
                current={paginationValue}
                total={pageSize * totalNoOfPages}
                pageSize={pageSize}
                showSizeChanger
                onShowSizeChange={onShowSizeChange}
              />
            </div>
          ) : null}
        </div>
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
      <button
        className='undp-button button-secondary button-arrow'
        type='button'
        onClick={() => {
          setTrendModal(false);
        }}
      >
        Done
      </button>
    </Modal>
  );
}
