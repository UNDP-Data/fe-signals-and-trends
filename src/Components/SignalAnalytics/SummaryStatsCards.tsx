import React from 'react';
import { ComprehensiveStatsType } from './types';

interface SummaryStatsCardsProps {
  stats: ComprehensiveStatsType;
}

const SummaryStatsCards: React.FC<SummaryStatsCardsProps> = ({ stats }) => {
  return (
    <div className="flex-div gap-05 margin-bottom-07" style={{ flexWrap: 'wrap' }}>
      <div style={{ 
        backgroundColor: 'white', 
        padding: '0.75rem 1rem', 
        borderRadius: '4px', 
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        flex: '1 1 auto',
        minWidth: '150px'
      }}>
        <h6 className="undp-typography small-font" style={{ color: 'var(--gray-600)', margin: '0 0 0.25rem 0' }}>Total Signals</h6>
        <p className="undp-typography" style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0 }}>
          {stats.totalSignals.toLocaleString()}
        </p>
      </div>
      <div style={{ 
        backgroundColor: 'white', 
        padding: '0.75rem 1rem', 
        borderRadius: '4px', 
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        flex: '1 1 auto',
        minWidth: '150px'
      }}>
        <h6 className="undp-typography small-font" style={{ color: 'var(--gray-600)', margin: '0 0 0.25rem 0' }}>Connected to Trends</h6>
        <div className="flex-div gap-03 flex-vert-align-center">
          <p className="undp-typography" style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0 }}>
            {stats.signalsWithTrends}
          </p>
          <p className="undp-typography small-font" style={{ color: 'var(--gray-600)', margin: 0 }}>
            ({stats.totalSignals > 0 ? ((stats.signalsWithTrends / stats.totalSignals) * 100).toFixed(1) : '0'}%)
          </p>
        </div>
      </div>
      <div style={{ 
        backgroundColor: 'white', 
        padding: '0.75rem 1rem', 
        borderRadius: '4px', 
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        flex: '1 1 auto',
        minWidth: '150px'
      }}>
        <h6 className="undp-typography small-font" style={{ color: 'var(--gray-600)', margin: '0 0 0.25rem 0' }}>Active Units</h6>
        <p className="undp-typography" style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0 }}>
          {stats.activeUnits}
        </p>
      </div>
      <div style={{ 
        backgroundColor: 'white', 
        padding: '0.75rem 1rem', 
        borderRadius: '4px', 
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        flex: '1 1 auto',
        minWidth: '150px'
      }}>
        <h6 className="undp-typography small-font" style={{ color: 'var(--gray-600)', margin: '0 0 0.25rem 0' }}>Avg Keywords/Signal</h6>
        <p className="undp-typography" style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0 }}>
          {stats.avgKeywordsPerSignal}
        </p>
      </div>
    </div>
  );
};

export default SummaryStatsCards;