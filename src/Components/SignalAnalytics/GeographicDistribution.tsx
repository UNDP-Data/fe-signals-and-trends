import React from 'react';
import ReusablePieChart from './ReusablePieChart';

interface GeographicDistributionProps {
  locationData: Array<{ name: string; value: number }>;
  totalSignals: number;
}

const GeoTooltip = (totalSignals: number) => ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        backgroundColor: 'white',
        padding: '0.5rem',
        border: '1px solid #ccc',
        borderRadius: '4px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        color: 'black',
      }}>
        <p className="undp-typography small-font" style={{ fontWeight: 'bold', color: 'black' }}>
          {payload[0].name}
        </p>
        <p className="undp-typography small-font" style={{ color: 'black' }}>
          Signals: {payload[0].value} ({((payload[0].value / totalSignals) * 100).toFixed(1)}%)
        </p>
      </div>
    );
  }
  return null;
};

function GeographicDistribution({ locationData, totalSignals }: GeographicDistributionProps) {
  return (
    <ReusablePieChart
      data={locationData}
      title="Geographic Distribution"
      tooltipFormatter={GeoTooltip(totalSignals)}
      maxItems={6}
    />
  );
}

export default GeographicDistribution;