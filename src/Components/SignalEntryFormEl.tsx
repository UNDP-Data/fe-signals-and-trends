/* eslint-disable jsx-a11y/label-has-associated-control */
import { Input, Popconfirm, Select, Tooltip } from 'antd';
import sortBy from 'lodash.sortby';
import { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
  createSignal,
  deleteSignal,
  searchTrends,
  updateSignal as updateSignalApi,
} from '../API';
import Context from '../Context/Context';
import { CREATED_FOR } from '../Constants';
import '../styles.css';
import { NewSignalDataType, SignalDataType, TrendDataType } from '../Types';
import { formatSignalData, isSignalValid } from '../Utils/FormatSignalData';
import { AddTrendsModal } from './AddTrendsModal';
import { PexelsImagePicker } from './PexelsImagePicker';
import { SprintSelect } from './SprintSelect';


const SHOW_RED_BORDERS = false;

interface Props {
  updateSignal?: SignalDataType;
  draft: boolean;
  initialData?: Partial<NewSignalDataType>;
  onSubmit?: (data: any) => Promise<void>;
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

const SprintSection = styled.div`
  background-color: #f5f7f9;
  border: 2px solid #e5eaef;
  border-radius: 8px;
  padding: 24px;
  margin-top: 32px;
  margin-bottom: 32px;

  .sprint-header {
    font-size: 20px;
    font-weight: bold;
    color: #2c3e50;
    margin-bottom: 8px;
  }

  .sprint-description {
    font-size: 14px;
    color: #6c757d;
    margin-bottom: 16px;
  }
`;

const StyledCheckboxWrapper = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: 600;
  background: #f5f7f9;
  border: 2px solid #e5eaef;
  border-radius: 8px;
  padding: 18px 24px;
  margin-bottom: 0.5rem;
  transition: border 0.2s;
  &:hover {
    border: 2px solid var(--blue-600);
    background: #e3f2fd;
  }
`;
const StyledCheckboxInput = styled.input`
  width: 28px;
  height: 28px;
  margin-right: 18px;
  accent-color: var(--blue-600);
  border-radius: 6px;
  border: 2px solid var(--blue-600);
  transition: box-shadow 0.2s;
  &:focus {
    box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.2);
  }
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
  return !isSignalValid(signal, keyWords);
}

// New function to get form validation status with detailed messages
export function getFormValidation(
  signal: SignalDataType | NewSignalDataType,
  keyWords: [string | undefined, string | undefined, string | undefined],
): {
  isValid: boolean;
  errorMessages: string[];
  invalidFields: string[];
  fieldIds: Record<string, string>;
} {
  const errorMessages: string[] = [];
  const invalidFields: string[] = [];
  const fieldIds: Record<string, string> = {};

  if (!signal.headline) {
    errorMessages.push('Signal Title is required');
    invalidFields.push('headline');
    fieldIds['headline'] = 'signal-headline';
  }

  if (!signal.created_unit) {
    errorMessages.push('Unit is required');
    invalidFields.push('created_unit');
    fieldIds['created_unit'] = 'signal-unit';
  }

  if (!signal.description) {
    errorMessages.push('Signal Description is required');
    invalidFields.push('description');
    fieldIds['description'] = 'signal-description';
  } else if (signal.description.length <= 30) {
    errorMessages.push('Signal Description must be longer than 30 characters');
    invalidFields.push('description');
    fieldIds['description'] = 'signal-description';
  }

  if (keyWords.filter(d => d !== undefined && d.trim() !== '').length === 0) {
    errorMessages.push('At least one Keyword is required');
    invalidFields.push('keywords');
    fieldIds['keywords'] = 'signal-keywords';
  }

  if (!signal.location) {
    errorMessages.push('Location is required');
    invalidFields.push('location');
    fieldIds['location'] = 'signal-location';
  }

  if (!signal.steep_primary) {
    errorMessages.push('Primary STEEP+V is required');
    invalidFields.push('steep_primary');
    fieldIds['steep_primary'] = 'signal-steep-primary';
  }

  if (!signal.signature_primary) {
    errorMessages.push('Primary Signature Solution/Enabler is required');
    invalidFields.push('signature_primary');
    fieldIds['signature_primary'] = 'signal-signature-primary';
  }

  if (!signal.sdgs || signal.sdgs.length === 0) {
    errorMessages.push('At least one SDG is required');
    invalidFields.push('sdgs');
    fieldIds['sdgs'] = 'signal-sdgs';
  }

  if (!signal.relevance) {
    errorMessages.push('Signal Relevance is required');
    invalidFields.push('relevance');
    fieldIds['relevance'] = 'signal-relevance';
  }

  if (!signal.url) {
    errorMessages.push('Signal Source is required');
    invalidFields.push('url');
    fieldIds['url'] = 'signal-url';
  }

  return {
    isValid: errorMessages.length === 0,
    errorMessages,
    invalidFields,
    fieldIds,
  };
}

// First, update the ValidationMessage component styling
const ValidationMessage = ({
  signal,
  keyWords,
}: {
  signal: SignalDataType | NewSignalDataType;
  keyWords: [string | undefined, string | undefined, string | undefined];
}) => {
  const { isValid, errorMessages, invalidFields, fieldIds } = getFormValidation(
    signal,
    keyWords,
  );

  if (isValid) return null;

  const handleErrorClick = (fieldId: string) => {
    const element = document.getElementById(fieldId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Add a brief flash effect to highlight the element
      element.classList.add('validation-highlight');
      setTimeout(() => {
        element.classList.remove('validation-highlight');
      }, 2000);
    }
  };

  return (
    <div
      className='margin-top-05 margin-bottom-05'
      style={{
        backgroundColor: '#E3F2FD',
        border: '1px solid #90CAF9',
        borderRadius: '4px',
        padding: '12px 16px',
      }}
    >
      <p
        className='undp-typography bold'
        style={{ color: 'var(--blue-600)', marginBottom: '8px' }}
      >
        Please complete the following fields to submit your signal:
      </p>
      <ul style={{ margin: 0, paddingLeft: '20px' }}>
        {errorMessages.map((message, index) => (
          <li key={index}>
            <button
              type='button'
              className='undp-typography'
              style={{
                color: 'var(--blue-700)',
                cursor: 'pointer',
                textDecoration: 'underline',
                background: 'none',
                border: 'none',
                padding: 0,
                font: 'inherit',
              }}
              onClick={() => handleErrorClick(fieldIds[invalidFields[index]])}
            >
              {message}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

// Update the highlighting style to match the new blue theme
const highlightStyle = document.createElement('style');
highlightStyle.textContent = `
  .validation-highlight {
    animation: highlight-pulse 2s ease-in-out;
    border: 2px solid var(--blue-600) !important;
  }
  
  @keyframes highlight-pulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(33, 150, 243, 0.4); }
    50% { box-shadow: 0 0 0 10px rgba(33, 150, 243, 0); }
  }
`;
document.head.appendChild(highlightStyle);

export function SignalEntryFormEl(props: Props) {
  const navigate = useNavigate();

  const { updateSignal, draft, initialData, onSubmit } = props;
  const { userName, role, updateNotificationText, choices, unit } =
    useContext(Context);
  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState(false);
  // const [tosError, setTosError] = useState(false);
  const [signalData, updateSignalData] = useState<
    SignalDataType | NewSignalDataType
  >(
    updateSignal || {
      status: 'New',
      created_by: userName,
      headline: initialData?.headline || undefined,
      description: initialData?.description || undefined,
      attachment: initialData?.attachment || undefined,
      steep_primary: initialData?.steep_primary || undefined,
      steep_secondary: initialData?.steep_secondary || [],
      signature_primary: initialData?.signature_primary || undefined,
      signature_secondary: initialData?.signature_secondary || [],
      sdgs: initialData?.sdgs || [],
      created_unit: initialData?.created_unit || unit,
      url: initialData?.url || undefined,
      relevance: initialData?.relevance || undefined,
      keywords: initialData?.keywords || [],
      location: initialData?.location || undefined,
      secondary_location: initialData?.secondary_location || [],
      score: initialData?.score || undefined,
      connected_trends: initialData?.connected_trends || [],
      created_for: initialData?.created_for || undefined,
      user_group_ids: initialData?.user_group_ids || [],
      private: initialData?.private || false,
    },
  );

  const showSubmit = !signalData.private && (!updateSignal || updateSignal.status === 'Draft');

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
    updateSignal?.keywords
      ? updateSignal?.keywords[0] || undefined
      : initialData?.keywords
        ? initialData.keywords[0] || undefined
        : undefined,
  );
  const [keyword2, setKeyword2] = useState<string | undefined>(
    updateSignal?.keywords
      ? updateSignal?.keywords[1] || undefined
      : initialData?.keywords
        ? initialData.keywords[1] || undefined
        : undefined,
  );
  const [keyword3, setKeyword3] = useState<string | undefined>(
    updateSignal?.keywords
      ? updateSignal?.keywords[2] || undefined
      : initialData?.keywords
        ? initialData.keywords[2] || undefined
        : undefined,
  );
  const [useFetchedArticles, setUseFetchedArticles] = useState(false);
  const [showRedBorders, setShowRedBorders] = useState(SHOW_RED_BORDERS);
  // Extract user group IDs from either user_group_ids or the user_groups array
  const extractUserGroupIds = (signal?: any): number[] => {
    if (!signal) return [];

    // If user_group_ids is available and valid, use it
    if (
      Array.isArray(signal.user_group_ids) &&
      signal.user_group_ids.length > 0
    ) {
      return signal.user_group_ids;
    }

    // If user_groups array exists with objects containing id
    if (Array.isArray(signal.user_groups) && signal.user_groups.length > 0) {
      return signal.user_groups
        .map((group: any) => group.id)
        .filter((id: any) => id !== undefined);
    }

    return [];
  };

  const [selectedUserGroups, setSelectedUserGroups] = useState<number[]>(
    extractUserGroupIds(updateSignal),
  );

  // Initialize keywords from initialData if available
  useEffect(() => {
    if (initialData?.keywords?.length) {
      setKeyword1(initialData.keywords[0]);
      if (initialData.keywords.length > 1) setKeyword2(initialData.keywords[1]);
      if (initialData.keywords.length > 2) setKeyword3(initialData.keywords[2]);
    }

    // Set selected user groups from initialData if they exist
    // This also handles the case where initialData may have user_groups instead of user_group_ids
    const extractedGroups = extractUserGroupIds(initialData as any);
    if (extractedGroups.length > 0) {
      setSelectedUserGroups(extractedGroups);
    }
  }, [initialData]);

  // Update signalData when initialData changes (for extracted data)
  useEffect(() => {
    if (initialData && !updateSignal) {
      updateSignalData(prevData => ({
        ...prevData,
        headline: initialData.headline || prevData.headline,
        description: initialData.description || prevData.description,
        attachment: initialData.attachment || prevData.attachment,
        steep_primary: initialData.steep_primary || prevData.steep_primary,
        steep_secondary: initialData.steep_secondary || prevData.steep_secondary,
        signature_primary: initialData.signature_primary || prevData.signature_primary,
        signature_secondary: initialData.signature_secondary || prevData.signature_secondary,
        sdgs: initialData.sdgs || prevData.sdgs,
        created_unit: initialData.created_unit || prevData.created_unit || unit,
        url: initialData.url || prevData.url,
        relevance: initialData.relevance || prevData.relevance,
        keywords: initialData.keywords || prevData.keywords,
        location: initialData.location || prevData.location,
        secondary_location: initialData.secondary_location || prevData.secondary_location,
        score: initialData.score || prevData.score,
        connected_trends: initialData.connected_trends || prevData.connected_trends,
        created_for: initialData.created_for || prevData.created_for,
        user_group_ids: initialData.user_group_ids || prevData.user_group_ids,
        private: initialData.private !== undefined ? initialData.private : prevData.private,
      }));

      // Also update connected trends list if provided
      if (initialData.connected_trends && initialData.connected_trends.length > 0) {
        setSelectedTrendsList(initialData.connected_trends);
      }
    }
  }, [initialData, updateSignal, unit]);

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
          `${err}. ${err.response?.status === 500 ? 'Please try again in some time' : ''
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
            `${err}. ${err.response?.status === 500
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

  const handlePexelsImageSelect = (imageUrl: string, file: File) => {
    setSelectedFileName(file.name);
    setImageUrl(imageUrl);
    updateSignalData({
      ...signalData,
      attachment: imageUrl,
    });
    handleFileSelect({ target: { files: [file] } });
  };

  useEffect(() => {
    if (useFetchedArticles) {
      updateSignalData({
        ...signalData,
        headline: '',
      });
    }
  }, [useFetchedArticles]);


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
        const firstSearch = getStringBeforeSubstring(tos, '[2] Title:');
        const matches = findFirstArrayMatch(firstSearch);

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

  // Update the validation check function to use isSignalValid directly
  const validateForm = () => {
    return isSignalValid(signalData, [keyword1, keyword2, keyword3]);
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
        <div className='margin-bottom-07 '>
          <p className='undp-typography margin-bottom-01'>Signal Title*</p>
          <Input
            id='signal-headline'
            className='undp-input'
            placeholder='Enter signal title (max 100 characters)'
            value={signalData.headline}
            maxLength={100}
            status={showRedBorders && !signalData.headline ? 'error' : ''}
            onChange={d => {
              updateSignalData({
                ...signalData,
                headline: d.target.value,
              });
              setQuery(d.target.value);
            }}
          />
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
              <div id='signal-url'>
                <Input
                  className='undp-input'
                  placeholder='Enter signal source URL'
                  value={signalData.url}
                  onChange={e => {
                    updateSignalData({
                      ...signalData,
                      url: e.target.value,
                    });
                  }}
                  status={showRedBorders && !signalData.url ? 'error' : ''}
                />
              </div>
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
        <div className='margin-bottom-07'>
          <p className='undp-typography margin-bottom-01'>
            Signal Description*
          </p>
          <Input.TextArea
            id='signal-description'
            className='undp-input'
            placeholder='Enter signal description (max 1000 characters)'
            maxLength={1000}
            status={
              showRedBorders
                ? !signalData.description || signalData.description.length <= 30
                  ? 'error'
                  : ''
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
            {signalData.description
              ? 1000 - signalData.description.length
              : 1000}{' '}
            characters left
          </p>
        </div>
        <div
          className='flex-div'
          style={{ gap: '1rem', marginBottom: 'var(--spacing-07)' }}
        >
          <div className='margin-bottom-00' style={{ width: '50%' }}>
            <p className='undp-typography margin-bottom-01'>
              Location of the signal*
            </p>
            <Select
              id='signal-location'
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
              status={
                showRedBorders && !signalData.location ? 'error' : undefined
              }
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

          <div className='margin-bottom-00' style={{ width: '50%' }}>
            <p className='undp-typography margin-bottom-01'>
              Secondary Locations
            </p>
            <Select
              className='undp-select'
              placeholder='Select secondary locations'
              mode='multiple'
              maxTagCount='responsive'
              onChange={(e: string[]) => {
                updateSignalData({
                  ...signalData,
                  secondary_location: e.length === 0 ? [] : e,
                });
              }}
              value={signalData.secondary_location || []}
              showSearch
            >
              {choices?.location.map((d, i) => (
                <Select.Option className='undp-select-option' key={i} value={d}>
                  {d}
                </Select.Option>
              ))}
            </Select>
            <p className='undp-typography margin-top-02 margin-bottom-00 small-font'>
              Additional regions and/or countries for which this signal has
              relevance
            </p>
          </div>
        </div>
        <div className='margin-bottom-07'>
          <p className='undp-typography margin-bottom-01'>Signal Relevance*</p>
          <Input.TextArea
            id='signal-relevance'
            className='undp-input'
            placeholder='Enter signal relevance'
            onChange={e => {
              updateSignalData({
                ...signalData,
                relevance: e.target.value,
              });
            }}
            value={signalData.relevance}
            status={showRedBorders && !signalData.relevance ? 'error' : ''}
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
              id='signal-steep-primary'
              className='undp-select'
              placeholder='Select STEEP+V'
              onChange={e => {
                updateSignalData({
                  ...signalData,
                  steep_primary: e,
                });
              }}
              value={signalData.steep_primary}
              status={
                showRedBorders && !signalData.steep_primary
                  ? 'error'
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
              <SelectedEl style={{ opacity: '0.6' }}>
                No file selected
              </SelectedEl>
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
            Attach an image here to illustrate this Signal, if available. Use
            only images that are non-copyright or license-free/Creative Commons.
            File must be maximum 1 MBs. Compress larger images, if applicable.
          </p>
        </div>
        <PexelsImagePicker
          query={query}
          onImageSelect={handlePexelsImageSelect}
        />
      </div>
      <div className='margin-bottom-07'>
        <p className='undp-typography margin-bottom-01'>Keywords*</p>
        <div id='signal-keywords' className='flex-div'>
          <Input
            className='undp-input'
            placeholder='Enter Keyword#1'
            onChange={e => {
              setKeyword1(e.target.value);
            }}
            value={keyword1 || ''}
            status={
              showRedBorders &&
                ![keyword1, keyword2, keyword3].some(k => k && k.trim() !== '')
                ? 'error'
                : ''
            }
          />
          <Input
            className='undp-input'
            placeholder='Enter Keyword#2'
            onChange={e => {
              setKeyword2(e.target.value);
            }}
            value={keyword2 || ''}
          />
          <Input
            className='undp-input'
            placeholder='Enter Keyword#3'
            onChange={e => {
              setKeyword3(e.target.value);
            }}
            value={keyword3 || ''}
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
            id='signal-signature-primary'
            className='undp-select'
            placeholder='Select Signature Solution'
            onChange={e => {
              updateSignalData({
                ...signalData,
                signature_primary: e,
              });
            }}
            value={signalData.signature_primary}
            status={
              showRedBorders && !signalData.signature_primary
                ? 'error'
                : undefined
            }
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
          id='signal-sdgs'
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
          status={
            showRedBorders && (!signalData.sdgs || signalData.sdgs.length === 0)
              ? 'error'
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
          {CREATED_FOR.map((d, i) => (
            <Select.Option className='undp-select-option' key={i} value={d}>
              {d}
            </Select.Option>
          ))}
        </Select>
      </div>
      <div className='margin-bottom-07'>
        <p className='undp-typography margin-bottom-01'>Unit</p>
        <Select
          id='signal-unit'
          className='undp-select'
          placeholder='Select Unit'
          onChange={e => {
            updateSignalData({
              ...signalData,
              created_unit: e,
            });
          }}
          value={signalData.created_unit}
          status={
            showRedBorders && !signalData.created_unit ? 'error' : undefined
          }
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
      <div className='margin-bottom-07'>
        <StyledCheckboxWrapper>
          <StyledCheckboxInput
            type='checkbox'
            checked={signalData.private || false}
            onChange={e => {
              updateSignalData({
                ...signalData,
                private: e.target.checked,
              });
            }}
          />
          Private (only visible to you and admins)
        </StyledCheckboxWrapper>
      </div>
      {!updateSignal && (
        <SprintSection>
          <p className='sprint-header'>Sprint Management</p>
          <p className='sprint-description'>
            Choose which sprint(s) this signal should be added to. This allows
            you to organize signals within specific sprint cycles.
          </p>
          <div className='margin-bottom-02'>
            <SprintSelect
              value={selectedUserGroups}
              onChange={(values: number[]) => {
                // Ensure values is always an array, never null
                const safeValues = Array.isArray(values) ? values : [];
                setSelectedUserGroups(safeValues);
                updateSignalData({
                  ...signalData,
                  user_group_ids: safeValues,
                });
              }}
              placeholder='Select sprints to add this signal to'
            />
          </div>
        </SprintSection>
      )}
      <div className='margin-top-09'>
        {submittingError ? (
          <p className='margin-bottom-05' style={{ color: 'var(--dark-red)' }}>
            {submittingError}
          </p>
        ) : null}
        <div className='flex-div flex-vert-align-center margin-top-00'>
          <div className='flex-div'>
            {/* Submit Signal Button - Show when:
                1. Creating new signal (!updateSignal)
                2. Updating a draft (updateSignal.status === 'Draft') 
            */}
            {showSubmit && (
              <button
                className={`${!validateForm() || buttonDisabled ? 'disabled' : ''
                  } undp-button button-secondary button-arrow`}
                type='button'
                disabled={!validateForm() || buttonDisabled}
                title={
                  !validateForm() || buttonDisabled
                    ? 'All fields are required to submit a signal. Descriptions should be > 30 letters'
                    : 'Click to submit a signal'
                }
                onClick={() => {
                  const isValid = validateForm();
                  if (!isValid) {
                    setShowRedBorders(true);
                    return;
                  }
                  setButtonDisabled(true);
                  setSubmittingError(undefined);

                  const formattedData = formatSignalData(
                    signalData,
                    [keyword1, keyword2, keyword3],
                    choices,
                    selectedTrendsList,
                    selectedUserGroups,
                    { isSubmit: true },
                  );

                  if (updateSignal && signalData.id) {
                    // Update existing draft
                    const apiData = {
                      ...formattedData,
                      id: updateSignal.id,
                      created_by: formattedData.created_by || '',
                    };

                    updateSignalApi(updateSignal.id, apiData)
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
                          `${err}. ${err.response?.status === 500
                            ? 'Please try again in some time'
                            : ''
                          }`,
                        );
                      });
                  } else {
                    // Create new signal

                    createSignal(formattedData as any)
                      .then(() => {
                        setButtonDisabled(false);
                        navigate('/signals');
                        updateNotificationText(
                          'Successfully submitted the signal for review',
                        );
                      })
                      .catch((err: any) => {
                        setButtonDisabled(false);
                        setSubmittingError(
                          `${err}. ${err.response?.status === 500
                            ? 'Please try again in some time'
                            : ''
                          }`,
                        );
                      });
                  }
                }}
              >
                Submit Signal
              </button>
            )}

            {/* Update Signal Button - Show when updating non-draft signal */}
            {updateSignal && (
              <button
                className={`${!validateForm() || buttonDisabled ? 'disabled' : ''
                  } undp-button button-secondary button-arrow`}
                type='button'
                disabled={!validateForm() || buttonDisabled}
                title={
                  !validateForm() || buttonDisabled
                    ? 'All fields are required to update a signal. Descriptions should be > 30 letters'
                    : 'Click to update a signal'
                }
                onClick={() => {
                  const isValid = validateForm();
                  if (!isValid) {
                    setShowRedBorders(true);
                    return;
                  }
                  setButtonDisabled(true);
                  setSubmittingError(undefined);

                  const formattedData = formatSignalData(
                    signalData,
                    [keyword1, keyword2, keyword3],
                    choices,
                    selectedTrendsList,
                    selectedUserGroups,
                    {},
                  );
                  formattedData.status = signalData.status || '';

                  if (signalData.id) {
                    const apiData = {
                      ...formattedData,
                      id: updateSignal.id,
                      created_by: formattedData.created_by || '',
                    };

                    const updatePromise = onSubmit
                      ? onSubmit(apiData)
                      : updateSignalApi(updateSignal.id, apiData).then(() => {
                          navigate(`/signals/${updateSignal.id}`);
                          updateNotificationText(
                            'Successfully updated the signal',
                          );
                        });

                    updatePromise
                      .then(() => {
                        setButtonDisabled(false);
                      })
                      .catch(err => {
                        setButtonDisabled(false);
                        setSubmittingError(
                          `${err}. ${err.response?.status === 500
                            ? 'Please try again in some time'
                            : ''
                          }`,
                        );
                      });
                  }
                }}
              >
                Update Signal
              </button>
            )}

            {/* Add to Sprint Button - Show when:
                1. Creating new signal (!updateSignal)
                2. Updating a draft (updateSignal.status === 'Draft')
            */}
            {(!updateSignal || updateSignal.status === 'Draft') && (
              <Tooltip
                title={
                  selectedUserGroups.length === 0
                    ? "Please select a sprint from the 'Add to Sprint' field above to use this option"
                    : ''
                }
                open={selectedUserGroups.length === 0 ? undefined : false}
              >
                <button
                  className={`undp-button button-secondary button-arrow ${selectedUserGroups.length === 0 ? 'disabled' : ''
                    }`}
                  type='button'
                  disabled={selectedUserGroups.length === 0}
                  onClick={() => {
                    setButtonDisabled(true);
                    setSubmittingError(undefined);

                    const formattedData = formatSignalData(
                      signalData,
                      [keyword1, keyword2, keyword3],
                      choices,
                      selectedTrendsList,
                      selectedUserGroups,
                      { isAddToSprint: true },
                    );

                    if (updateSignal && signalData.id) {
                      // Update existing draft to sprint
                      const apiData = {
                        ...formattedData,
                        id: updateSignal.id,
                        created_by: formattedData.created_by || '',
                      };

                      updateSignalApi(updateSignal.id, apiData)
                        .then(() => {
                          setButtonDisabled(false);
                          navigate(
                            selectedUserGroups.length > 0
                              ? `/sprint/${selectedUserGroups[0]}`
                              : '/my-drafts',
                          );
                          updateNotificationText(
                            'Successfully added signal to sprint',
                          );
                        })
                        .catch(err => {
                          setButtonDisabled(false);
                          setSubmittingError(
                            `${err}. ${err.response?.status === 500
                              ? 'Please try again in some time'
                              : ''
                            }`,
                          );
                        });
                    } else {
                      // Create new signal in sprint

                      createSignal(formattedData as any)
                        .then(() => {
                          setButtonDisabled(false);
                          navigate(
                            selectedUserGroups.length > 0
                              ? `/sprint/${selectedUserGroups[0]}`
                              : '/my-drafts',
                          );
                          updateNotificationText(
                            'Successfully added signal to sprint',
                          );
                        })
                        .catch(err => {
                          setButtonDisabled(false);
                          setSubmittingError(
                            `${err}. ${err.response?.status === 500
                              ? 'Please try again in some time'
                              : ''
                            }`,
                          );
                        });
                    }
                  }}
                >
                  Add to Sprint
                </button>
              </Tooltip>
            )}

            {/* Save as Draft Button - Show when:
                1. Creating new signal (!updateSignal)
                2. Updating a draft (updateSignal.status === 'Draft')
            */}
            {(!updateSignal || updateSignal.status === 'Draft') && (
              <button
                className='undp-button button-secondary button-arrow'
                type='button'
                onClick={() => {
                  setButtonDisabled(true);
                  setSubmittingError(undefined);

                  const formattedData = formatSignalData(
                    signalData,
                    [keyword1, keyword2, keyword3],
                    choices,
                    selectedTrendsList,
                    selectedUserGroups,
                    { isDraft: true },
                  );

                  if (updateSignal && signalData.id) {
                    // Update existing draft
                    const apiData = {
                      ...formattedData,
                      id: updateSignal.id,
                      created_by: formattedData.created_by || '',
                    };

                    updateSignalApi(updateSignal.id, apiData)
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
                          `${err}. ${err.response?.status === 500
                            ? 'Please try again in some time'
                            : ''
                          }`,
                        );
                      });
                  } else {
                    // Create new draft

                    createSignal(formattedData as any)
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
                          `${err}. ${err.response?.status === 500
                            ? 'Please try again in some time'
                            : ''
                          }`,
                        );
                      });
                  }
                }}
              >
                Save Signal as Draft
              </button>
            )}

            {/* Delete Draft Signal Button - Show only when updating a draft */}
            {updateSignal && updateSignal.status === 'Draft' && (
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
            )}

            {/* Delete Archived Signal Button - Show only for archived signals and proper role */}
            {updateSignal &&
              updateSignal.status === 'Archived' &&
              (role === 'Curator' || role === 'Admin') && (
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
              )}
          </div>
          {buttonDisabled ? <div className='undp-loader' /> : null}
        </div>
      </div>
      <div>
        {showSubmit && (
          <ValidationMessage
            signal={signalData}
            keyWords={[keyword1, keyword2, keyword3]}
          />
        )}
      </div>
      <div className='margin-top-09'> </div>
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
