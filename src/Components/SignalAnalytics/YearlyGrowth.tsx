import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface YearlyGrowthProps {
  yearlyData: Array<{ year: number; count: number }>;
}

const YearlyGrowth: React.FC<YearlyGrowthProps> = ({ yearlyData }) => {
  return (
    <div style={{ backgroundColor: 'white', padding: '1rem', borderRadius: '4px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      <h6 className="undp-typography margin-bottom-05">Yearly Signal Growth</h6>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={yearlyData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#D0BFFF" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default YearlyGrowth;