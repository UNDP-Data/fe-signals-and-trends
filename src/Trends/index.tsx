import styled from 'styled-components';
import { useContext, useState } from 'react';
import { Input, Modal, Radio, Select } from 'antd';
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
} from '@azure/msal-react';
import Background from '../assets/UNDP-hero-image.jpg';
import { TrendFiltersDataType } from '../Types';
import { AllTrends } from './AllTrends';
import Context from '../Context/Context';
import { SignInButton } from '../Components/SignInButton';
import { TREND_ORDER_BY_OPTIONS } from '../Constants';

const HeroImageEl = styled.div`
  background: linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45)),
    url(${Background}) no-repeat center;
  background-size: cover;
  margin-top: 7.1875rem;
`;
export function TrendsListing() {
  const {
    role,
    choices,
    trendFilters,
    updateTrendFilters,
    noOfTrendsFiltersActive,
    updateNoOfTrendsFiltersActive,
    trendsSortBy,
    updateTrendsSortBy,
  } = useContext(Context);
  const [viewType, setViewType] = useState<'cardView' | 'listView'>('cardView');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState<undefined | string>(
    trendFilters.search,
  );
  const [tempFilters, setTempFilters] = useState<TrendFiltersDataType>({
    impact: 'All Ratings',
    horizon: 'All Horizons',
    steep_primary: 'All Primary STEEP+V',
    steep_secondary: 'All Secondary STEEP+V',
    sdg: 'All SDGs',
    signature_primary: 'All Primary Signature Solutions/Enabler',
    signature_secondary: 'All Secondary Signature Solutions/Enabler',
    created_for: 'All Options',
    assigned_to: undefined,
    status: 'All Status',
    search: undefined,
  });
  return (
    <>
      <HeroImageEl className='undp-hero-image'>
        <div className='max-width'>
          <h1 className='undp-typography'>
            UNDP Future Trends and Signals System
          </h1>
          <h5 className='undp-typography'>
            The Future Trends and Signals System captures signals of change
            noticed across UNDP, and identifies the trends emerging – helping us
            all make stronger, more future-aware decisions.
          </h5>
        </div>
      </HeroImageEl>
      <div
        className='flex-div margin-top-07 margin-bottom-09 flex-wrap flex-vert-align-center'
        style={{
          paddingLeft: '1rem',
          paddingRight: '1rem',
          justifyContent: 'space-between',
        }}
      >
        <h4
          className='undp-typography margin-bottom-00'
          style={{ flexGrow: 1 }}
        >
          All Trends
        </h4>
        <div
          className='flex-div flex-vert-align-center flex-wrap'
          style={{ flexGrow: 1 }}
        >
          <Select
            className='undp-select'
            style={{
              width: '15rem',
            }}
            placeholder='Sort by'
            value={trendsSortBy}
            onChange={value => {
              updateTrendsSortBy(value);
            }}
          >
            {TREND_ORDER_BY_OPTIONS.map(d => (
              <Select.Option className='undp-select-option' key={d.key}>
                Sort by: {d.value}
              </Select.Option>
            ))}
          </Select>
          <button
            type='button'
            className='undp-button button-secondary'
            onClick={() => {
              setTempFilters(trendFilters);
              setShowFilterModal(true);
            }}
          >
            Filters
            {noOfTrendsFiltersActive ? ` (${noOfTrendsFiltersActive})` : ''}
          </button>
          <Radio.Group
            defaultValue='cardView'
            onChange={e => {
              setViewType(e.target.value as 'cardView' | 'listView');
            }}
            className='undp-button-radio'
          >
            <Radio.Button value='cardView'>Card View</Radio.Button>
            <Radio.Button value='listView'>List View</Radio.Button>
          </Radio.Group>
          <div className='flex-div gap-00' style={{ flexGrow: 1 }}>
            <Input
              placeholder='Search for a trend'
              className='undp-input'
              size='large'
              value={searchQuery}
              onChange={d => {
                setSearchQuery(d.target.value);
              }}
              onPressEnter={() => {
                updateTrendFilters({ ...trendFilters, search: searchQuery });
              }}
            />
            <button
              type='button'
              className='undp-button button-secondary'
              onClick={() => {
                updateTrendFilters({ ...trendFilters, search: searchQuery });
              }}
            >
              Search
            </button>
          </div>
        </div>
      </div>
      {noOfTrendsFiltersActive > 0 ? (
        <div
          className='flex-div flex-wrap margin-top-02 margin-bottom-05'
          style={{
            paddingLeft: '1rem',
            paddingRight: '1rem',
          }}
        >
          {trendFilters.impact !== 'All Ratings' ? (
            <div className='undp-chip undp-chip-blue'>
              Rating: {trendFilters.impact}
            </div>
          ) : null}
          {trendFilters.horizon !== 'All Horizons' ? (
            <div className='undp-chip undp-chip-blue'>
              {trendFilters.horizon}
            </div>
          ) : null}
          {trendFilters.steep_primary !== 'All Primary STEEP+V' ? (
            <div className='undp-chip undp-chip-blue'>
              Primary STEEP+V: {trendFilters.steep_primary.split('–')[0]}
            </div>
          ) : null}
          {trendFilters.steep_secondary !== 'All Secondary STEEP+V' ? (
            <div className='undp-chip undp-chip-blue'>
              Secondary STEEP+V: {trendFilters.steep_secondary.split('–')[0]}
            </div>
          ) : null}
          {trendFilters.signature_primary !==
          'All Primary Signature Solutions/Enabler' ? (
            <div className='undp-chip undp-chip-blue'>
              Primary Signature Solutions/Enabler:{' '}
              {trendFilters.signature_primary}
            </div>
          ) : null}
          {trendFilters.signature_secondary !==
          'All Secondary Signature Solutions/Enabler' ? (
            <div className='undp-chip undp-chip-blue'>
              Secondary Signature Solutions/Enabler:{' '}
              {trendFilters.signature_secondary}
            </div>
          ) : null}
          {trendFilters.sdg !== 'All SDGs' ? (
            <div className='undp-chip undp-chip-blue'>{trendFilters.sdg}</div>
          ) : null}
          {trendFilters.created_for !== 'All Options' ? (
            <div className='undp-chip undp-chip-blue'>
              {trendFilters.created_for}
            </div>
          ) : null}
          {trendFilters.status !== 'All Status' ? (
            <div className='undp-chip undp-chip-blue'>
              {trendFilters.status === 'New'
                ? 'Awaiting Approval'
                : trendFilters.status}
            </div>
          ) : null}
          <button
            type='button'
            className='undp-chip'
            onClick={() => {
              updateNoOfTrendsFiltersActive(0);
              setSearchQuery(undefined);
              updateTrendFilters({
                impact: 'All Ratings',
                horizon: 'All Horizons',
                steep_primary: 'All Primary STEEP+V',
                steep_secondary: 'All Secondary STEEP+V',
                sdg: 'All SDGs',
                signature_primary: 'All Primary Signature Solutions/Enabler',
                signature_secondary:
                  'All Secondary Signature Solutions/Enabler',
                created_for: 'All Options',
                assigned_to: undefined,
                status: 'All Status',
                search: undefined,
              });
            }}
          >
            Clear Filter(s)
          </button>
        </div>
      ) : null}
      <AllTrends view={viewType} />
      <Modal
        className='undp-modal'
        open={showFilterModal}
        onCancel={() => {
          setTempFilters(trendFilters);
          setShowFilterModal(false);
        }}
      >
        <h2 className='undp-typography'>Filter Trends</h2>
        <div className='margin-bottom-07'>
          <div className='flex-div margin-top-07'>
            <div
              style={{
                flexGrow: 1,
                width: 'calc(50% - 0.667rem)',
              }}
            >
              <p className='undp-typography label'>Filter by Primary STEEP+V</p>
              <Select
                className='undp-select'
                style={{
                  flexGrow: 1,
                  minWidth: '15rem',
                }}
                placeholder='Please select'
                defaultValue='All Primary STEEP+V'
                value={tempFilters.steep_primary}
                showSearch
                allowClear
                onChange={values => {
                  setTempFilters({
                    ...tempFilters,
                    steep_primary: values || 'All Primary STEEP+V',
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
            </div>
            <div
              style={{
                flexGrow: 1,
                width: 'calc(50% - 0.667rem)',
              }}
            >
              <p className='undp-typography label'>
                Filter by Secondary STEEP+V
              </p>
              <Select
                className='undp-select'
                style={{
                  flexGrow: 1,
                  minWidth: '15rem',
                }}
                placeholder='Please select'
                defaultValue='All Secondary STEEP+V'
                value={tempFilters.steep_secondary}
                showSearch
                allowClear
                onChange={values => {
                  setTempFilters({
                    ...tempFilters,
                    steep_secondary: values || 'All Secondary STEEP+V',
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
            </div>
          </div>
          <div className='flex-div margin-top-07'>
            <div
              style={{
                flexGrow: 1,
                width: 'calc(50% - 0.667rem)',
              }}
            >
              <p className='undp-typography label'>
                Filter by Primary Signature Solutions/Enabler
              </p>
              <Select
                className='undp-select'
                style={{
                  flexGrow: 1,
                  minWidth: '15rem',
                }}
                placeholder='Please select'
                defaultValue='All Primary Signature Solutions/Enabler'
                value={tempFilters.signature_primary}
                showSearch
                allowClear
                onChange={values => {
                  setTempFilters({
                    ...tempFilters,
                    signature_primary:
                      values || 'All Primary Signature Solutions/Enabler',
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
            </div>
            <div
              style={{
                flexGrow: 1,
                width: 'calc(50% - 0.667rem)',
              }}
            >
              <p className='undp-typography label'>
                Filter by Secondary Signature Solutions/Enabler
              </p>
              <Select
                className='undp-select'
                style={{
                  flexGrow: 1,
                  minWidth: '15rem',
                }}
                placeholder='Please select'
                defaultValue='All Secondary Signature Solutions/Enabler'
                value={tempFilters.signature_secondary}
                showSearch
                allowClear
                onChange={values => {
                  setTempFilters({
                    ...tempFilters,
                    signature_secondary:
                      values || 'All Secondary Signature Solutions/Enabler',
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
            </div>
          </div>
          <div className='margin-top-07'>
            <p className='undp-typography label'>Filter by SDGs</p>
            <Select
              className='undp-select'
              style={{
                flexGrow: 1,
                minWidth: '15rem',
              }}
              placeholder='Please select'
              defaultValue='All SDGs'
              value={tempFilters.sdg}
              showSearch
              allowClear
              onChange={values => {
                setTempFilters({
                  ...tempFilters,
                  sdg: values || 'All SDGs',
                });
              }}
              clearIcon={<div className='clearIcon' />}
            >
              <Select.Option className='undp-select-option' key='All SDGs'>
                All SDGs
              </Select.Option>
              {choices?.sdgs.map(d => (
                <Select.Option className='undp-select-option' key={d}>
                  {d}
                </Select.Option>
              ))}
            </Select>
          </div>
          <div className='margin-top-07'>
            <p className='undp-typography label'>Filter by Impact Rating</p>
            <Select
              className='undp-select'
              style={{
                flexGrow: 1,
                minWidth: '15rem',
              }}
              placeholder='Please select'
              defaultValue='All Ratings'
              value={tempFilters.impact}
              showSearch
              allowClear
              onChange={values => {
                setTempFilters({
                  ...tempFilters,
                  impact: values || 'All Ratings',
                });
              }}
              clearIcon={<div className='clearIcon' />}
            >
              <Select.Option className='undp-select-option' key='All Ratings'>
                All Ratings
              </Select.Option>
              {choices?.ratings.map(d => (
                <Select.Option className='undp-select-option' key={d}>
                  {d}
                </Select.Option>
              ))}
            </Select>
          </div>
          <div className='margin-top-07'>
            <p className='undp-typography label'>Filter by Horizon</p>
            <Select
              className='undp-select'
              style={{
                flexGrow: 1,
                minWidth: '15rem',
              }}
              placeholder='Please select'
              defaultValue='All Horizons'
              value={tempFilters.horizon}
              showSearch
              allowClear
              onChange={values => {
                setTempFilters({
                  ...tempFilters,
                  horizon: values || 'All Horizons',
                });
              }}
              clearIcon={<div className='clearIcon' />}
            >
              <Select.Option className='undp-select-option' key='All Horizons'>
                All Horizons
              </Select.Option>
              {choices?.horizons.map(d => (
                <Select.Option className='undp-select-option' key={d}>
                  {d}
                </Select.Option>
              ))}
            </Select>
          </div>
          <div className='margin-top-07'>
            <p className='undp-typography label'>Filter by Created for</p>
            <Select
              className='undp-select'
              style={{
                flexGrow: 1,
                minWidth: '15rem',
              }}
              placeholder='Please select'
              defaultValue='All Options'
              value={tempFilters.created_for}
              showSearch
              allowClear
              onChange={values => {
                setTempFilters({
                  ...tempFilters,
                  created_for: values || 'All Options',
                });
              }}
              clearIcon={<div className='clearIcon' />}
            >
              <Select.Option className='undp-select-option' key='All SDGs'>
                All Options
              </Select.Option>
              {choices?.created_for.map(d => (
                <Select.Option className='undp-select-option' key={d}>
                  {d}
                </Select.Option>
              ))}
            </Select>
          </div>
          {role === 'Admin' || role === 'Curator' ? (
            <div className='margin-top-07'>
              <p className='undp-typography label'>Filter by Status</p>
              <Select
                className='undp-select'
                style={{
                  flexGrow: 1,
                  minWidth: '15rem',
                }}
                placeholder='Please select'
                defaultValue='All Status'
                value={
                  tempFilters.status === 'New'
                    ? 'Awaiting Approval'
                    : tempFilters.status
                }
                showSearch
                onChange={values => {
                  setTempFilters({
                    ...tempFilters,
                    status:
                      values === 'Awaiting Approval'
                        ? 'New'
                        : (values as 'Approved' | 'All Status'),
                  });
                }}
                clearIcon={<div className='clearIcon' />}
              >
                {['All Status', 'Approved', 'Awaiting Approval'].map(d => (
                  <Select.Option className='undp-select-option' key={d}>
                    {d}
                  </Select.Option>
                ))}
              </Select>
            </div>
          ) : null}
        </div>
        <button
          type='button'
          className='undp-button button-secondary'
          onClick={() => {
            let i = 0;
            if (tempFilters.horizon !== 'All Horizons') {
              i += 1;
            }
            if (tempFilters.impact !== 'All Ratings') {
              i += 1;
            }
            if (tempFilters.status !== 'All Status') {
              i += 1;
            }
            if (tempFilters.steep_primary !== 'All Primary STEEP+V') {
              i += 1;
            }
            if (tempFilters.steep_secondary !== 'All Secondary STEEP+V') {
              i += 1;
            }
            if (
              tempFilters.signature_primary !==
              'All Primary Signature Solutions/Enabler'
            ) {
              i += 1;
            }
            if (
              tempFilters.signature_secondary !==
              'All Secondary Signature Solutions/Enabler'
            ) {
              i += 1;
            }
            if (tempFilters.sdg !== 'All SDGs') {
              i += 1;
            }
            if (tempFilters.created_for !== 'All Options') {
              i += 1;
            }
            updateTrendFilters(tempFilters);
            updateNoOfTrendsFiltersActive(i);
            setShowFilterModal(false);
          }}
        >
          Apply Filters
        </button>
      </Modal>
    </>
  );
}
export function ArchivedTrendsListing() {
  const { role } = useContext(Context);
  const [viewType, setViewType] = useState<'cardView' | 'listView'>('cardView');
  return (
    <>
      <HeroImageEl className='undp-hero-image'>
        <div className='max-width'>
          <h1 className='undp-typography'>
            UNDP Future Trends and Signals System
          </h1>
          <h5 className='undp-typography'>
            The Future Trends and Signals System captures signals of change
            noticed across UNDP, and identifies the trends emerging – helping us
            all make stronger, more future-aware decisions.
          </h5>
        </div>
      </HeroImageEl>
      <div
        className='flex-div margin-top-07 margin-bottom-05 flex-wrap flex-vert-align-center'
        style={{
          paddingLeft: '1rem',
          paddingRight: '1rem',
          justifyContent: 'space-between',
        }}
      >
        <h4 className='undp-typography margin-bottom-00'>
          All Archived Trends
        </h4>
        <div className='flex-div flex-vert-align-center'>
          <Radio.Group
            defaultValue='cardView'
            onChange={e => {
              setViewType(e.target.value as 'cardView' | 'listView');
            }}
            className='undp-button-radio'
          >
            <Radio.Button value='cardView'>Card View</Radio.Button>
            <Radio.Button value='listView'>List View</Radio.Button>
          </Radio.Group>
        </div>
      </div>
      <AuthenticatedTemplate>
        {role === 'Admin' || role === 'Curator' ? (
          <AllTrends isArchived view={viewType} />
        ) : (
          <p className='undp-typography' style={{ color: 'var(--dark-red)' }}>
            Admin rights required to view this page
          </p>
        )}
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <SignInButton buttonText='Sign In to View This Page' />
      </UnauthenticatedTemplate>
    </>
  );
}
