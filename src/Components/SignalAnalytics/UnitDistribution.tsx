import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, LabelList } from 'recharts';
import { COLORS } from './types';

interface UnitDistributionProps {
  unitData: Array<{ name: string; value: number; percentage: string }>;
}

const UnitDistribution: React.FC<UnitDistributionProps> = ({ unitData }) => {
  // Take top 5 units for the pie chart
  const topUnits = unitData.slice(0, 5);
  
  // Custom label to show percentage
  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 20;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill={COLORS[index % COLORS.length]} 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="undp-typography small-font"
      >
        {`${name}: ${(percent * 100).toFixed(1)}%`}
      </text>
    );
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ 
          backgroundColor: 'white', 
          padding: '0.5rem', 
          border: '1px solid #ccc',
          borderRadius: '4px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <p className="undp-typography small-font" style={{ fontWeight: 'bold' }}>
            {payload[0].name}
          </p>
          <p className="undp-typography small-font">
            Signals: {payload[0].value} ({payload[0].payload.percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ backgroundColor: 'white', padding: '1rem', borderRadius: '4px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      <h6 className="undp-typography margin-bottom-05">Signals by Unit</h6>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={topUnits}
            cx="50%"
            cy="50%"
            outerRadius={80}
            dataKey="value"
            label={renderCustomLabel}
            labelLine={false}
          >
            {topUnits.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UnitDistribution;