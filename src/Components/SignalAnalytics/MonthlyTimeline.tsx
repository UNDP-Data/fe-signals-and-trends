import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface MonthlyTimelineProps {
  timelineData: Array<{ month: string; count: number }>;
}

const MonthlyTimeline: React.FC<MonthlyTimelineProps> = ({ timelineData }) => {
  return (
    <div style={{ backgroundColor: 'white', padding: '1rem', borderRadius: '4px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', gridColumn: 'span 3' }}>
      <h6 className="undp-typography margin-bottom-05">Signal Creation Timeline (Monthly)</h6>
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart data={timelineData}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Area type="monotone" dataKey="count" stroke="#A5D7E8" fill="#A5D7E8" fillOpacity={0.6} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyTimeline;
