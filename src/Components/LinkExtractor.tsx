import { Button, Input, Spin, Tooltip } from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

interface Props {
  value?: string;
  onChange?: (value: string) => void;
  onFetch?: (extractedData: ExtractedNewsData) => void;
  disabled?: boolean;
}

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

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
`;

export function LinkExtractor({ value, onChange, onFetch, disabled }: Props) {
  const [url, setUrl] = useState(value || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
  };

  const extractNewsFromUrl = async () => {
    if (!isValidUrl(url)) {
      setError('Please enter a valid URL');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const WORLD_NEWS_API_KEY = 
        import.meta.env.VITE_WORLD_NEWS_API_KEY || 
        process.env.REACT_APP_WORLD_NEWS_API_KEY;
      
      const response = await axios.get('https://api.worldnewsapi.com/extract-news', {
        params: {
          url,
          analyze: 'true'
        },
        headers: {
          'X-Api-Key': WORLD_NEWS_API_KEY
        }
      });

      // Extract keywords from the article text
      const extractedKeywords = extractKeywordsFromText(
        response.data.title + ' ' + response.data.text
      );

      // Process data
      const extractedData: ExtractedNewsData = {
        title: response.data.title,
        text: response.data.text,
        url: response.data.url,
        image: response.data.image || (response.data.images && response.data.images.length > 0 ? response.data.images[0].url : ''),
        images: response.data.images || [],
        publish_date: response.data.publish_date,
        author: response.data.author,
        authors: response.data.authors,
        keywords: extractedKeywords,
        language: response.data.language,
        source_country: response.data.source_country
      };

      onFetch?.(extractedData);
    } catch (err) {
      console.error('Error extracting news:', err);
      setError('Failed to extract information from this URL. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Simple function to extract keywords from text
  const extractKeywordsFromText = (text: string): string[] => {
    // Remove common words and punctuation
    const commonWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'with', 'a', 'an', 'of', 'by', 'from'];
    
    const words = text
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3 && !commonWords.includes(word));
    
    // Count word frequency
    const wordCount: {[key: string]: number} = {};
    words.forEach(word => {
      wordCount[word] = (wordCount[word] || 0) + 1;
    });
    
    // Sort by frequency
    const sortedWords = Object.entries(wordCount)
      .sort((a, b) => b[1] - a[1])
      .map(entry => entry[0]);
    
    // Return top keywords
    return sortedWords.slice(0, 3);
  };

  return (
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
          onClick={extractNewsFromUrl}
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
      
      {error && (
        <div style={{ color: 'var(--dark-red)', fontSize: '0.875rem', marginTop: '4px' }}>
          {error}
        </div>
      )}
    </InputWrapper>
  );
}
