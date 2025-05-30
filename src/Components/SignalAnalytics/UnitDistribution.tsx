import React from 'react';
import ReusablePieChart from './ReusablePieChart';

interface UnitDistributionProps {
  unitData: Array<{ name: string; value: number; percentage: string }>;
}

const UnitTooltip = ({ active, payload }: any) => {
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
          Signals: {payload[0].value} ({payload[0].payload.percentage}%)
        </p>
      </div>
    );
  }
  return null;
};

const UnitDistribution: React.FC<UnitDistributionProps> = ({ unitData }) => {
  return (
    <ReusablePieChart
      data={unitData}
      title="Signals by Unit"
      tooltipFormatter={UnitTooltip}
      maxItems={5}
    />
  );
};

export default UnitDistribution;