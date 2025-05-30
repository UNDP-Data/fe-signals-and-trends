import { useState } from 'react';
import { Button, Input, Spin, Alert } from 'antd';
import { getSignalData } from '../Utils/AI';
import type { SignalBasicType } from '../Types';
import { ExtractedNewsData, LinkExtractor } from './LinkExtractor';

interface SmartExtractModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExtract: (data: ExtractedNewsData) => void;
}

export function SmartExtractModal({ isOpen, onClose, onExtract }: SmartExtractModalProps) {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExtract = async (data: ExtractedNewsData) => {
    try {
      onExtract(data);
      console.log('data', data);
      handleClose();
    } catch (err) {
      setError('Failed to extract information. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setContent('');
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}
      onClick={handleClose}
    >
      <div 
        style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.15)',
          maxWidth: '600px',
          width: '90%',
          maxHeight: '80vh',
          overflow: 'auto'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div 
          style={{
            padding: '24px',
            borderBottom: '1px solid #e0e0e0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <h3 className="undp-typography" style={{ margin: 0, fontSize: '1.5rem' }}>Extract Signal</h3>
          <button
            className="undp-button button-tertiary"
            onClick={handleClose}
            style={{ 
              padding: '0.5rem', 
              minHeight: 'auto',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer'
            }}
          >
            <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
              <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <div style={{ padding: '24px' }}>
          <p className="undp-typography" style={{ marginBottom: '1.5rem', color: 'var(--gray-700)' }}>
            Add the link for the signal along with any additional context or comments. The AI will extract relevant information from the provided content.
          </p>
          <LinkExtractor
            value={content}
            onChange={setContent}
            onFetch={handleExtract}
          />
        </div>
      </div>
    </div>
  );
}