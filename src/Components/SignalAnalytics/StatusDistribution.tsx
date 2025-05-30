import React from 'react';
import ReusablePieChart from './ReusablePieChart';
import { STATUS_COLORS, COLORS } from './types';

interface StatusDistributionProps {
  statusData: Array<{ name: string; value: number }>;
}

const StatusLabel = ({ cx, cy, midAngle, outerRadius, percent, index, name }: any) => {
  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 20;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text
      x={x}
      y={y}
      fill="black"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      className="undp-typography small-font"
    >
      {`${name}: ${(percent * 100).toFixed(1)}%`}
    </text>
  );
};

const StatusTooltip = ({ active, payload }: any) => {
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
          Signals: {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

const StatusDistribution: React.FC<StatusDistributionProps> = ({ statusData }) => {
  // Custom cell color logic for status
  const getCellColor = (entry: any, index: number) =>
    STATUS_COLORS[entry.name as keyof typeof STATUS_COLORS] || COLORS[index % COLORS.length];

  return (
    <ReusablePieChart
      data={statusData}
      title="Status Distribution"
      labelFormatter={StatusLabel}
      tooltipFormatter={StatusTooltip}
      maxItems={statusData.length}
      // Pass custom cell color logic
      // We'll override the default Cell rendering in ReusablePieChart for this
    />
  );
};

export default StatusDistribution;