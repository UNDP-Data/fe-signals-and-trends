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
import axios, { AxiosResponse } from 'axios';
import sortBy from 'lodash.sortby';
import { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { API_ACCESS_TOKEN } from '../Constants';
import { SignalDataType, SignalFiltersDataType } from '../Types';
import Context from '../Context/Context';

interface Props {
  setSignalModal: (_d: boolean) => void;
  trendsSignal: number[];
  setTrendsSignal: (_d: number[]) => void;
}

const RadioOutline = styled.div`
  border: 1px solid var(--gray-400);
  border-radius: 2px;
  font-size: 0.75rem;
  padding: 0.5rem;
  background-color: var(--gray-300);
  font-weight: bold;
  text-transform: uppercase !important;
  flex-shrink: 0;
  width: 56px;
  text-align: center;
`;

export function AddSignalsModal(props: Props) {
  const { setSignalModal, trendsSignal, setTrendsSignal } = props;
  const { accessToken, choices } = useContext(Context);
  const [activeTab, setActiveTab] = useState('1');
  const [paginationValue, setPaginationValue] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [error, setError] = useState<undefined | string>(undefined);
  const [totalNoOfPages, setTotalNoOfPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState<undefined | string>(undefined);
  const [signalList, setSignalList] = useState<SignalDataType[]>([]);
  const [idsList, setIdsList] = useState<string[]>([]);
  const [filters, setFilters] = useState<SignalFiltersDataType>({
    steep_primary: 'All Primary STEEP+V',
    steep_secondary: 'All Secondary STEEP+V',
    sdg: 'All SDGs',
    signature_primary: 'All Primary Signature Solutions/Enabler',
    signature_secondary: 'All Secondary Signature Solutions/Enabler',
    status: 'All Status',
    location: 'All Locations',
    score: 'All Scores',
    created_for: 'All Options',
    unit_region: 'All Units',
    search: undefined,
  });
  const [loading, setLoading] = useState(true);
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
      const signalIds = ids.toString().replaceAll(',', '&ids=');
      axios
        .get(
          `https://signals-and-trends-api.azurewebsites.net/v1/signals/fetch?ids=${signalIds}`,
          {
            headers: {
              access_token: accessToken || API_ACCESS_TOKEN,
            },
          },
        )
        .then((response: AxiosResponse) => {
          setSignalList(
            sortBy(response.data, d => Date.parse(d.created_at)).reverse(),
          );
          setLoading(false);
        })
        .catch(err => {
          if (err.response?.status === 404) {
            setSignalList([]);
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
        steep_primary: 'All Primary STEEP+V',
        steep_secondary: 'All Secondary STEEP+V',
        sdg: 'All SDGs',
        signature_primary: 'All Primary Signature Solutions/Enabler',
        signature_secondary: 'All Secondary Signature Solutions/Enabler',
        status: 'All Status',
        location: 'All Locations',
        score: 'All Scores',
        created_for: 'All Options',
        unit_region: 'All Units',
        search: undefined,
      });
    }
  };
  useEffect(() => {
    setLoading(true);
    setError(undefined);
    setSignalList([]);
    const statusQueryParameter = '&statuses=Approved';
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
        : `&unit_region=${filters.unit_region.replaceAll(' ', '%20')}`;
    axios
      .get(
        `https://signals-and-trends-api.azurewebsites.net/v1/signals/list?page=${paginationValue}&per_page=${pageSize}${steepPrimaryQueryParameter}${steepSecondaryQueryParameter}${sdgQueryParameter}${ss1QueryParameter}${ss2QueryParameter}${createdForQueryParameter}${statusQueryParameter}${unitQueryParameter}${locationQueryParameter}${scoreQueryParameter}${searchQueryParameter}`,
        {
          headers: {
            access_token: accessToken || API_ACCESS_TOKEN,
          },
        },
      )
      .then((response: AxiosResponse) => {
        setSignalList(
          sortBy(response.data.data, d => Date.parse(d.created_at)).reverse(),
        );
        setLoading(false);
      })
      .catch(err => {
        if (err.response?.status === 404) {
          setSignalList([]);
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
    setSignalList([]);
    setError(undefined);
    setLoading(true);
    const statusQueryParameter = '&statuses=Approved';
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
    axios
      .get(
        `https://signals-and-trends-api.azurewebsites.net/v1/signals/list?page=1&per_page=${pageSize}&${steepPrimaryQueryParameter}${steepSecondaryQueryParameter}${sdgQueryParameter}${ss1QueryParameter}${ss2QueryParameter}${createdForQueryParameter}${statusQueryParameter}${unitQueryParameter}${locationQueryParameter}${scoreQueryParameter}${searchQueryParameter}`,
        {
          headers: {
            access_token: accessToken || API_ACCESS_TOKEN,
          },
        },
      )
      .then((response: AxiosResponse) => {
        setSignalList(
          sortBy(response.data.data, d => Date.parse(d.created_at)).reverse(),
        );
        setTotalNoOfPages(response.data.total_pages);
        setPaginationValue(1);
        setLoading(false);
      })
      .catch(err => {
        if (err.response?.status === 404) {
          setSignalList([]);
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
      title='Select Signals'
      onOk={() => {
        setSignalModal(false);
      }}
      onCancel={() => {
        setSignalModal(false);
      }}
      width={960}
    >
      <p className='undp-typography italics margin-bottom-07'>
        Signals are connected or decoupled when you click on the signal&apos;s
        add/remove button
      </p>
      <Tabs
        defaultActiveKey='1'
        className='undp-tabs'
        onChange={e => {
          setActiveTab(e);
          setFilters({
            steep_primary: 'All Primary STEEP+V',
            steep_secondary: 'All Secondary STEEP+V',
            sdg: 'All SDGs',
            signature_primary: 'All Primary Signature Solutions/Enabler',
            signature_secondary: 'All Secondary Signature Solutions/Enabler',
            status: 'All Status',
            location: 'All Locations',
            score: 'All Scores',
            created_for: 'All Options',
            unit_region: 'All Units',
            search: undefined,
          });
          setIdsList([]);
        }}
        items={[
          {
            label: 'Filter signals',
            key: '1',
            children: (
              <div>
                <div className='flex-div margin-bottom-05 margin-top-00 flex-wrap'>
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
                    {choices?.steepv.map(d => (
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
                    {choices?.steepv.map(d => (
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
                    {choices?.signatures.map(d => (
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
                    {choices?.signatures.map(d => (
                      <Select.Option className='undp-select-option' key={d}>
                        {d}
                      </Select.Option>
                    ))}
                  </Select>
                  <Select
                    className='undp-select'
                    style={{ width: 'calc(25% - 0.75rem)' }}
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
                    {choices?.sdgs.map(d => (
                      <Select.Option className='undp-select-option' key={d}>
                        {d}
                      </Select.Option>
                    ))}
                  </Select>
                  <Select
                    className='undp-select'
                    style={{ width: 'calc(25% - 0.75rem)' }}
                    placeholder='Please select'
                    defaultValue='All Scores'
                    value={filters.score}
                    showSearch
                    allowClear
                    disabled={loading}
                    onChange={values => {
                      const val = values ? `${values}` : 'All Scores';
                      setFilters({
                        ...filters,
                        score: val,
                      });
                    }}
                    clearIcon={<div className='clearIcon' />}
                  >
                    <Select.Option
                      className='undp-select-option'
                      key='All Scores'
                    >
                      All Scores
                    </Select.Option>
                    {choices?.scores.map(d => (
                      <Select.Option className='undp-select-option' key={d}>
                        {d}
                      </Select.Option>
                    ))}
                  </Select>
                  <Select
                    className='undp-select'
                    style={{ width: 'calc(25% - 0.75rem)' }}
                    placeholder='Please select'
                    defaultValue='All Locations'
                    value={filters.location}
                    showSearch
                    allowClear
                    disabled={loading}
                    onChange={values => {
                      const val = values ? `${values}` : 'All Locations';
                      setFilters({
                        ...filters,
                        location: val,
                      });
                    }}
                    clearIcon={<div className='clearIcon' />}
                  >
                    <Select.Option
                      className='undp-select-option'
                      key='All Locations'
                    >
                      All Locations
                    </Select.Option>
                    {choices?.locations.map(d => (
                      <Select.Option className='undp-select-option' key={d}>
                        {d}
                      </Select.Option>
                    ))}
                  </Select>
                  <Select
                    className='undp-select'
                    style={{ width: 'calc(25% - 0.75rem)' }}
                    placeholder='Please select'
                    defaultValue='All Units'
                    value={filters.unit_region}
                    showSearch
                    allowClear
                    disabled={loading}
                    onChange={values => {
                      const val = values ? `${values}` : 'All Units';
                      setFilters({
                        ...filters,
                        unit_region: val,
                      });
                    }}
                    clearIcon={<div className='clearIcon' />}
                  >
                    <Select.Option
                      className='undp-select-option'
                      key='All Units'
                    >
                      All Units
                    </Select.Option>
                    <Select.OptGroup label='Parent units'>
                      {choices?.unit_regions.map(d => (
                        <Select.Option className='undp-select-option' key={d}>
                          {d}
                        </Select.Option>
                      ))}
                    </Select.OptGroup>
                    <Select.OptGroup label='Units'>
                      {choices?.unit_names.map(d => (
                        <Select.Option className='undp-select-option' key={d}>
                          {d}
                        </Select.Option>
                      ))}
                    </Select.OptGroup>
                  </Select>
                </div>
                <div
                  style={{ width: '100%' }}
                  className='flex-div margin-bottom-05'
                >
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
                  <div
                    className='gap-00 flex-div'
                    style={{
                      flexGrow: 1,
                      width: 'calc(50% - 0.667rem)',
                    }}
                  >
                    <Input
                      placeholder='Search for a signal'
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
          className='margin-top-00 margin-bottom-08 margin-left-02'
          style={{ color: 'var(--dark-red)' }}
        >
          {error}
        </p>
      ) : signalList.length > 0 ? (
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
              {signalList.map((d, i) => (
                <Collapse.Panel
                  key={i}
                  header={`${d.headline} (ID:${d.id})`}
                  className='undp-accordion-with-bg-item'
                  extra={
                    <RadioOutline
                      onClick={e => {
                        e.stopPropagation();
                        if (trendsSignal.findIndex(el => el === d.id) === -1) {
                          const arr = [...trendsSignal];
                          arr.push(d.id);
                          setTrendsSignal(arr);
                        } else {
                          setTrendsSignal([
                            ...trendsSignal.filter(el => el !== d.id),
                          ]);
                        }
                      }}
                    >
                      {trendsSignal ? (
                        trendsSignal.findIndex(
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
                total={totalNoOfPages * pageSize}
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
          setSignalModal(false);
        }}
      >
        Done
      </button>
    </Modal>
  );
}
