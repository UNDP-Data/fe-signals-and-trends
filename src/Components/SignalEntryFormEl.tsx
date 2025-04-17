/* eslint-disable jsx-a11y/label-has-associated-control */
import { Input, Select, Popconfirm, Checkbox } from 'antd';
import '../styles.css';
import sortBy from 'lodash.sortby';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useContext, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { NewSignalDataType, SignalDataType, TrendDataType } from '../Types';
import { AddTrendsModal } from './AddTrendsModal';
import Context from '../Context/Context';
// import { pexelCall } from '../API/pexelCall';

import {
  createSignal,
  updateSignal as updateSignalApi,
  deleteSignal,
  // generateSignal,
  searchTrends,
} from '../API';

import { SignalAutocomplete, SignalSuggestion } from './SignalAutocomplete';
import { extractKeywords } from '../Utils/ExtractKeyWords';
import { PEXEL_SEARCH_IMG_GET_URL } from '../Constants';

interface Props {
  updateSignal?: SignalDataType;
  draft: boolean;
  initialData?: Partial<NewSignalDataType>;
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
    ${props => `url(${props.bgImage})`} no-repeat center;
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

/*
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
const getRootUrl = (url: string) => {
  const parsedUrl = new URL(url);
  const rootUrl = parsedUrl.hostname;
  return rootUrl;
};
const getStringBeforeSubstring = (str: string, substring: string) => {
  const index = str.indexOf(substring);
  if (index !== -1) {
    return str.substring(0, index);
  }
  return str; // Return the original string if the substring is not found
};
const findFirstArrayMatch = (text: string) => {
  const array = ['scrape', 'scraping', 'artificial intelligence'];
  const lowerCaseText = text.toLowerCase(); // Convert the text to lowercase
  for (let i = 0; i < array.length; i + 1) {
    if (lowerCaseText.includes(array[i])) {
      return array[i];
    }
  }
  return null; // Return null if no items are found
};
*/
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
  const navigate = useNavigate();

  const { updateSignal, draft, initialData } = props;
  const { userName, role, updateNotificationText, choices, unit } =
    useContext(Context);
  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState(false);
  // const [tosError, setTosError] = useState(false);
  const [signalData, updateSignalData] = useState<
    SignalDataType | NewSignalDataType
  >(
    updateSignal || initialData || {
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
  const [buttonDisabled, setButtonDisabled] = useState(false);
  // const [acceptTOS, setAcceptTOS] = useState(false);
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
    setButtonDisabled(true);
    deleteSignal(id)
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
    if (selectedTrendsList.length > 0) {
      searchTrends({
        ids: selectedTrendsList,
        per_page: selectedTrendsList.length,
        statuses: ['Approved', 'New'],
      })
        .then(response => {
          setTrendsList(
            sortBy(response.data, d => Date.parse(d.created_at)).reverse(),
          );
        })
        .catch(err => {
          setSubmittingError(
            `${err}. ${
              err.response?.status === 500
                ? 'Please try again in some time'
                : ''
            }`,
          );
        });
    } else {
      setTrendsList([]);
    }
  }, [selectedTrendsList]);

  const [query, setQuery] = useState<string>('');
  useEffect(() => {
    if (!query) {
      setQuery(signalData.headline || '');
    }
  }, [signalData.attachment, signalData.headline, query]);

  const [imageUrl, setImageUrl] = useState<string>('');
  const [pexelImages, setPexelImages] = useState<any[]>([]);
  const [noPexelImagesAvailable, setNoPexelImagesAvailable] =
    useState<boolean>(false);
  const [isVisible, setIsVisible] = useState(true);
  const fileInputRef = useRef<any>(null);
  const [selectedFileName, setSelectedFileName] = useState<string>('');
  const [pageNo, setPageNo] = useState<number>(1);
  const [, setPexelImgLoading] = useState<boolean>(false);
  const [enterSignalManually, setEnterSignalManually] = useState(false);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };
  // const targetDiv = document.getElementById('target-div');
  // if (targetDiv) {
  //   targetDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
  // }
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
  async function urlToFile(url: string, filename: string, mimeType: string) {
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();
    return new File([buffer], filename, { type: mimeType });
  }
  const getPexelImages = async () => {
    console.log('Pexel | Query : ', query);
    setPexelImgLoading(true);
    const PEXEL_API_KEY = import.meta.env.VITE_PEXEL_API_KEY || process.env.REACT_APP_PEXEL_API_KEY;
    console.log(PEXEL_API_KEY);
    try {
      const refinedQuery = extractKeywords(query);
      const response = await axios.get(PEXEL_SEARCH_IMG_GET_URL, {
        params: { query: refinedQuery, per_page: 12, page: pageNo },
        headers: {
          Authorization: PEXEL_API_KEY,
        },
      });
      if (response.data.photos.length === 0) {
        console.log(response.data.photos.length);
        setPageNo(1);
        setNoPexelImagesAvailable(true);
      }
      console.log(response);
      setPexelImages(response.data.photos);
      setTimeout(() => {
        setPexelImgLoading(false);
      }, 500);
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(err.message);
      } else {
        throw new Error('An unexpected error occurred');
      }
    }
  };
  const refreshPexelImages = async () => {
    setPexelImgLoading(true);
    setPageNo(pageNo + 1);
    setPexelImgLoading(false);
  };
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    getPexelImages();
  }, [pageNo]);

  useEffect(() => {
    if (enterSignalManually) {
      updateSignalData({
        ...signalData,
        headline: '',
      });
    }
  }, [enterSignalManually]);

  // Signal Auto Complete
  const handleSuggestionSelect = (suggestion: SignalSuggestion) => {
    console.log('Selected Suggestion:', suggestion);
    updateSignalData({
      ...signalData,
      headline: suggestion.headline,
      url: suggestion.url,
      description: suggestion.description,
      keywords: suggestion.keywords,
      location: suggestion.location,
    });
    setImageUrl(suggestion.image || 'Image not available');
    setKeyword1(suggestion.keywords[0]);
    setKeyword2(suggestion.keywords[1]);
    setKeyword3(suggestion.keywords[2]);
  };
  // const handleUserSelectedImage = (selectedImage : string) => {
  //   update
  // }
  /*
  const fillUsingAI = async () => {
    setTosError(false);
    if (isUrl(signalData.url) && typeof signalData.url === 'string') {
      setLoading(true);
      try {
        // Additional logic to vet terms of service. Comment out as required.
        const rootUrl = getRootUrl(signalData.url);

        const tosRes = await axios.get(
          `https://s.jina.ai/${rootUrl}+terms+of+service`,
        ); // TODO: use generateSignal call 
        const tos = tosRes.data;
        console.log(rootUrl, tos);
        const firstSearch = getStringBeforeSubstring(tos, '[2] Title:');
        const matches = findFirstArrayMatch(firstSearch);
        console.log(firstSearch, matches);

        // If prohibited keywords, found, return and show TOS Error message
        if (matches && matches.length > 0) {
          setTosError(true);
        } else {
          // Otherwise, process via AI as normal
          const response = await axios.get(
            `https://signals-and-trends-api.azurewebsites.net/v1/signals/generate?url=${signalData.url}`,
            {
              headers: {
                access_token: accessToken || API_ACCESS_TOKEN,
              },
            },
          );

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
        }
      } catch (_err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
  };
  */

  return (
    <div className='undp-container max-width padding-top-00 padding-bottom-00'>
      <p className='undp-typography'>
        A Signal is defined as a single piece of evidence or indicator that
        points to, relates to, or otherwise supports a trend. A signal can also
        stand alone as a potential indicator of future change in one or more
        trends.
      </p>
      <div className='margin-bottom-07'>
        <div className='margin-bottom-07 '>
          <div className='signal-title-grid' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p className='undp-typography margin-bottom-01'>Signal Title*</p>
            <Checkbox
                checked={enterSignalManually}
                onChange={e => setEnterSignalManually(e.target.checked)}
              >
                Enter Signal Title Manually
            </Checkbox>
          </div>
          {signalData.headline || enterSignalManually ? (
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
                setQuery(d.target.value);
                setPageNo(1);
              }}
            />
          ) : (
            <SignalAutocomplete
              onChange={d => {
                setQuery(d);
                setPageNo(1);
              }}
              onSuggestionSelect={handleSuggestionSelect}
              value={signalData.headline}
            />
          )}
          <p className='undp-typography margin-top-02 margin-bottom-00 small-font'>
            Useful titles are clear, concise and can stand alone as a simple
            description of the signal.{' '}
            {signalData.headline ? 100 - signalData.headline.length : 100}{' '}
            characters left
          </p>
        </div>
        <div className='margin-bottom-00'>
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
            meeting with Minister X; or taxi in country X.
          </p>
          {/* <Checkbox
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
            */}

          {/* error ? (
              <p
                className='undp-typography margin-top-02 small-font margin-bottom-00'
                style={{ color: 'var(--dark-red)' }}
              >
                Unable to fetch data from the URL using AI. Please try again later
                and make sure that you are using a valid URL.
              </p>
            ) : null
            */}
          {/* tosError ? (
            <p
              className='undp-typography margin-top-02 small-font margin-bottom-00'
              style={{ color: 'var(--dark-red)' }}
            >
              This Website&rsquo;s Terms of Service explicitly prohibits the use
              of AI or Scraping. Please try again later with a Signal source the
              allows the use of AI. Alternatively, please process this Signal
              manually.
            </p>
          ) : null */}
          {/* <button
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
            */}
        </div>
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
            showSearch
          >
            {choices?.location.map((d, i) => (
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
          >
            {choices?.steep.map((d, i) => (
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
          {choices?.steep.map((d, i) => (
            <Select.Option className='undp-select-option' key={i} value={d}>
              {d}
            </Select.Option>
          ))}
        </Select>
      </div>
      <div className='margin-bottom-07' id='target-div'>
        <p className='undp-typography margin-bottom-01'>Cover Image</p>
        {signalData.attachment ? (
          <div className='flex-div padding-bottom-05'>
            <UploadedImgEl bgImage={imageUrl} />
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
      <div>
        {signalData.headline ? (
          <>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <button
                type='button'
                className='undp-button button-tertiary flex'
                onClick={() => getPexelImages()}
                style={{
                  backgroundColor: 'var(--gray-300)',
                  padding: 'var(--spacing-05)',
                  alignSelf: 'flex-end',
                }}
              >
                Generate Image
              </button>
              {pexelImages && (
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    type='button'
                    className='undp-button button-tertiary flex'
                    onClick={toggleVisibility}
                  >
                    {isVisible ? '▲ Hide' : '▼ Show'}
                  </button>
                </div>
              )}
            </div>
            <div className='margin-top-09 margin-bottom-09 generate-img-div'>
              {isVisible && pexelImages && pexelImages.length > 0 ? (
                pexelImages.map((image, index) => (
                  <button
                    key={index}
                    type='button'
                    onClick={async () => {
                      const file = await urlToFile(
                        image.src.medium,
                        `${query} pexel-image.jpg`,
                        'image/jpeg',
                      );
                      setSelectedFileName(file.name);
                      setImageUrl(image.src.medium);
                      updateSignalData({
                        ...signalData,
                        attachment: image.src.medium,
                      });
                      handleFileSelect({ target: { files: [file] } });
                      setIsVisible(false);
                    }}
                    style={{
                      border: 'none',
                      background: 'none',
                      padding: 2,
                      cursor: 'pointer',
                    }}
                  >
                    <img
                      key={index}
                      className='hover-scale-shadow'
                      src={image.src.medium}
                      alt='No preview available'
                      height='200px'
                      width='200px'
                      style={{
                        objectFit: 'cover',
                        transition: 'box-shadow 0.4s ease-in-out',
                      }}
                    />
                  </button>
                ))
              ) : noPexelImagesAvailable && pageNo === 1 ? (
                <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                  <p>
                    No related images found. Please change the Signal Title for
                    a better image generation.
                  </p>
                </div>
              ) : null}
            </div>
            {isVisible && (
              <button
                type='button'
                className='undp-button button-tertiary flex margin-bottom-05'
                onClick={refreshPexelImages}
                style={{
                  backgroundColor: 'var(--gray-300)',
                  padding: 'var(--spacing-05)',
                  alignSelf: 'flex-end',
                }}
              >
                Refresh
              </button>
            )}
          </>
        ) : (
          <button
            type='button'
            className='undp-button button-tertiary flex margin-bottom-05'
            onClick={() => getPexelImages()}
            style={{
              backgroundColor: 'var(--gray-200)',
              color: 'var(--gray-500)',
              padding: 'var(--spacing-05)',
              alignSelf: 'flex-end',
              cursor: 'not-allowed',
              opacity: '0.6',
            }}
          >
            Generate Image
          </button>
        )}
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
            value={keyword1 || undefined || signalData.keywords[0] || ''}
          />
          <Input
            className='undp-input'
            placeholder='Enter Keyword#2'
            onChange={e => {
              setKeyword2(e.target.value);
            }}
            value={keyword2 || undefined || signalData.keywords[1] || ''}
          />
          <Input
            className='undp-input'
            placeholder='Enter Keyword#3'
            onChange={e => {
              setKeyword3(e.target.value);
            }}
            value={keyword3 || undefined || signalData.keywords[2] || ''}
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
            value={signalData.signature_primary}
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
            className='undp-select'
            placeholder='Select Signature Solution'
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
          className='undp-select'
          mode='multiple'
          placeholder='Select SDG'
          maxTagCount='responsive'
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
      {role === 'Curator' || role === 'Admin' ? (
        <div className='margin-bottom-07' style={{ width: '100%' }}>
          <p className='undp-typography margin-bottom-01'>Signal Score</p>
          <Select
            className='undp-select'
            placeholder='Select Score'
            onChange={e => {
              updateSignalData({
                ...signalData,
                score: e,
              });
            }}
            value={signalData.score}
          >
            {choices?.score.map((d, i) => (
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
          onChange={e => {
            updateSignalData({
              ...signalData,
              created_unit: e,
            });
          }}
          value={signalData.created_unit}
        >
          {choices?.unit_name.map((d, i) => (
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
      <div className='margin-top-09'>
        {submittingError ? (
          <p className='margin-bottom-05' style={{ color: 'var(--dark-red)' }}>
            {submittingError}
          </p>
        ) : null}
        <div className='flex-div flex-vert-align-center margin-top-00'>
          {updateSignal ? (
            updateSignal.status === 'Draft' ? (
              <div className='flex-div'>
                <button
                  className={`${
                    isSignalInvalid(signalData, [
                      keyword1,
                      keyword2,
                      keyword3,
                    ]) || buttonDisabled
                      ? 'disabled'
                      : ''
                  } undp-button button-secondary button-arrow`}
                  type='button'
                  disabled={
                    isSignalInvalid(signalData, [
                      keyword1,
                      keyword2,
                      keyword3,
                    ]) || buttonDisabled
                  }
                  onClick={() => {
                    // submit signal
                    setButtonDisabled(true);
                    setSubmittingError(undefined);
                    if (signalData.id)
                      updateSignalApi(updateSignal.id, {
                        // ...signalData,
                        id: signalData.id,
                        headline: signalData.headline || '',
                        description: signalData.description || '',
                        attachment: signalData.attachment || '',
                        steep_primary: signalData.steep_primary || '',
                        signature_primary: signalData.signature_primary || '',
                        signature_secondary:
                          signalData.signature_secondary || [],
                        sdgs: signalData.sdgs || [],
                        url: signalData.url || '',
                        relevance: signalData.relevance || '',
                        location: signalData.location || '',
                        created_by: signalData.created_by || '',
                        created_for: signalData.created_for,
                        score: signalData.score,
                        connected_trends: selectedTrendsList,
                        status: 'New',
                        keywords: [keyword1, keyword2, keyword3].filter(
                          (d): d is string => d !== null && d !== undefined,
                        ),
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
                            `${err}. ${
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
                  onClick={() => {
                    // save as draft
                    console.log(signalData.attachment);
                    setButtonDisabled(true);
                    setSubmittingError(undefined);
                    if (signalData.id)
                      updateSignalApi(updateSignal.id, {
                        // ...signalData,
                        id: signalData.id,
                        headline: signalData.headline || null,
                        description: signalData.description || null,
                        attachment: signalData.attachment || null,
                        steep_primary: signalData.steep_primary || null,
                        steep_secondary: signalData.steep_secondary || null,
                        signature_primary: signalData.signature_primary || null,
                        signature_secondary:
                          signalData.signature_secondary || null,
                        sdgs: signalData.sdgs || null,
                        url: signalData.url || null,
                        relevance: signalData.relevance || null,
                        location: signalData.location || null,
                        score: signalData.score || null,
                        created_by: signalData.created_by || null,
                        created_for: signalData.created_for || null,
                        connected_trends: selectedTrendsList || null,
                        keywords: [keyword1, keyword2, keyword3].filter(
                          (d): d is string => d !== null && d !== undefined,
                        ),
                        status: 'Draft',
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
                            `${err}. ${
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
                  buttonDisabled
                    ? 'disabled'
                    : ''
                } undp-button button-secondary button-arrow`}
                type='button'
                disabled={
                  isSignalInvalid(signalData, [keyword1, keyword2, keyword3]) ||
                  buttonDisabled
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
                  if (signalData.id)
                    updateSignalApi(updateSignal.id, {
                      // ...signalData,
                      id: signalData.id,
                      headline: signalData.headline || '',
                      description: signalData.description || '',
                      attachment: signalData.attachment || undefined,
                      steep_primary: signalData.steep_primary || '',
                      signature_primary: signalData.signature_primary || '',
                      signature_secondary: signalData.signature_secondary || [],
                      sdgs: signalData.sdgs || [],
                      url: signalData.url || '',
                      relevance: signalData.relevance || '',
                      location: signalData.location || '',
                      status: signalData.status || '',
                      created_by: signalData.created_by || '',
                      created_for: signalData.created_for || '',
                      score: signalData.score,
                      created_unit: signalData.created_unit || '',
                      connected_trends: selectedTrendsList,
                      keywords: [keyword1, keyword2, keyword3].filter(
                        (d): d is string => d !== null && d !== undefined,
                      ),
                    })
                      .then(() => {
                        setButtonDisabled(false);
                        navigate(`/signals/${updateSignal.id}`);
                        updateNotificationText(
                          'Successfully updated the signal',
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
                Update Signal
              </button>
            )
          ) : (
            <div className='flex-div'>
              <button
                className={`${
                  isSignalInvalid(signalData, [keyword1, keyword2, keyword3]) ||
                  buttonDisabled
                }undp-button button-secondary button-arrow`}
                type='button'
                disabled={
                  isSignalInvalid(signalData, [keyword1, keyword2, keyword3]) ||
                  buttonDisabled
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
                  createSignal({
                    headline: signalData.headline || '',
                    description: signalData.description || '',
                    attachment: signalData.attachment || '',
                    steep_primary: signalData.steep_primary || '',
                    steep_secondary: signalData.steep_secondary || undefined,
                    signature_primary: signalData.signature_primary || '',
                    signature_secondary: signalData.signature_secondary || [],
                    sdgs: signalData.sdgs || [],
                    created_unit: signalData.created_unit || '',
                    url: signalData.url || '',
                    relevance: signalData.relevance || '',
                    created_for: signalData.created_for || '',
                    location: signalData.location || '',
                    score: signalData.score,
                    connected_trends: selectedTrendsList,
                    status: 'New',
                    keywords: [keyword1, keyword2, keyword3].filter(
                      (d): d is string => d !== null && d !== undefined,
                    ),
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
                        `${err}. ${
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
                onClick={() => {
                  console.log('Saving as a draft', signalData.attachment);
                  setButtonDisabled(true);
                  setSubmittingError(undefined);
                  // console.log(signalData);
                  createSignal({
                    headline: signalData.headline || null,
                    description: signalData.description || null,
                    attachment: signalData.attachment || null,
                    steep_primary: signalData.steep_primary || null,
                    steep_secondary: signalData.steep_secondary || null,
                    signature_primary: signalData.signature_primary || null,
                    signature_secondary: signalData.signature_secondary || null,
                    sdgs: signalData.sdgs || null,
                    created_unit: signalData.created_unit || null,
                    url: signalData.url || null,
                    relevance: signalData.relevance || null,
                    created_for: signalData.created_for || null,
                    score: signalData.score || null,
                    location: signalData.location || null,
                    connected_trends: selectedTrendsList,
                    status: 'Draft',
                    keywords: [keyword1, keyword2, keyword3].filter(
                      (d): d is string => d !== null && d !== undefined,
                    ),
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
                        `${err}. ${
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
        </div>
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