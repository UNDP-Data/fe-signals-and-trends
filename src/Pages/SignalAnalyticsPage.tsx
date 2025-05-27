import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { searchSignals } from '../API/signalsCall';
import SignalAnalyticsDashboard from '../Components/SignalAnalytics';
import { SignalDataType } from '../Types';

const fetchAllSignals = async (): Promise<SignalDataType[]> => {
  let allSignals: SignalDataType[] = [];
  let currentPage = 1;
  let totalPages = 1;

  // Fetch all pages of signals
  while (currentPage <= totalPages) {
    const response = await searchSignals({
      statuses: ['Approved'],
      per_page: 1000,
      page: currentPage,
      order_by: 'created_at',
      direction: 'desc'
    });
    
    allSignals = [...allSignals, ...response.data];
    totalPages = response.total_pages;
    currentPage++;

    // Limit to 5000 signals as requested
    if (allSignals.length >= 5000) {
      allSignals = allSignals.slice(0, 5000);
      break;
    }
  }
  
  return allSignals;
};

const SignalAnalyticsPage: React.FC = () => {
  const { data: signalData = [], isLoading, error } = useQuery({
    queryKey: ['signalAnalytics'],
    queryFn: fetchAllSignals,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });

  if (isLoading) {
    return (
      <div className='undp-loader-container'>
        <div className='undp-loader' />
      </div>
    );
  }

  if (error) {
    return (
      <div className='main-page-container'>
        <h6 className='undp-typography' style={{ color: 'var(--dark-red)', textAlign: 'center' }}>
          Error loading signal analytics: {error instanceof Error ? error.message : 'Failed to fetch signals'}
        </h6>
      </div>
    );
  }

  return <SignalAnalyticsDashboard signalData={signalData} />;
};

export default SignalAnalyticsPage;