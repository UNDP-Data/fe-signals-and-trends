import { Alert, Button, Input, Spin, Tooltip } from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

let extractNewsUtils: any = null;

export interface ExtractedNewsData {
  title: string;
  text: string;
  url: string;
  image: string;
  images: Array<{
    title?: string;
    url: string;
    width?: number;
    height?: number;
  }>;
  publish_date?: string;
  author?: string;
  authors?: string[];
  keywords?: string[];
  language?: string;
  source_country?: string;
}

interface Props {
  value?: string;
  onChange?: (value: string) => void;
  onFetch?: (extractedData: ExtractedNewsData) => void;
  disabled?: boolean;
  useFallback?: boolean;
}

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
`;

export function LinkExtractor({ 
  value, 
  onChange, 
  onFetch, 
  disabled,
  useFallback = true 
}: Props) {
  const [url, setUrl] = useState(value || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState(false);
  const [extractionStatus, setExtractionStatus] = useState<'idle' | 'api' | 'fallback' | 'success' | 'error'>('idle');
  
  // Only show fallback UI if the utils are available
  const showFallbackUI = extractNewsUtils !== null && useFallback;

  // Update local state when prop value changes
  useEffect(() => {
    if (value !== undefined) {
      setUrl(value);
    }
  }, [value]);

  const isValidUrl = (urlString: string): boolean => {
    try {
      const urlObj = new URL(urlString);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setUrl(newValue);
    onChange?.(newValue);
    setError(null);
    setUsingFallback(false);
    setExtractionStatus('idle');
  };

  // Basic extraction when utils are not available
  const extractNewsBasic = async (url: string, apiKey: string): Promise<ExtractedNewsData> => {
    const response = await axios.get('https://api.worldnewsapi.com/extract-news', {
      params: {
        url,
        analyze: 'true'
      },
      headers: {
        'X-Api-Key': apiKey
      }
    });

    return {
      title: response.data.title,
      text: response.data.text,
      url: response.data.url,
      image: response.data.image || (response.data.images && response.data.images.length > 0 ? response.data.images[0].url : ''),
      images: response.data.images || [],
      publish_date: response.data.publish_date,
      author: response.data.author,
      authors: response.data.authors,
      keywords: response.data.keywords || [],
      language: response.data.language,
      source_country: response.data.source_country
    };
  };

  const handleExtractNews = async () => {
    if (!isValidUrl(url)) {
      setError('Please enter a valid URL');
      setExtractionStatus('error');
      return;
    }

    setIsLoading(true);
    setError(null);
    setUsingFallback(false);
    setExtractionStatus('api');

    try {
      const WORLD_NEWS_API_KEY = 
        import.meta.env.VITE_WORLD_NEWS_API_KEY || 
        process.env.REACT_APP_WORLD_NEWS_API_KEY;
      
      let extractedData: ExtractedNewsData;
      
      // Use utility function if available, otherwise use basic implementation
      if (extractNewsUtils) {
        extractedData = await extractNewsUtils.extractNewsFromUrl(
          url, 
          WORLD_NEWS_API_KEY, 
          useFallback,
          () => {
            setUsingFallback(true);
            setExtractionStatus('fallback');
          }
        );
      } else {
        // Use basic extraction when utils are not available
        extractedData = await extractNewsBasic(url, WORLD_NEWS_API_KEY);
      }
      
      setExtractionStatus('success');
      onFetch?.(extractedData);
    } catch (err) {
      console.error('Error extracting news:', err);
      setError('Failed to extract information from this URL. Please try again later.');
      setExtractionStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  // Get status text and color based on extraction status
  const getStatusInfo = () => {
    switch (extractionStatus) {
      case 'api':
        return { text: 'Extracting data from API...', color: 'var(--blue-600)' };
      case 'fallback':
        return { text: 'Using alternative extraction method...', color: 'var(--yellow-600)' };
      case 'success':
        return usingFallback && showFallbackUI
          ? { text: 'Extraction completed successfully (alternative method)', color: 'var(--green-600)' }
          : { text: 'Extraction completed successfully', color: 'var(--green-600)' };
      case 'error':
        return { text: error || 'Failed to extract data', color: 'var(--dark-red)' };
      default:
        return { text: '', color: '' };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <div>
      <InputWrapper>
        <Input
          className="undp-input"
          placeholder="Enter signal source URL"
          value={url}
          onChange={handleInputChange}
          disabled={disabled || isLoading}
          status={error ? 'error' : ''}
        />
        
        <Tooltip 
          title="Extract article information (title, description, image, keywords, location) from this URL to auto-populate the form fields" 
          placement="top"
          overlayClassName="undp-tooltip"
        >
          <Button
            type="primary"
            onClick={handleExtractNews}
            disabled={!url || disabled || isLoading || !isValidUrl(url)}
            className="undp-button button-primary"
            style={{ 
              flexShrink: 0,
              backgroundColor: 'var(--blue-600)',
              color: 'var(--white)',
              padding: '4px 12px',
              lineHeight: '32px',
              height: '32px'
            }}
          >
            {isLoading ? <Spin size="small" /> : 'Extract'}
          </Button>
        </Tooltip>
      </InputWrapper>
      
      {statusInfo.text && (
        <div style={{ 
          color: statusInfo.color, 
          fontSize: '0.875rem', 
          marginTop: '4px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          {isLoading && <Spin size="small" />}
          {statusInfo.text}
        </div>
      )}
      
      {showFallbackUI && extractionStatus === 'fallback' && (
        <Alert
          message="Using alternative extraction method"
          description="Primary extraction method unavailable. Using alternative approach. Results may vary."
          type="warning"
          showIcon
          style={{ marginTop: '10px', fontSize: '0.875rem' }}
        />
      )}
      
      {showFallbackUI && usingFallback && extractionStatus === 'success' && (
        <Alert
          message="Extraction completed with alternative method"
          description="Content was extracted using an alternative method. Some fields might be incomplete."
          type="info"
          showIcon
          style={{ marginTop: '10px', fontSize: '0.875rem' }}
        />
      )}
    </div>
  );
}
