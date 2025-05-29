import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { COLORS } from './types';

interface STEEPCategoriesProps {
  steepData: Array<{ name: string; value: number }>;
}

const STEEPCategories: React.FC<STEEPCategoriesProps> = ({ steepData }) => {
  return (
    <div style={{ backgroundColor: 'white', padding: '1rem', borderRadius: '4px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      <h6 className="undp-typography margin-bottom-05">STEEP+V Categories</h6>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={steepData}
            cx="50%"
            cy="50%"
            outerRadius={100}
            dataKey="value"
            label={({ name, value }) => `${name}: ${value}`}
          >
            {steepData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default STEEPCategories;