import { Modal } from 'antd';
import { useState, useContext } from 'react';
import Context from '../../Context/Context';
import { exportSignals } from '../../API';
import type { SignalDataType } from '../../Types';

interface DownloadButtonsProps {
  totalCount: number;
  getQueryParams: () => Record<string, unknown>;
  getQueryParamsToDownloadAll: () => Record<string, unknown>;
  signalList: SignalDataType[];
}

export function DownloadButtons({
  totalCount,
  getQueryParams,
  getQueryParamsToDownloadAll,
  signalList,
}: DownloadButtonsProps) {
  const [loading, setLoading] = useState(false);
  const { role, cardsToPrint, updateCardsToPrint } = useContext(Context);

  const handleDownloadAll = () => {
    setLoading(true);
    exportSignals(getQueryParamsToDownloadAll(), 'excel').then(response => {
      const url = window.URL.createObjectURL(
        new Blob([response]),
      );
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute(
        'download',
        `FTSS_signals_${new Date(Date.now()).getFullYear()}-${
          new Date(Date.now()).getMonth() + 1
        }-${new Date(Date.now()).getDate()}.xlsx`,
      );
      document.body.appendChild(link);
      link.click();
      setLoading(false);
    });
  };

  const handleDownload = () => {
    setLoading(true);
    exportSignals(getQueryParams(), 'excel').then(response => {
      const url = window.URL.createObjectURL(
        new Blob([response]),
      );
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute(
        'download',
        `FTSS_signals_${new Date(Date.now()).getFullYear()}-${
          new Date(Date.now()).getMonth() + 1
        }-${new Date(Date.now()).getDate()}.xlsx`,
      );
      document.body.appendChild(link);
      link.click();
      setLoading(false);
    });
  };

  const handleAddToPDF = () => {
    const cardToPrintTemp = [...cardsToPrint];
    signalList.forEach(s => {
      if (
        cardsToPrint.findIndex(
          el =>
            el.id === `${s.id}` &&
            el.mode === 'card' &&
            el.type === 'signal',
        ) === -1
      ) {
        cardToPrintTemp.push({
          type: 'signal',
          mode: 'card',
          id: `${s.id}`,
        });
      }
    });
    updateCardsToPrint(cardToPrintTemp);
  };

  return (
    <>
      <div
        className='margin-bottom-05 flex-div'
        style={{
          padding: '1rem',
          backgroundColor: 'var(--gray-200)',
          justifyContent: 'center',
          width: 'calc(100% - 2rem)',
          alignItems: 'center',
        }}
      >
        <div className='bold'>
          {totalCount}{' '}
          {totalCount > 1 ? 'signals available' : 'signal available'}
        </div>
        {role === 'Admin' || role === 'Curator' ? (
          <button
            type='button'
            className='undp-button button-primary'
            onClick={handleDownloadAll}
          >
            Download All {totalCount} Signals
          </button>
        ) : null}
        {role === 'Admin' || role === 'Curator' ? (
          <button
            type='button'
            className='undp-button button-primary'
            onClick={handleDownload}
          >
            Download Current Page
          </button>
        ) : null}
        <button
          type='button'
          className='undp-button button-primary'
          onClick={handleAddToPDF}
        >
          Add signals on page to PDF
        </button>
      </div>
      <Modal className='undp-modal undp-loading-modal' title='' open={loading}>
        <div style={{ margin: 'auto' }}>
          <div className='undp-loader' style={{ margin: 'auto' }} />
        </div>
      </Modal>
    </>
  );
}