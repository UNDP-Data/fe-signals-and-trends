import { Button, Input, Spin, Tooltip, Alert } from 'antd';
import { useState, useRef } from 'react';
import styled from 'styled-components';
import { LinkOutlined } from '@ant-design/icons';
import type { InputRef } from 'antd';
import { getSignalData } from '../Utils/AI';
import type { SignalBasicType } from '../Types';

interface Props {
  value?: string;
  onChange?: (value: string) => void;
  onFetch?: (data: SignalBasicType) => void;
  disabled?: boolean;
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
}: Props) {
  const [url, setUrl] = useState(value || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<InputRef>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setUrl(newValue);
    onChange?.(newValue);
    if (error) setError(null);
  };

  const handleExtract = async () => {
    if (!url || !/^https?:\/\//.test(url)) {
      setError('Please enter a valid URL');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const data: SignalBasicType = await getSignalData(url);
      onFetch?.(data);
    } catch (err) {
    setError('Failed to extract information from this URL. Please try again later.');
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  };

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
        <Tooltip title="Extract signal data from this URL" placement="top">
          <Button
            type="primary"
            onClick={handleExtract}
            disabled={!url || disabled || isLoading || !/^https?:\/\//.test(url)}
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
              padding: '0',
            }}
            icon={isLoading ? <Spin size="small" /> : <LinkOutlined />}
          />
        </Tooltip>
      </InputWrapper>
      {isLoading && (
        <div style={{ marginTop: '4px' }}><Spin size="small" /> Extracting...</div>
      )}
      {error && (
        <Alert
          message={error}
          type="error"
          showIcon
          style={{ marginTop: '10px', fontSize: '0.875rem' }}
        />
      )}
    </div>
  );
}