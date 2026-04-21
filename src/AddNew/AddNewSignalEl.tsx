import { useState } from 'react';
import { SignalEntryFormEl } from '../Components/SignalEntryFormEl';
import { SmartExtractModal } from '../Components/SmartExtractModal';
import type { SignalBasicType } from '../Types';
import { ExtractedNewsData } from '../Components/LinkExtractor';
import { normalizeSignalData } from '../Utils/Signals';

export const metadata = {
  title: 'Add New Signal',
  description: 'Add a new signal to the system.',
};

export function AddNewSignalEl() {
  const [extractedData, setExtractedData] = useState<
    SignalBasicType | undefined
  >(undefined);
  const [showExtractModal, setShowExtractModal] = useState(false);

  const handleExtracted = (data: ExtractedNewsData) => {
    const signalData = normalizeSignalData(data) as SignalBasicType;
    setExtractedData(signalData);
    console.log('signalData', signalData);
    setShowExtractModal(false);
  };

  return (
    <div className='signal-entry-page'>
      <div
        className='flex-wrap'
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <h3 className='undp-typography margin-top-05'>Add New Signal</h3>
        <button
          className='undp-button button-secondary'
          type='button'
          onClick={() => setShowExtractModal(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '1rem',
          }}
        >
          <svg width='16' height='16' viewBox='0 0 16 16' fill='none'>
            <path
              d='M8 2V8M8 8V14M8 8H14M8 8H2'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
            />
          </svg>
          AI Extract
        </button>
      </div>

      <SignalEntryFormEl draft={false} initialData={extractedData} />

      <SmartExtractModal
        isOpen={showExtractModal}
        onClose={() => setShowExtractModal(false)}
        onExtract={handleExtracted}
      />
    </div>
  );
}
