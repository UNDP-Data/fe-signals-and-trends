/* eslint-disable jsx-a11y/label-has-associated-control */
import { Input, Select, Popconfirm, Checkbox, Tooltip } from 'antd';
import axios, { AxiosError, AxiosResponse } from 'axios';
import sortBy from 'lodash.sortby';
import { useNavigate } from 'react-router-dom';
import { useContext, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { API_ACCESS_TOKEN } from '../Constants';
import { NewSignalDataType, SignalDataType, TrendDataType } from '../Types';
import { AddTrendsModal } from './AddTrendsModal';
import Context from '../Context/Context';

interface Props {
  updateSignal?: SignalDataType;
  draft: boolean;
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

interface HeroImageProps {
  bgImage: string;
}

const UploadedImgEl = styled.div<HeroImageProps>`
  background: linear-gradient(rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.15)),
    ${props => `url(data:${props.bgImage})`} no-repeat center;
  background-size: cover;
  width: 7.5rem;
  height: 7.5rem;
  margin-top: var(--spacing-03);
  border-radius: 0.25rem;
  border: 1px solid var(--gray-400);
`;

const FileAttachmentButton = styled.input`
  display: none;
`;

const isUrl = (str?: string) => {
  if (str) {
    const urlPattern = new RegExp(
      '^(https?:\\/\\/)?' + // validate protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // validate domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // validate OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // validate port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // validate query string
        '(\\#[-a-z\\d_]*)?$',
      'i',
    ); // validate fragment locator

    return !!urlPattern.test(str);
  }
  return false;
};
export function isSignalInvalid(
  signal: SignalDataType | NewSignalDataType,
  keyWords: [string | undefined, string | undefined, string | undefined],
) {
  if (
    signal.headline &&
    signal.created_unit &&
    signal.description &&
    signal.description.length > 30 &&
    keyWords.filter(d => d !== undefined).length > 0 &&
    signal.location &&
    signal.steep_primary &&
    signal.signature_primary &&
    signal.sdgs &&
    signal.sdgs?.length > 0 &&
    signal.relevance &&
    signal.url
  ) {
    return false;
  }
  return true;
}

export function SignalEntryFormEl(props: Props) {
  const { updateSignal, draft } = props;
  const { userName, role, accessToken, updateNotificationText, choices, unit } =
    useContext(Context);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [signalData, updateSignalData] = useState<
    SignalDataType | NewSignalDataType
  >(
    updateSignal || {
      status: 'New',
      created_by: userName,
      headline: undefined,
      description: undefined,
      attachment: undefined,
      steep_primary: undefined,
      steep_secondary: [],
      signature_primary: undefined,
      signature_secondary: [],
      sdgs: [],
      created_unit: unit,
      url: undefined,
      relevance: undefined,
      keywords: [],
      location: undefined,
      score: undefined,
      connected_trends: [],
      created_for: undefined,
    },
  );
  const navigate = useNavigate();
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [acceptTOS, setAcceptTOS] = useState(false);
  const [trendsList, setTrendsList] = useState<undefined | TrendDataType[]>(
    undefined,
  );
  const [trendModal, setTrendModal] = useState(false);
  const [selectedTrendsList, setSelectedTrendsList] = useState<number[]>(
    updateSignal?.connected_trends || [],
  );
  const [submittingError, setSubmittingError] = useState<undefined | string>(
    undefined,
  );
  const [keyword1, setKeyword1] = useState<string | undefined>(
    updateSignal?.keywords ? updateSignal?.keywords[0] || undefined : undefined,
  );
  const [keyword2, setKeyword2] = useState<string | undefined>(
    updateSignal?.keywords ? updateSignal?.keywords[1] || undefined : undefined,
  );
  const [keyword3, setKeyword3] = useState<string | undefined>(
    updateSignal?.keywords ? updateSignal?.keywords[2] || undefined : undefined,
  );
  const confirmDelete = (id: number, navigatePath: string) => {
    axios({
      method: 'delete',
      url: `https://signals-and-trends-api.azurewebsites.net/v1/signals/delete?ids=${id}`,
      data: {},
      headers: {
        'Content-Type': 'application/json',
        access_token: accessToken,
      },
    })
      .then(() => {
        setButtonDisabled(false);
        navigate(navigatePath);
        updateNotificationText('Successfully deleted the signal');
      })
      .catch(err => {
        setButtonDisabled(false);
        setSubmittingError(
          `Error code ${err.response?.status}: ${err.response?.data}. ${
            err.response?.status === 500 ? 'Please try again in some time' : ''
          }`,
        );
      });
  };
  useEffect(() => {
    if (selectedTrendsList.length > 0) {
      axios
        .get(
          `https://signals-and-trends-api.azurewebsites.net/v1/trends/fetch?ids=${selectedTrendsList.join(
            '&ids=',
          )}`,
          {
            headers: {
              access_token: accessToken || API_ACCESS_TOKEN,
            },
          },
        )
        .then((response: AxiosResponse) => {
          setTrendsList(
            sortBy(response.data, d => Date.parse(d.created_at)).reverse(),
          );
        });
    } else {
      setTrendsList([]);
    }
  }, [selectedTrendsList]);
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
          updateSignalData({
            ...signalData,
            attachment: `${event.target.files[0].type};base64,${base64String}`,
          });
        };
      }
      setSelectedFileName(event.target.files[0].name);
    }
  };
  return (
    <div className='undp-container max-width padding-top-00 padding-bottom-00'>
      <p className='undp-typography'>
        A Signal is defined as a single piece of evidence or indicator that
        points to, relates to, or otherwise supports a trend. A signal can also
        stand alone as a potential indicator of future change in one or more
        trends.
      </p>
      <div className='margin-bottom-07'>
        <div className='margin-bottom-07'>
          <p className='undp-typography margin-bottom-01'>Signal Source*</p>
          <div className='flex-div margin-bottom-00'>
            <div style={{ flexGrow: 1 }}>
              <Input
                className='undp-input'
                placeholder='Enter signal source'
                onChange={d => {
                  updateSignalData({
                    ...signalData,
                    url: d.target.value,
                  });
                }}
                value={signalData.url}
              />
            </div>
          </div>
          <p className='undp-typography margin-top-02 small-font'>
            If no URL is available, provide description of source - e.g., in a
            meeting with Minister X; or taxi in country X. Please note the
            &quot;Fill form using AI&quot; only work with links starting with
            http.
          </p>
          <Checkbox
            className='undp-checkbox'
            onChange={e => {
              setAcceptTOS(e.target.checked);
            }}
            checked={acceptTOS}
          >
            <div className='label margin-bottom-00'>
              I accept{' '}
              <Tooltip
                placement='right'
                title={
                  <span>
                    By using the &quot;FILL FORM WITH AI&quot; feature,
                    henceforth referred to as the &apos;AI feature&apos;, I
                    confirm that the signal source website, henceforth referred
                    to as the &apos;Website&apos;, permits automated collection
                    and analysis of its contents. I acknowledge and agree that
                    the use of the AI feature may be subject to the terms of use
                    of the Website and potentially infringe copyright laws. I
                    assume all responsibility for ensuring that the use of the
                    AI feature complies with all applicable laws, regulations
                    and the Website&apos;s terms of use. UNDP shall not be held
                    liable for any direct, indirect, incidental, consequential,
                    punitive, or other damages arising from or relating to my
                    use of the AI feature, regardless of the form of action or
                    the basis of the claim.
                  </span>
                }
                arrow={false}
                overlayClassName='undp-tooltip'
              >
                <span style={{ textDecoration: 'underline' }}>
                  term and condition
                </span>
              </Tooltip>{' '}
              for using &quot;Fill Form with AI&quot;
            </div>
          </Checkbox>
          {error ? (
            <p
              className='undp-typography margin-top-02 small-font margin-bottom-00'
              style={{ color: 'var(--dark-red)' }}
            >
              Unable to fetch data using AI from the URL. Please try again later
              and make sure its valid URL.
            </p>
          ) : null}
          <button
            type='button'
            className={`undp-button button-primary ${
              !isUrl(signalData.url) || loading || !acceptTOS ? 'disabled' : ''
            }`}
            style={{ flexShrink: 0, flexGrow: 0 }}
            disabled={!isUrl(signalData.url) || loading || !acceptTOS}
            onClick={() => {
              setError(false);
              if (isUrl(signalData.url)) {
                setLoading(true);
                axios
                  .get(
                    `https://signals-and-trends-api.azurewebsites.net/v1/signals/generate?url=${signalData.url}`,
                    {
                      headers: {
                        access_token: accessToken || API_ACCESS_TOKEN,
                      },
                    },
                  )
                  .then((response: AxiosResponse) => {
                    setKeyword1(response.data.keywords[0]);
                    setKeyword2(response.data.keywords[1]);
                    setKeyword3(response.data.keywords[2]);
                    updateSignalData({
                      ...signalData,
                      description: response.data.description,
                      headline: response.data.headline,
                      keywords: [...response.data.keywords],
                      signature_primary: response.data.signature_primary,
                      sdgs: response.data.sdgs,
                      location: response.data.location,
                      relevance: response.data.relevance,
                      signature_secondary: response.data.signature_secondary,
                      steep_primary: response.data.steep_primary,
                      steep_secondary: response.data.steep_secondary,
                    });
                    setLoading(false);
                  })
                  .catch((_err: AxiosError) => {
                    setError(true);
                    setLoading(false);
                  });
              }
            }}
          >
            {!loading ? 'Fill form using AI' : 'Fetching Data...'}
          </button>
        </div>
        <p className='undp-typography margin-bottom-01'>Signal Title*</p>
        <Input
          className='undp-input'
          placeholder='Enter signal title (max 100 characters)'
          value={signalData.headline}
          maxLength={100}
          onChange={d => {
            updateSignalData({
              ...signalData,
              headline: d.target.value,
            });
          }}
          disabled={loading}
        />
        <p className='undp-typography margin-top-02 margin-bottom-00 small-font'>
          Useful titles are clear, concise and can stand alone as a simple
          description of the signal.{' '}
          {signalData.headline ? 100 - signalData.headline.length : 100}{' '}
          characters left
        </p>
      </div>
      <div className='margin-bottom-07'>
        <p className='undp-typography margin-bottom-01'>Signal Description*</p>
        <Input.TextArea
          className='undp-input'
          placeholder='Enter signal description (max 1000 characters)'
          maxLength={1000}
          status={
            signalData.description
              ? signalData.description.length > 30
                ? ''
                : 'error'
              : ''
          }
          onChange={e => {
            updateSignalData({
              ...signalData,
              description: e.target.value,
            });
          }}
          value={signalData.description}
          disabled={loading}
        />
        <p className='undp-typography margin-top-02 margin-bottom-00 small-font'>
          What is the Signal about? Keep this description concise and think
          about using commonly used terms and clear language. This should be
          your summarised description, not cut-and-paste from article. Min 30
          characters required.{' '}
          {signalData.description ? 1000 - signalData.description.length : 1000}{' '}
          characters left
        </p>
      </div>
      <div className='flex-div'>
        <div className='margin-bottom-07' style={{ width: '100%' }}>
          <p className='undp-typography margin-bottom-01'>
            Location of the signal*
          </p>
          <Select
            className='undp-select'
            placeholder='Select location'
            onChange={(e: string) => {
              updateSignalData({
                ...signalData,
                location: e,
              });
            }}
            value={signalData.location}
            disabled={loading}
            showSearch
          >
            {choices?.locations.map((d, i) => (
              <Select.Option className='undp-select-option' key={i} value={d}>
                {d}
              </Select.Option>
            ))}
          </Select>
          <p className='undp-typography margin-top-02 margin-bottom-00 small-font'>
            Region and/or country for which this signal has greatest relevance
          </p>
        </div>
      </div>
      <div className='margin-bottom-07'>
        <p className='undp-typography margin-bottom-01'>Signal Relevance*</p>
        <Input.TextArea
          className='undp-input'
          placeholder='Enter signal relevance'
          onChange={e => {
            updateSignalData({
              ...signalData,
              relevance: e.target.value,
            });
          }}
          value={signalData.relevance}
          disabled={loading}
        />
        <p className='undp-typography margin-top-02 margin-bottom-00 small-font'>
          What is the significance of this Signal to UNDP? Consider both the
          near term and longer term futures of development.
        </p>
      </div>
      <div className='margin-bottom-07'>
        <div style={{ width: '100%' }}>
          <p className='undp-typography margin-bottom-01'>Primary STEEP+V*</p>
          <Select
            className='undp-select'
            placeholder='Select STEEP+V'
            onChange={e => {
              updateSignalData({
                ...signalData,
                steep_primary: e,
              });
            }}
            value={signalData.steep_primary}
            disabled={loading}
          >
            {choices?.steepv.map((d, i) => (
              <Select.Option className='undp-select-option' key={i} value={d}>
                {d}
              </Select.Option>
            ))}
          </Select>
        </div>
        <p className='undp-typography margin-top-02 margin-bottom-00 small-font'>
          STEEP+V analysis methodology stands for Social, Technological,
          Economic, Environmental (or Ecological), Political and Values
        </p>
      </div>
      <div style={{ width: '100%' }} className='margin-bottom-07'>
        <p className='undp-typography margin-bottom-01'>Secondary STEEP+V</p>
        <Select
          className='undp-select'
          placeholder='Select STEEP+V'
          mode='multiple'
          maxTagCount='responsive'
          disabled={loading}
          onChange={e => {
            if (e.length > 1) {
              updateSignalData({
                ...signalData,
                steep_secondary: [e[0], e[e.length - 1]],
              });
            } else {
              updateSignalData({
                ...signalData,
                steep_secondary: e.length === 0 || !e ? [] : e,
              });
            }
          }}
          value={
            signalData.steep_secondary
              ? signalData.steep_secondary?.length > 0 &&
                signalData.steep_secondary
                ? signalData.steep_secondary
                : undefined
              : undefined
          }
        >
          {choices?.steepv.map((d, i) => (
            <Select.Option className='undp-select-option' key={i} value={d}>
              {d}
            </Select.Option>
          ))}
        </Select>
      </div>
      <div className='margin-bottom-07'>
        <p className='undp-typography margin-bottom-01'>Cover Image</p>
        {signalData.attachment ? (
          <div className='flex-div padding-bottom-05'>
            <UploadedImgEl bgImage={signalData.attachment} />
            <button
              type='button'
              className='undp-button button-tertiary flex'
              onClick={() => {
                setSelectedFileName('');
                updateSignalData({
                  ...signalData,
                  attachment: undefined,
                });
              }}
              disabled={loading}
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
          {signalData.attachment
            ? 'Uploading file with replace the already uploaded image shown above. '
            : ''}
          Attach an image here to illustrate this Signal, if available. Use only
          images that are non-copyright or license-free/Creative Commons. File
          must be maximum 1 MBs. Compress larger images, if applicable.
        </p>
      </div>
      <div className='margin-bottom-07'>
        <p className='undp-typography margin-bottom-01'>Keywords*</p>
        <div className='flex-div'>
          <Input
            className='undp-input'
            placeholder='Enter Keyword#1'
            onChange={e => {
              setKeyword1(e.target.value);
            }}
            disabled={loading}
            value={keyword1 || undefined}
          />
          <Input
            className='undp-input'
            placeholder='Enter Keyword#2'
            onChange={e => {
              setKeyword2(e.target.value);
            }}
            disabled={loading}
            value={keyword2 || undefined}
          />
          <Input
            className='undp-input'
            placeholder='Enter Keyword#3'
            onChange={e => {
              setKeyword3(e.target.value);
            }}
            disabled={loading}
            value={keyword3 || undefined}
          />
        </div>
        <p className='undp-typography margin-top-02 margin-bottom-00 small-font'>
          Use clear, simple keywords for ease of searchability.
        </p>
      </div>
      <div className='flex-div flex-wrap margin-bottom-07'>
        <div style={{ width: 'calc(50% - 0.5rem)' }}>
          <p className='undp-typography margin-bottom-01'>
            Primary Signature Solution/Enabler*
          </p>
          <Select
            className='undp-select'
            placeholder='Select Signature Solution'
            onChange={e => {
              updateSignalData({
                ...signalData,
                signature_primary: e,
              });
            }}
            disabled={loading}
            value={signalData.signature_primary}
          >
            {choices?.signatures.map((d, i) => (
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
            className='undp-select'
            placeholder='Select Signature Solution'
            disabled={loading}
            onChange={e => {
              if (e.length > 1) {
                updateSignalData({
                  ...signalData,
                  signature_secondary: [e[0], e[e.length - 1]],
                });
              } else {
                updateSignalData({
                  ...signalData,
                  signature_secondary: e.length === 0 || !e ? [] : e,
                });
              }
            }}
            mode='multiple'
            value={
              signalData.signature_secondary
                ? signalData.signature_secondary?.length > 0 &&
                  signalData.signature_secondary
                  ? signalData.signature_secondary
                  : undefined
                : undefined
            }
            clearIcon={<div className='clearIcon' />}
            allowClear
          >
            {choices?.signatures.map((d, i) => (
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
          className='undp-select'
          mode='multiple'
          placeholder='Select SDG'
          maxTagCount='responsive'
          disabled={loading}
          onChange={e => {
            if (e.length > 1) {
              updateSignalData({
                ...signalData,
                sdgs: [e[0], e[e.length - 1]],
              });
            } else {
              updateSignalData({
                ...signalData,
                sdgs: e.length === 0 || !e ? [] : e,
              });
            }
          }}
          clearIcon={<div className='clearIcon' />}
          allowClear
          value={
            signalData.sdgs
              ? signalData.sdgs?.length > 0 && signalData.sdgs
                ? signalData.sdgs
                : undefined
              : undefined
          }
        >
          {choices?.sdgs.map((d, i) => (
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
      {role === 'Curator' || role === 'Admin' ? (
        <div className='margin-bottom-07' style={{ width: '100%' }}>
          <p className='undp-typography margin-bottom-01'>Signal Score</p>
          <Select
            className='undp-select'
            placeholder='Select Score'
            disabled={loading}
            onChange={e => {
              updateSignalData({
                ...signalData,
                score: e,
              });
            }}
            value={signalData.score}
          >
            {choices?.scores.map((d, i) => (
              <Select.Option className='undp-select-option' key={i} value={d}>
                {d}
              </Select.Option>
            ))}
          </Select>
          <p className='undp-typography margin-top-02 margin-bottom-00 small-font'>
            Signal score can only be seen by the curators and admins
          </p>
        </div>
      ) : null}
      <div className='margin-bottom-07'>
        <p className='undp-typography bold'>Link signal to trend(s)</p>
        {trendsList ? (
          <>
            {trendsList?.map((d, i) => (
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
                    const arr = [...trendsList.filter(el => el.id !== d.id)];
                    setTrendsList(arr);
                    setSelectedTrendsList(arr.map(k => k.id));
                  }}
                  disabled={loading}
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
                setTrendModal(true);
              }}
              disabled={loading}
              style={{
                backgroundColor: 'var(--gray-300)',
                padding: 'var(--spacing-05)',
              }}
            >
              Select trends
            </button>
          </>
        ) : (
          <p className='undp-typography'>Loading trends...</p>
        )}
      </div>
      <div className='margin-bottom-07'>
        <p className='undp-typography margin-bottom-01'>Created For</p>
        <Select
          className='undp-select'
          placeholder='Created For'
          disabled={loading}
          onChange={e => {
            updateSignalData({
              ...signalData,
              created_for: e,
            });
          }}
          value={signalData.created_for}
        >
          {choices?.created_for.map((d, i) => (
            <Select.Option className='undp-select-option' key={i} value={d}>
              {d}
            </Select.Option>
          ))}
        </Select>
      </div>
      <div className='margin-bottom-07'>
        <p className='undp-typography margin-bottom-01'>Unit</p>
        <Select
          className='undp-select'
          placeholder='Select Unit'
          disabled={loading}
          onChange={e => {
            updateSignalData({
              ...signalData,
              created_unit: e,
            });
          }}
          value={signalData.created_unit}
        >
          {choices?.unit_names.map((d, i) => (
            <Select.Option className='undp-select-option' key={i} value={d}>
              {d}
            </Select.Option>
          ))}
        </Select>
      </div>
      {updateSignal && !draft ? (
        <div className='margin-bottom-07'>
          <p className='undp-typography margin-bottom-01'>
            Status of the signal
          </p>
          <Select
            className='undp-select'
            placeholder='Select Status'
            disabled={loading}
            onChange={e => {
              updateSignalData({
                ...signalData,
                status: e === 'Awaiting Approval' ? 'New' : e,
              });
            }}
            value={
              signalData.status === 'New'
                ? 'Awaiting Approval'
                : signalData.status
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
        {updateSignal ? (
          updateSignal.status === 'Draft' ? (
            <div className='flex-div'>
              <button
                className={`${
                  isSignalInvalid(signalData, [keyword1, keyword2, keyword3]) ||
                  buttonDisabled ||
                  loading
                    ? 'disabled '
                    : ''
                }undp-button button-secondary button-arrow`}
                type='button'
                disabled={
                  isSignalInvalid(signalData, [keyword1, keyword2, keyword3]) ||
                  buttonDisabled ||
                  loading
                }
                onClick={() => {
                  // submit signal
                  setButtonDisabled(true);
                  setSubmittingError(undefined);
                  axios({
                    method: 'put',
                    url: `https://signals-and-trends-api.azurewebsites.net/v1/signals/update`,
                    data: {
                      ...signalData,
                      connected_trends: selectedTrendsList,
                      status: 'New',
                      keywords: [keyword1, keyword2, keyword3].filter(
                        d => d !== null && d !== undefined,
                      ),
                    },
                    headers: {
                      'Content-Type': 'application/json',
                      access_token: accessToken,
                    },
                  })
                    .then(() => {
                      setButtonDisabled(false);
                      navigate('/signals');
                      updateNotificationText(
                        'Successfully submitted the signal for review',
                      );
                    })
                    .catch(err => {
                      setButtonDisabled(false);
                      setSubmittingError(
                        `Error code ${err.response?.status}: ${
                          err.response?.data
                        }. ${
                          err.response?.status === 500
                            ? 'Please try again in some time'
                            : ''
                        }`,
                      );
                    });
                }}
              >
                Submit Signal
              </button>
              <button
                className='undp-button button-secondary button-arrow'
                type='button'
                disabled={loading}
                onClick={() => {
                  // save as draft
                  setButtonDisabled(true);
                  setSubmittingError(undefined);
                  axios({
                    method: 'put',
                    url: `https://signals-and-trends-api.azurewebsites.net/v1/signals/update`,
                    data: {
                      ...signalData,
                      connected_trends: selectedTrendsList,
                      keywords: [keyword1, keyword2, keyword3].filter(
                        d => d !== null && d !== undefined,
                      ),
                      status: 'Draft',
                    },
                    headers: {
                      'Content-Type': 'application/json',
                      access_token: accessToken,
                    },
                  })
                    .then(() => {
                      setButtonDisabled(false);
                      navigate('/my-drafts');
                      updateNotificationText(
                        'Successfully saved the signal to draft',
                      );
                    })
                    .catch(err => {
                      setButtonDisabled(false);
                      setSubmittingError(
                        `Error code ${err.response?.status}: ${
                          err.response?.data
                        }. ${
                          err.response?.status === 500
                            ? 'Please try again in some time'
                            : ''
                        }`,
                      );
                    });
                }}
              >
                Save Signal as Draft
              </button>
              <Popconfirm
                title='Delete Signal'
                description='Are you sure to delete this signal?'
                onConfirm={() => confirmDelete(updateSignal.id, '/my-drafts')}
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
                  Delete Draft Signal
                </button>
              </Popconfirm>
            </div>
          ) : (
            <button
              className={`${
                isSignalInvalid(signalData, [keyword1, keyword2, keyword3]) ||
                buttonDisabled ||
                loading
                  ? 'disabled '
                  : ''
              }undp-button button-secondary button-arrow`}
              type='button'
              disabled={
                isSignalInvalid(signalData, [keyword1, keyword2, keyword3]) ||
                buttonDisabled ||
                loading
              }
              title={
                isSignalInvalid(signalData, [keyword1, keyword2, keyword3]) ||
                buttonDisabled
                  ? 'All fields are required to update a signal. Descriptions should be > 30 letters'
                  : 'Click to update a signal'
              }
              onClick={() => {
                // update signal
                setButtonDisabled(true);
                setSubmittingError(undefined);
                axios({
                  method: 'put',
                  url: `https://signals-and-trends-api.azurewebsites.net/v1/signals/update`,
                  data: {
                    ...signalData,
                    connected_trends: selectedTrendsList,
                    keywords: [keyword1, keyword2, keyword3].filter(
                      d => d !== null && d !== undefined,
                    ),
                  },
                  headers: {
                    'Content-Type': 'application/json',
                    access_token: accessToken,
                  },
                })
                  .then(() => {
                    setButtonDisabled(false);
                    navigate(`/signals/${updateSignal.id}`);
                    updateNotificationText('Successfully updated the signal');
                  })
                  .catch(err => {
                    setButtonDisabled(false);
                    setSubmittingError(
                      `Error code ${err.response?.status}: ${
                        err.response?.data
                      }. ${
                        err.response?.status === 500
                          ? 'Please try again in some time'
                          : ''
                      }`,
                    );
                  });
              }}
            >
              Update Signal
            </button>
          )
        ) : (
          <div className='flex-div'>
            <button
              className={`${
                isSignalInvalid(signalData, [keyword1, keyword2, keyword3]) ||
                buttonDisabled ||
                loading
                  ? 'disabled '
                  : ''
              }undp-button button-secondary button-arrow`}
              type='button'
              disabled={
                isSignalInvalid(signalData, [keyword1, keyword2, keyword3]) ||
                buttonDisabled ||
                loading
              }
              title={
                isSignalInvalid(signalData, [keyword1, keyword2, keyword3]) ||
                buttonDisabled
                  ? 'All fields are required to submit a signal. Descriptions should be > 30 letters'
                  : 'Click to submit a signal'
              }
              onClick={() => {
                setButtonDisabled(true);
                setSubmittingError(undefined);
                axios({
                  method: 'post',
                  url: `https://signals-and-trends-api.azurewebsites.net/v1/signals/submit`,
                  data: {
                    ...signalData,
                    connected_trends: selectedTrendsList,
                    status: 'New',
                    keywords: [keyword1, keyword2, keyword3].filter(
                      d => d !== null && d !== undefined,
                    ),
                  },
                  headers: {
                    'Content-Type': 'application/json',
                    access_token: accessToken,
                  },
                })
                  .then(() => {
                    setButtonDisabled(false);
                    navigate('/signals');
                    updateNotificationText(
                      'Successfully submitted the signal for review',
                    );
                  })
                  .catch(err => {
                    setButtonDisabled(false);
                    setSubmittingError(
                      `Error code ${err.response?.status}: ${
                        err.response?.data
                      }. ${
                        err.response?.status === 500
                          ? 'Please try again in some time'
                          : ''
                      }`,
                    );
                  });
              }}
            >
              Submit Signal
            </button>
            <button
              className='undp-button button-secondary button-arrow'
              type='button'
              disabled={loading}
              onClick={() => {
                setButtonDisabled(true);
                setSubmittingError(undefined);
                axios({
                  method: 'post',
                  url: `https://signals-and-trends-api.azurewebsites.net/v1/signals/submit`,
                  data: {
                    ...signalData,
                    connected_trends: selectedTrendsList,
                    status: 'Draft',
                    keywords: [keyword1, keyword2, keyword3].filter(
                      d => d !== null && d !== undefined,
                    ),
                  },
                  headers: {
                    'Content-Type': 'application/json',
                    access_token: accessToken,
                  },
                })
                  .then(() => {
                    setButtonDisabled(false);
                    navigate('/my-drafts');
                    updateNotificationText(
                      'Successfully saved the signal to draft',
                    );
                  })
                  .catch(err => {
                    setButtonDisabled(false);
                    setSubmittingError(
                      `Error code ${err.response?.status}: ${
                        err.response?.data
                      }. ${
                        err.response?.status === 500
                          ? 'Please try again in some time'
                          : ''
                      }`,
                    );
                  });
              }}
            >
              Save Signal as Draft
            </button>
          </div>
        )}
        {updateSignal &&
        updateSignal.status === 'Archived' &&
        (role === 'Curator' || role === 'Admin') ? (
          <Popconfirm
            title='Delete Signal'
            description='Are you sure to delete this signal?'
            onConfirm={() =>
              confirmDelete(updateSignal.id, '../../../archived-signals')
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
              Delete Archived Signal
            </button>
          </Popconfirm>
        ) : null}
        {buttonDisabled ? <div className='undp-loader' /> : null}
        {submittingError ? (
          <p
            className='margin-top-00 margin-bottom-00'
            style={{ color: 'var(--dark-red)' }}
          >
            {submittingError}
          </p>
        ) : null}
      </div>
      {trendModal ? (
        <AddTrendsModal
          setTrendModal={setTrendModal}
          selectedTrendsList={selectedTrendsList}
          setSelectedTrendsList={setSelectedTrendsList}
        />
      ) : null}
    </div>
  );
}
