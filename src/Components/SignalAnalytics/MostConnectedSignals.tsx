import React from 'react';

interface MostConnectedSignalsProps {
  networkData: Array<{ id: number; headline: string; connections: number; unit: string }>;
}

const MostConnectedSignals: React.FC<MostConnectedSignalsProps> = ({ networkData }) => {
  return (
    <div style={{ backgroundColor: 'white', padding: '1rem', borderRadius: '4px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', gridColumn: 'span 3' }}>
      <h6 className="undp-typography margin-bottom-05">Most Connected Signals (Top 20)</h6>
      <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
        <div className="grid-col-2 gap-05">
          {networkData.map((signal, index) => (
            <div key={signal.id} className="margin-bottom-05" style={{ 
              padding: '0.5rem', 
              backgroundColor: index % 2 === 0 ? 'var(--gray-100)' : 'white', 
              borderRadius: '4px' 
            }}>
              <h6 className="undp-typography small-font margin-bottom-02">{signal.headline}</h6>
              <div className="flex-div flex-space-between">
                <span className="undp-typography small-font">{signal.unit}</span>
                <span className="undp-chip" style={{ backgroundColor: '#B5E4D1', fontSize: '0.75rem' }}>
                  {signal.connections} trends
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MostConnectedSignals;