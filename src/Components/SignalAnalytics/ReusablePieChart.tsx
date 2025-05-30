import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { COLORS } from './types';

interface ReusablePieChartProps {
  data: Array<any>;
  title: string;
  dataKey?: string;
  labelFormatter?: (props: any) => React.ReactNode;
  tooltipFormatter?: (props: any) => React.ReactNode;
  maxItems?: number;
}

const DefaultLabel = ({ cx, cy, midAngle, outerRadius, percent, index, name }: any) => {
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

const DefaultTooltip = ({ active, payload }: any) => {
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
          {`Signals: ${payload[0].value}`}
        </p>
      </div>
    );
  }
  return null;
};

const ReusablePieChart: React.FC<ReusablePieChartProps> = ({
  data,
  title,
  dataKey = 'value',
  labelFormatter = DefaultLabel,
  tooltipFormatter = DefaultTooltip,
  maxItems = 6,
}) => {
  const chartData = data.slice(0, maxItems);
  return (
    <div style={{ backgroundColor: 'white', padding: '1rem', borderRadius: '4px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      <h6 className="undp-typography margin-bottom-05">{title}</h6>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            outerRadius={80}
            dataKey={dataKey}
            label={labelFormatter}
            labelLine={false}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={tooltipFormatter} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ReusablePieChart; 