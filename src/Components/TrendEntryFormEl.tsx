/* eslint-disable jsx-a11y/label-has-associated-control */
import { Input, Select, Popconfirm } from 'antd';
import { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
  TrendDataType,
  SignalDataType,
  NewTrendDataType,
  CreateTrendParamsDataType,
  UpdateTrendParamsDataType,
} from '../Types';
import { AddSignalsModal } from './AddSignalsModal';
import Context from '../Context/Context';
import {
  createTrend,
  updateTrend as updateTrendApi,
  deleteTrend,
  searchSignals,
} from '../API';
import { CREATED_FOR } from '../Constants';

interface Props {
  updateTrend?: TrendDataType;
}

const UploadEl = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  border: 2px solid var(--gray-700);
  background-color: var(--white);
`;

const SelectedEl = styled.div`
  font-size: 1rem;
  background-color: var(--gray-100);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

interface HeroImageProps {
  bgImage: string;
}

const UploadedImgEl = styled.div<HeroImageProps>`
  background: linear-gradient(rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.15)),
    ${props => `url(${props.bgImage})`} no-repeat center;
  background-size: cover;
  width: 7.5rem;
  height: 7.5rem;
  margin-top: var(--spacing-03);
  border-radius: 0.25rem;
  border: 1px solid var(--gray-400);
`;

const UploadButtonEl = styled.div`
  color: var(--black);
  text-transform: uppercase;
  cursor: pointer;
  justify-content: center;
  padding: 1rem 0.75rem;
  align-items: center;
  display: flex;
  font-size: 0.875rem;
  line-height: 1;
  width: fit-content;
  background-color: var(--gray-200);
  font-weight: bold;
  border-right: 2px solid var(--gray-400);
  &:hover {
    background-color: var(--gray-300);
  }
`;

const FileAttachmentButton = styled.input`
  display: none;
`;

export function isTrendInvalid(trend: TrendDataType | NewTrendDataType) {
  if (
    trend.headline &&
    trend.description &&
    trend.description.length > 30 &&
    trend.steep_primary &&
    trend.signature_primary &&
    trend.sdgs &&
    trend.sdgs?.length > 0 &&
    trend.impact_description &&
    trend.impact_description.length > 30 &&
    trend.impact_rating &&
    trend.time_horizon
  )
    return false;
  return true;
}

export function TrendEntryFormEl(props: Props) {
  const { updateTrend } = props;
  const { updateNotificationText, choices, userName } = useContext(Context);
  const navigate = useNavigate();
  const [trendData, updateTrendData] = useState<
    TrendDataType | NewTrendDataType
  >(
    updateTrend || {
      status: 'New',
      created_by: userName,
      created_for: undefined,
      headline: undefined,
      description: undefined,
      attachment: undefined,
      steep_primary: undefined,
      steep_secondary: [],
      signature_primary: undefined,
      signature_secondary: [],
      sdgs: [],
      assigned_to: undefined,
      time_horizon: undefined,
      impact_rating: undefined,
      impact_description: undefined,
      connected_signals: [],
    },
  );
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [submittingError, setSubmittingError] = useState<undefined | string>(
    undefined,
  );
  const [signalModal, setSignalModal] = useState(false);

  const [trendsSignal, setTrendsSignal] = useState<number[]>(
    updateTrend ? updateTrend.connected_signals || [] : [],
  );
  const [connectedSignal, setConnectedSignals] = useState<
    SignalDataType[] | null
  >(null);
  const confirmDelete = (id: number, navigatePath: string) => {
    deleteTrend(id)
      .then(() => {
        setButtonDisabled(false);
        navigate(navigatePath);
        updateNotificationText('Successfully deleted the signal');
      })
      .catch(err => {
        setButtonDisabled(false);
        setSubmittingError(
          `${err}. ${
            err.response?.status === 500 ? 'Please try again in some time' : ''
          }`,
        );
      });
  };
  useEffect(() => {
    if (trendsSignal.length > 0) {
      const signalIds = trendsSignal
        .map(id => Number(id))
        .filter(id => !Number.isNaN(id));

      searchSignals({
        ids: signalIds,
        per_page: signalIds.length,
        statuses: ['Approved', 'New'],
      }).then(res => {
        setConnectedSignals(res.data);
      });
    } else {
      setConnectedSignals([]);
    }
  }, [trendsSignal]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fileInputRef = useRef<any>(null);
  const [selectedFileName, setSelectedFileName] = useState<string>('');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFileSelect = (event: any) => {
    if (event.target.files) {
      if (event.target.files[0]) {
        const reader = new FileReader();
        reader.readAsBinaryString(event.target.files[0]);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        reader.onloadend = (e: any) => {
          const base64String = btoa(e.target.result);
          updateTrendData({
            ...trendData,
            attachment: `${event.target.files[0].type};base64,${base64String}`,
          });
        };
      }
      setSelectedFileName(event.target.files[0].name);
    }
  };

  const buildCreateTrendParamsDataType = (): CreateTrendParamsDataType => {
    return {
      description: trendData.description || '',
      headline: trendData.headline || '',
      impact_description: trendData.impact_description || '',
      impact_rating: trendData.impact_rating || '',
      time_horizon: trendData.time_horizon || '',
      sdgs: trendData.sdgs || [],
      status: 'New',
      attachment: trendData.attachment,
      keywords: trendData.keywords,
      location: trendData.location,
      relevance: trendData.relevance,
      signature_primary: trendData.signature_primary,
      signature_secondary: trendData.signature_secondary || undefined,
      steep_primary: trendData.steep_primary,
      steep_secondary: trendData.steep_secondary || undefined,
      assigned_to: trendData.assigned_to || undefined,
      created_for: trendData.created_for || undefined,
      connected_signals: trendsSignal || undefined,
    };
  };

  const buildUpdateTrendParamsDataType = (): UpdateTrendParamsDataType => {
    const params: UpdateTrendParamsDataType = {
      id: trendData.id || 0,
      description: trendData.description || '',
      headline: trendData.headline || '',
      impact_description: trendData.impact_description || '',
      signature_primary: trendData.signature_primary,
      signature_secondary: trendData.signature_secondary,
      impact_rating: trendData.impact_rating || '',
      time_horizon: trendData.time_horizon || '',
      sdgs: trendData.sdgs,
      attachment: trendData.attachment,
      steep_primary: trendData.steep_primary,
      steep_secondary: trendData.steep_secondary,
      status: trendData.status,
      keywords: trendData.keywords,
      location: trendData.location,
      relevance: trendData.relevance,
      created_by: trendData.created_by,
      created_for: trendData.created_for || undefined,
      assigned_to: trendData?.assigned_to || undefined,
      connected_signals:
        connectedSignal?.map(signal => Number(signal.id)) || undefined,
    };

    if (trendData.attachment) {
      params.attachment = trendData.attachment;
    }

    if (
      trendData.signature_secondary &&
      trendData.signature_secondary.length > 0
    ) {
      params.signature_secondary = trendData.signature_secondary;
    }

    if (trendData.steep_secondary && trendData.steep_secondary.length > 0) {
      params.steep_secondary = trendData.steep_secondary;
    }

    return params;
  };

  return (
    <div className='undp-container max-width padding-top-00 padding-bottom-00'>
      <div className='margin-bottom-07'>
        <p className='undp-typography margin-bottom-01'>Trend Headline*</p>
        <Input
          className='undp-input'
          placeholder='Enter trend headline (max 100 characters)'
          value={trendData.headline}
          maxLength={100}
          onChange={d => {
            updateTrendData({
              ...trendData,
              headline: d.target.value,
            });
          }}
        />
        <p className='undp-typography margin-top-02 margin-bottom-00 small-font'>
          A concise, self-sufficient headline that conveys the essence of the
          trend without needing further explanation.{' '}
          {trendData.headline ? 100 - trendData.headline.length : 100}{' '}
          characters left
        </p>
      </div>
      <div className='margin-bottom-07'>
        <p className='undp-typography margin-bottom-01'>Trend Description*</p>
        <Input.TextArea
          className='undp-input'
          placeholder='Enter trend description (max 1000 characters)'
          maxLength={1000}
          status={
            trendData.description
              ? trendData.description.length > 30
                ? ''
                : 'error'
              : ''
          }
          onChange={e => {
            updateTrendData({
              ...trendData,
              description: e.target.value,
            });
          }}
          value={trendData.description}
        />
        <p className='undp-typography margin-top-02 margin-bottom-00 small-font'>
          A concise definition of the trend that makes it easy to decide which
          signals link to it. Min 30 characters required.{' '}
          {trendData.description ? 1000 - trendData.description.length : 1000}{' '}
          characters left
        </p>
      </div>
      <div className='flex-div'>
        <div
          className='margin-bottom-07'
          style={{ width: 'calc(50% - 0.5rem)' }}
        >
          <p className='undp-typography margin-bottom-01'>Time Horizon*</p>
          <Select
            className='undp-select trend-entry-select'
            placeholder='Select time horizon'
            onChange={e => {
              updateTrendData({
                ...trendData,
                time_horizon: e,
              });
            }}
            value={trendData.time_horizon}
          >
            {choices?.horizon.map((d, i) => (
              <Select.Option className='undp-select-option' key={i} value={d}>
                {d}
              </Select.Option>
            ))}
          </Select>
          <p className='undp-typography margin-top-02 margin-bottom-00 small-font'>
            Timeframe/period during which this trend might apply
          </p>
        </div>
        <div
          className='margin-bottom-07'
          style={{ width: 'calc(50% - 0.5rem)' }}
        >
          <p className='undp-typography margin-bottom-01'>Impact Rating*</p>
          <Select
            className='undp-select trend-entry-select'
            placeholder='Select impact rating'
            onChange={e => {
              updateTrendData({
                ...trendData,
                impact_rating: e,
              });
            }}
            value={trendData.impact_rating || undefined}
          >
            {choices?.rating.map((d, i) => (
              <Select.Option className='undp-select-option' key={i} value={d}>
                {d}
              </Select.Option>
            ))}
          </Select>
          <p className='undp-typography margin-top-02 margin-bottom-00 small-font'>
            How great of an impact might this trend make on development on the
            selected time horizon?
          </p>
        </div>
      </div>
      <div className='margin-bottom-07'>
        <p className='undp-typography margin-bottom-01'>Impact Description*</p>
        <Input.TextArea
          className='undp-input'
          placeholder='Enter impact description'
          status={
            trendData.impact_description
              ? trendData.impact_description.length > 30
                ? ''
                : 'error'
              : ''
          }
          value={trendData.impact_description || undefined}
          onChange={e => {
            updateTrendData({
              ...trendData,
              impact_description: e.target.value,
            });
          }}
        />
        <p className='undp-typography margin-top-02 margin-bottom-00 small-font'>
          A concise description of the impact/s of this trend on development.
          Min 30 characters required
        </p>
      </div>
      <div className='margin-bottom-07'>
        <p className='undp-typography margin-bottom-01'>Cover Image</p>
        {trendData.attachment ? (
          <div className='flex-div padding-bottom-05'>
            <UploadedImgEl bgImage={trendData.attachment} />
            <button
              type='button'
              className='undp-button button-tertiary flex'
              onClick={() => {
                setSelectedFileName('');
                updateTrendData({
                  ...trendData,
                  attachment: undefined,
                });
              }}
              style={{
                backgroundColor: 'var(--gray-300)',
                padding: 'var(--spacing-05)',
                alignSelf: 'flex-end',
              }}
            >
              Remove Image
            </button>
          </div>
        ) : null}
        <UploadEl>
          <label htmlFor='file-upload-analyze' className='custom-file-upload'>
            <UploadButtonEl style={{ width: '177.55px' }}>
              Upload a Image
            </UploadButtonEl>
          </label>
          {selectedFileName !== '' ? (
            <SelectedEl>
              Selected <span className='bold'>{selectedFileName}</span>
            </SelectedEl>
          ) : (
            <SelectedEl style={{ opacity: '0.6' }}>No file selected</SelectedEl>
          )}
          <FileAttachmentButton
            ref={fileInputRef}
            id='file-upload-analyze'
            accept='image/png, image/jpeg, image/jpg, image/gif, image/svg'
            type='file'
            onChange={handleFileSelect}
          />
        </UploadEl>
        <p className='undp-typography margin-top-02 margin-bottom-00 small-font'>
          {trendData.attachment
            ? 'Uploading file with replace the already uploaded image shown above. '
            : ''}
          Attach an image here to illustrate this Trend, if available. Use only
          images that are non-copyright or license-free/Creative Commons. File
          must be maximum 1 MBs. Compress larger images, if applicable.
        </p>
      </div>
      <div className='margin-bottom-07'>
        <div className='flex-div flex-wrap margin-bottom-00'>
          <div style={{ width: 'calc(50% - 0.5rem)' }}>
            <p className='undp-typography margin-bottom-01'>Primary STEEP+V*</p>
            <Select
              className='undp-select trend-entry-select'
              placeholder='Select STEEP+V'
              onChange={e => {
                updateTrendData({
                  ...trendData,
                  steep_primary: e,
                });
              }}
              value={trendData.steep_primary}
            >
              {choices?.steep.map((d, i) => (
                <Select.Option className='undp-select-option' key={i} value={d}>
                  {d}
                </Select.Option>
              ))}
            </Select>
          </div>
          <div style={{ width: 'calc(50% - 0.5rem)' }}>
            <p className='undp-typography margin-bottom-01'>
              Secondary STEEP+V
            </p>
            <Select
              className='undp-select trend-entry-multi-select'
              placeholder='Select STEEP+V'
              mode='multiple'
              onChange={e => {
                if (e.length > 1) {
                  updateTrendData({
                    ...trendData,
                    steep_secondary: [e[0], e[e.length - 1]],
                  });
                } else {
                  updateTrendData({
                    ...trendData,
                    steep_secondary: e.length === 0 || !e ? [] : e,
                  });
                }
              }}
              value={
                trendData.steep_secondary
                  ? trendData.steep_secondary?.length > 0 &&
                    trendData.steep_secondary
                    ? trendData.steep_secondary
                    : undefined
                  : undefined
              }
            >
              {choices?.steep.map((d, i) => (
                <Select.Option className='undp-select-option' key={i} value={d}>
                  {d}
                </Select.Option>
              ))}
            </Select>
          </div>
        </div>
        <p className='undp-typography margin-top-02 margin-bottom-07 small-font'>
          STEEP+V analysis methodology stands for Social, Technological,
          Economic, Environmental (or Ecological), Political and Values
        </p>
      </div>
      <div className='flex-div flex-wrap margin-bottom-07'>
        <div style={{ width: 'calc(50% - 0.5rem)' }}>
          <p className='undp-typography margin-bottom-01'>
            Primary Signature Solution/Enabler*
          </p>
          <Select
            className='undp-select trend-entry-select'
            placeholder='Select Signature Solution'
            onChange={e => {
              updateTrendData({
                ...trendData,
                signature_primary: e,
              });
            }}
            value={trendData.signature_primary}
          >
            {choices?.signature.map((d, i) => (
              <Select.Option className='undp-select-option' key={i} value={d}>
                {d}
              </Select.Option>
            ))}
          </Select>
        </div>
        <div style={{ width: 'calc(50% - 0.5rem)' }}>
          <p className='undp-typography margin-bottom-01'>
            Additional Signature Solution/Enabler
          </p>
          <Select
            className='undp-select trend-entry-multi-select'
            placeholder='Select Signature Solution'
            onChange={e => {
              if (e.length > 1) {
                updateTrendData({
                  ...trendData,
                  signature_secondary: [e[0], e[e.length - 1]],
                });
              } else {
                updateTrendData({
                  ...trendData,
                  signature_secondary: e.length === 0 || !e ? [] : e,
                });
              }
            }}
            mode='multiple'
            value={
              trendData.signature_secondary
                ? trendData.signature_secondary?.length > 0 &&
                  trendData.signature_secondary
                  ? trendData.signature_secondary
                  : undefined
                : undefined
            }
            clearIcon={<div className='clearIcon' />}
            allowClear
          >
            {choices?.signature.map((d, i) => (
              <Select.Option className='undp-select-option' key={i} value={d}>
                {d}
              </Select.Option>
            ))}
          </Select>
        </div>
      </div>
      <div className='margin-bottom-07' style={{ width: '100%' }}>
        <p className='undp-typography margin-bottom-01'>SDGs*</p>
        <Select
          className='undp-select trend-entry-multi-select'
          mode='multiple'
          placeholder='Select SDG'
          maxTagCount='responsive'
          onChange={e => {
            if (e.length > 1) {
              updateTrendData({
                ...trendData,
                sdgs: [e[0], e[e.length - 1]],
              });
            } else {
              updateTrendData({
                ...trendData,
                sdgs: e.length === 0 || !e ? [] : e,
              });
            }
          }}
          clearIcon={<div className='clearIcon' />}
          allowClear
          value={
            trendData.sdgs
              ? trendData.sdgs?.length > 0 && trendData.sdgs
                ? trendData.sdgs
                : undefined
              : undefined
          }
        >
          {choices?.goal.map((d, i) => (
            <Select.Option className='undp-select-option' key={i} value={d}>
              {d}
            </Select.Option>
          ))}
        </Select>
        <p className='undp-typography margin-top-02 margin-bottom-00 small-font'>
          Which SDG is it most closely connected to? Select relevant SDGs. Max 2
          SDGs allowed.
        </p>
      </div>
      <div className='margin-bottom-09'>
        <p className='undp-typography bold'>Signals related to the trend</p>
        {connectedSignal ? (
          <>
            {connectedSignal?.map((d, i) => (
              <div
                className='flex-div flex-space-between flex-vert-align-center'
                key={i}
                style={{
                  width: 'calc(100% - 2rem)',
                  padding: 'var(--spacing-05)',
                  backgroundColor: 'var(--gray-200)',
                  border: '1px solid var(--gray-400)',
                  marginBottom: 'var(--spacing-05)',
                }}
              >
                <div>
                  <p className='undp-typography margin-bottom-01'>
                    {d.headline}
                  </p>
                  <p className='undp-typography small-font'>{d.description}</p>
                </div>
                <button
                  onClick={() => {
                    const arr = [...trendsSignal.filter(el => el !== d.id)];
                    setTrendsSignal(arr);
                  }}
                  type='button'
                  className='undp-button button-tertiary padding-bottom-00 padding-top-00'
                >
                  <img
                    src='https://design.undp.org/icons/times.svg'
                    alt='close-icon'
                  />
                </button>
              </div>
            ))}
            <button
              className='undp-button button-tertiary'
              type='button'
              onClick={() => {
                setSignalModal(true);
              }}
              style={{
                backgroundColor: 'var(--gray-300)',
                padding: 'var(--spacing-05)',
              }}
            >
              Select signals
            </button>
          </>
        ) : (
          <p className='undp-typography'>Loading signals...</p>
        )}
      </div>
      <div className='margin-bottom-07'>
        <p className='undp-typography margin-bottom-01'>Created For</p>
        <Select
          className='undp-select trend-entry-select'
          placeholder='Created For'
          onChange={e => {
            updateTrendData({
              ...trendData,
              created_for: e,
            });
          }}
          value={trendData.created_for}
        >
          {CREATED_FOR.map((d, i) => (
            <Select.Option className='undp-select-option' key={i} value={d}>
              {d}
            </Select.Option>
          ))}
        </Select>
      </div>
      {updateTrend ? (
        <div className='margin-bottom-07'>
          <p className='undp-typography margin-bottom-01'>
            Status of the trend
          </p>
          <Select
            className='undp-select'
            placeholder='Select Status'
            onChange={e => {
              updateTrendData({
                ...trendData,
                status: e === 'Awaiting Approval' ? 'New' : e,
              });
            }}
            value={
              trendData.status === 'New'
                ? 'Awaiting Approval'
                : trendData.status
            }
          >
            {['Approved', 'Archived', 'Awaiting Approval'].map((d, i) => (
              <Select.Option className='undp-select-option' key={i} value={d}>
                {d}
              </Select.Option>
            ))}
          </Select>
        </div>
      ) : null}
      <div className='flex-div flex-vert-align-center margin-top-09'>
        {!updateTrend ? ( // new trend
          <div className='margin-top-00'>
            {submittingError ? (
              <p
                className='margin-bottom-05'
                style={{ color: 'var(--dark-red)' }}
              >
                {submittingError}
              </p>
            ) : null}
            <div className='flex-div flex-vert-align-center'>
              <button
                className={`${
                  isTrendInvalid(trendData) || buttonDisabled ? 'disabled ' : ''
                }undp-button button-secondary button-arrow`}
                type='button'
                disabled={isTrendInvalid(trendData) || buttonDisabled}
                onClick={() => {
                  setButtonDisabled(true);
                  setSubmittingError(undefined);
                  const currentParams = buildCreateTrendParamsDataType();
                  createTrend(currentParams)
                    .then(() => {
                      setButtonDisabled(false);
                      navigate('/trends');
                      updateNotificationText(
                        'Successfully submitted the trend for review',
                      );
                    })
                    .catch(err => {
                      setButtonDisabled(false);
                      setSubmittingError(
                        `${err}. ${
                          err.response?.status === 500
                            ? 'Please try again in some time'
                            : ''
                        }`,
                      );
                    });
                }}
              >
                Submit Trend
              </button>
              {buttonDisabled ? <div className='undp-loader' /> : null}
            </div>
          </div>
        ) : (
          <div className='margin-top-00'>
            {submittingError ? (
              <p
                className='margin-bottom-05'
                style={{ color: 'var(--dark-red)' }}
              >
                {submittingError}
              </p>
            ) : null}
            <div className='flex-div flex-vert-align-center'>
              <button
                className={`${
                  isTrendInvalid(trendData) || buttonDisabled ? 'disabled ' : ''
                }undp-button button-secondary button-arrow`}
                type='button'
                disabled={isTrendInvalid(trendData) || buttonDisabled}
                onClick={() => {
                  setButtonDisabled(true);
                  setSubmittingError(undefined);
                  if (trendData.id)
                    updateTrendApi(
                      trendData.id,
                      buildUpdateTrendParamsDataType(),
                    )
                      .then(() => {
                        setButtonDisabled(false);
                        navigate(`/trends/${updateTrend.id}`);
                        updateNotificationText(
                          'Successfully updated the trend',
                        );
                      })
                      .catch(err => {
                        setButtonDisabled(false);
                        setSubmittingError(
                          `${err}. ${
                            err.response?.status === 500
                              ? 'Please try again in some time'
                              : ''
                          }`,
                        );
                      });
                }}
              >
                Update Trend
              </button>
              {buttonDisabled ? <div className='undp-loader' /> : null}
              {updateTrend.status === 'Archived' ? (
                <Popconfirm
                  title='Delete Trend'
                  description='Are you sure to delete this trend?'
                  onConfirm={() =>
                    confirmDelete(updateTrend.id, '../../../archived-trends')
                  }
                  onCancel={() => {
                    updateNotificationText('Delete canceled');
                  }}
                  okText='Yes'
                  cancelText='No'
                >
                  <button
                    className='undp-button button-secondary button-arrow'
                    type='button'
                  >
                    Delete Archived Trend
                  </button>
                </Popconfirm>
              ) : null}
            </div>
          </div>
        )}
      </div>
      {signalModal ? (
        <AddSignalsModal
          setSignalModal={setSignalModal}
          trendsSignal={trendsSignal}
          setTrendsSignal={setTrendsSignal}
        />
      ) : null}
    </div>
  );
}
