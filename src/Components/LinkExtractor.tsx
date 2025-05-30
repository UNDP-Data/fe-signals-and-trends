import { Alert, Button, Input, Spin, Tooltip } from 'antd';
import axios from 'axios';
import { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
// Import antd icons
import { LinkOutlined } from '@ant-design/icons';
import type { InputRef } from 'antd';

// Replace any with a specific type or interface
const extractNewsUtils: { extractNewsFromUrl?: (url: string, apiKey: string, useFallback: boolean, callback: () => void) => Promise<ExtractedNewsData> } = {};

const WORLD_NEWS_API_KEY = import.meta.env.VITE_WORLD_NEWS_API_KEY;
const JSONLINK_API_KEY = import.meta.env.VITE_JSONLINK_API_KEY;

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
  useJsonLink?: boolean;
}

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
`;


/**
 * Extract metadata from a URL using JSONLink API
 * @param url The URL to extract metadata from
 * @returns Normalized metadata matching ExtractedNewsData format
 */
const extractWithJsonLink = async (url: string): Promise<ExtractedNewsData> => {
  const encodedUrl = encodeURIComponent(url);
  const apiUrl = `https://jsonlink.io/api/extract?url=${encodedUrl}&api_key=${JSONLINK_API_KEY}`;
  
  const response = await fetch(apiUrl);
  
  if (!response.ok) {
    throw new Error(`JSONLink API error: ${response.status} - ${response.statusText}`);
  }
  
  const data = await response.json();
  
  // Normalize the JSONLink response to match ExtractedNewsData structure
  return {
    title: data.title || '',
    text: data.description || '',
    url: data.url || url,
    image: data.images?.[0] || '',
    images: data.images?.map((img: string) => ({ url: img })) || [],
    publish_date: '', // JSONLink doesn't provide this field
    author: '', // JSONLink doesn't provide this field
    authors: [], // JSONLink doesn't provide this field
    keywords: [], // JSONLink doesn't provide this field
    language: '', // JSONLink doesn't provide this field
    source_country: '' // JSONLink doesn't provide this field
  };
};

export function LinkExtractor({ 
  value, 
  onChange, 
  onFetch, 
  disabled,
  useFallback = true,
  useJsonLink = true
}: Props) {
  const [url, setUrl] = useState(value || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState(false);
  const [extractionStatus, setExtractionStatus] = useState<'idle' | 'api' | 'jsonlink' | 'fallback' | 'success' | 'error'>('idle');
  const inputRef = useRef<InputRef>(null);
  
  // Only show fallback UI if the utils are available
  const showFallbackUI = extractNewsUtils.extractNewsFromUrl !== undefined && useFallback;

  // Update local state when prop value changes, but only if it's different
  useEffect(() => {
    if (value !== undefined && value !== url) {
      setUrl(value);
    }
  }, [value, url]);

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
    
    // Prevent unnecessary re-renders by only calling onChange if the value actually changed
    if (newValue !== value) {
      onChange?.(newValue);
    }
    
    // Only reset these states if there's actually a change
    if (error) setError(null);
    if (usingFallback) setUsingFallback(false);
    if (extractionStatus !== 'idle') setExtractionStatus('idle');
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

    try {
      let extractedData: ExtractedNewsData;
      
      // First try JSONLink if enabled
      if (useJsonLink) {
        console.log('useJsonLink', useJsonLink);
        try {
          setExtractionStatus('jsonlink');
          extractedData = await extractWithJsonLink(url);
          console.log('extractedData', extractedData);
          setExtractionStatus('success');
          onFetch?.(extractedData);
          setIsLoading(false);
          return;
        } catch (jsonLinkError) {
          console.warn('JSONLink extraction failed, falling back:', jsonLinkError);
          // Continue to other extraction methods
        }
      }
      
      setExtractionStatus('api');
      
      const WORLD_NEWS_API_KEY = import.meta.env.VITE_WORLD_NEWS_API_KEY;
      
      // Use utility function if available, otherwise use basic implementation
      if (extractNewsUtils.extractNewsFromUrl) {
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

      console.log('extractedData', extractedData);

      setExtractionStatus('success');
      onFetch?.(extractedData);
    } catch (err) {
      console.error('Error extracting news:', err);
      setError('Failed to extract information from this URL. Please try again later.');
      setExtractionStatus('error');
    } finally {
      setIsLoading(false);
      // Restore focus to input after extraction completes
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  };

  // Get status text and color based on extraction status
  const getStatusInfo = () => {
    switch (extractionStatus) {
      case 'jsonlink':
        return { text: 'Extracting data with JSONLink...', color: 'var(--blue-600)' };
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
          ref={inputRef}
          className="undp-input"
          placeholder="Enter signal source URL"
          value={url}
          onChange={handleInputChange}
          disabled={disabled || isLoading}
          status={error ? 'error' : ''}
        />
        
        <Tooltip 
          title="Extract article information from this URL" 
          placement="top"
          classNames={{ root: "undp-tooltip" }}
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
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '50px',
              height: '42px',
              padding: '0'
            }}
            icon={isLoading ? <Spin size="small" /> : <LinkOutlined />}
          />
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
