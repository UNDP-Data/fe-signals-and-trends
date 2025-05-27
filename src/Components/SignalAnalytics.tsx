import React, { useMemo, useState } from 'react';
import { SignalDataType } from '../Types';
import GeographicDistribution from './SignalAnalytics/GeographicDistribution';
import MonthlyTimeline from './SignalAnalytics/MonthlyTimeline';
import StatusDistribution from './SignalAnalytics/StatusDistribution';
import SummaryStatsCards from './SignalAnalytics/SummaryStatsCards';
import UnitDistribution from './SignalAnalytics/UnitDistribution';
import { ChartDataType, ComprehensiveStatsType } from './SignalAnalytics/types';


interface SignalAnalyticsDashboardProps {
  signalData: SignalDataType[];
}

const SignalAnalyticsDashboard: React.FC<SignalAnalyticsDashboardProps> = ({ signalData }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const [activeTab, setActiveTab] = useState<'source' | 'theme' | 'content'>('source');

  // Filter data based on current filters
  const filteredData = useMemo(() => {
    return signalData.filter(signal => {
      const keywordsText = (signal.keywords && Array.isArray(signal.keywords)) ? signal.keywords.join(' ') : '';
      const matchesSearch = signal.headline.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           keywordsText.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           signal.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || signal.status === statusFilter;
      const matchesLocation = locationFilter === 'all' || signal.location === locationFilter;
      
      let matchesDate = true;
      if (dateRange !== 'all') {
        const signalDate = new Date(signal.created_at);
        const now = new Date();
        const daysAgo = Number.parseInt(dateRange);
        const cutoffDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
        matchesDate = signalDate >= cutoffDate;
      }
      
      return matchesSearch && matchesStatus && matchesLocation && matchesDate;
    });
  }, [signalData, searchTerm, statusFilter, locationFilter, dateRange]);

  // Calculate comprehensive statistics
  const comprehensiveStats: ComprehensiveStatsType = useMemo(() => {
    const totalSignals = filteredData.length;
    const activeUnits = new Set(filteredData.map(s => s.created_unit)).size;
    const uniqueContributors = new Set(filteredData.map(s => s.created_by)).size;
    const signalsWithTrends = filteredData.filter(s => s.connected_trends && s.connected_trends.length > 0).length;
    const avgKeywordsPerSignal = totalSignals > 0 ? (filteredData.reduce((sum, s) => sum + (s.keywords?.length || 0), 0) / totalSignals).toFixed(1) : '0';
    
    // Score distribution
    const scoreDistribution = filteredData.reduce((acc, signal) => {
      const score = signal.score || 'No score';
      acc[score] = (acc[score] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Created for distribution
    const createdForDistribution = filteredData.reduce((acc, signal) => {
      const purpose = signal.created_for || 'Not specified';
      acc[purpose] = (acc[purpose] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return { 
      totalSignals, 
      activeUnits, 
      uniqueContributors, 
      signalsWithTrends,
      avgKeywordsPerSignal,
      scoreDistribution,
      createdForDistribution
    };
  }, [filteredData]);

  // Prepare data for visualizations
  const chartData: ChartDataType = useMemo(() => {
    // Unit distribution with more detail
    const unitCounts = filteredData.reduce((acc, signal) => {
      acc[signal.created_unit] = (acc[signal.created_unit] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const unitData = Object.entries(unitCounts)
      .map(([unit, count]) => ({
        name: unit,
        value: count,
        percentage: ((count / filteredData.length) * 100).toFixed(1)
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 15);

    // Status distribution
    const statusCounts = filteredData.reduce((acc, signal) => {
      acc[signal.status] = (acc[signal.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const statusData = Object.entries(statusCounts).map(([status, count]) => ({
      name: status,
      value: count
    }));

    // STEEP category distribution
    const steepCounts = filteredData.reduce((acc, signal) => {
      const primary = signal.steep_primary?.split('–')[0].trim() || 'Unknown';
      acc[primary] = (acc[primary] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const steepData = Object.entries(steepCounts).map(([category, count]) => ({
      name: category,
      value: count
    }));

    // Signature solution distribution
    const signatureCounts = filteredData.reduce((acc, signal) => {
      if (signal.signature_primary) {
        acc[signal.signature_primary] = (acc[signal.signature_primary] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const signatureData = Object.entries(signatureCounts)
      .map(([signature, count]) => ({
        name: signature,
        value: count
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);

    // SDGs distribution
    const sdgCounts: Record<string, number> = {};
    filteredData.forEach(signal => {
      if (signal.sdgs && Array.isArray(signal.sdgs)) {
        signal.sdgs.forEach(sdg => {
          const sdgNumber = sdg.match(/GOAL (\d+)/)?.[1];
          if (sdgNumber) {
            const key = `SDG ${sdgNumber}`;
            sdgCounts[key] = (sdgCounts[key] || 0) + 1;
          }
        });
      }
    });

    const sdgData = Object.entries(sdgCounts)
      .map(([sdg, count]) => ({
        name: sdg,
        value: count
      }))
      .sort((a, b) => {
        const aNum = Number.parseInt(a.name.replace('SDG ', ''));
        const bNum = Number.parseInt(b.name.replace('SDG ', ''));
        return aNum - bNum;
      });

    // Timeline data - monthly and yearly
    const monthCounts = filteredData.reduce((acc, signal) => {
      const date = new Date(signal.created_at);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      acc[monthKey] = (acc[monthKey] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const timelineData = Object.entries(monthCounts)
      .map(([month, count]) => ({ month, count }))
      .sort((a, b) => a.month.localeCompare(b.month));

    // Yearly trend
    const yearCounts = filteredData.reduce((acc, signal) => {
      const year = new Date(signal.created_at).getFullYear();
      acc[year] = (acc[year] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    const yearlyData = Object.entries(yearCounts)
      .map(([year, count]) => ({ year: Number.parseInt(year), count }))
      .sort((a, b) => a.year - b.year);

    // Keywords frequency with better categorization
    const keywordCounts: Record<string, number> = {};
    filteredData.forEach(signal => {
      if (signal.keywords && Array.isArray(signal.keywords)) {
        signal.keywords.forEach(keyword => {
          const normalizedKeyword = keyword.trim().toLowerCase();
          keywordCounts[normalizedKeyword] = (keywordCounts[normalizedKeyword] || 0) + 1;
        });
      }
    });

    const topKeywords = Object.entries(keywordCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 30)
      .map(([keyword, count]) => ({ keyword, count }));

    // Location analysis - regional grouping
    const locationCounts = filteredData.reduce((acc, signal) => {
      const location = signal.location || 'Unknown';
      acc[location] = (acc[location] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const locationData = Object.entries(locationCounts)
      .map(([location, count]) => ({
        name: location,
        value: count
      }))
      .sort((a, b) => b.value - a.value);

    // Score distribution over time
    const scoreTimeline = timelineData.map(({ month }) => {
      const monthSignals = filteredData.filter(s => {
        const signalMonth = new Date(s.created_at).toISOString().slice(0, 7);
        return signalMonth === month;
      });
      
      const scoreBreakdown = monthSignals.reduce((acc, signal) => {
        const score = signal.score || 'No score';
        acc[score] = (acc[score] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return {
        month,
        ...scoreBreakdown
      };
    });

    // Network analysis - connections between signals and trends
    const networkData = filteredData
      .filter(s => s.connected_trends && s.connected_trends.length > 0)
      .map(s => ({
        id: s.id,
        headline: s.headline,
        connections: s.connected_trends.length,
        unit: s.created_unit
      }))
      .sort((a, b) => b.connections - a.connections)
      .slice(0, 20);

    // Day of week analysis
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayCounts = filteredData.reduce((acc, signal) => {
      const day = new Date(signal.created_at).getDay();
      acc[day] = (acc[day] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);
    
    const dayOfWeekData = dayNames.map((name, index) => ({
      day: name,
      count: dayCounts[index] || 0
    }));

    return { 
      unitData, 
      statusData, 
      steepData, 
      signatureData,
      sdgData,
      timelineData, 
      yearlyData,
      topKeywords, 
      locationData,
      scoreTimeline,
      networkData,
      dayOfWeekData
    };
  }, [filteredData]);

  // Get unique values for filters
  const filterOptions = useMemo(() => {
    const locations = Array.from(new Set(signalData.map(s => s.location))).sort();
    const statuses = Array.from(new Set(signalData.map(s => s.status))).sort();
    
    return { locations, statuses };
  }, [signalData]);

  return (
    <div className="signal-analytics-dashboard" style={{ padding: '1rem' }}>
      {/* Header with summary stats */}
      <div className="margin-bottom-09">
        <h2 className="undp-typography">Signal Analytics Dashboard</h2>
        <p className="undp-typography">
          Analyzing {comprehensiveStats.totalSignals.toLocaleString()} signals from {comprehensiveStats.activeUnits} units 
          by {comprehensiveStats.uniqueContributors} contributors
        </p>
      </div>

      {/* Summary Stats Cards */}
      <SummaryStatsCards stats={comprehensiveStats} />

      {/* Filters */}
      {/* <SignalAnalyticsFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        locationFilter={locationFilter}
        setLocationFilter={setLocationFilter}
        dateRange={dateRange}
        setDateRange={setDateRange}
        filterOptions={filterOptions}
        filteredCount={filteredData.length}
      /> */}

      {/* Tab Navigation */}
      {/* <div className="margin-top-07 margin-bottom-07">
        <div className="flex-div gap-05">
          <button 
            className={`undp-button button-tertiary ${activeTab === 'source' ? 'button-arrow' : ''}`}
            onClick={() => setActiveTab('source')}
            style={{
              backgroundColor: activeTab === 'source' ? '#B5D5F5' : 'transparent',
              color: activeTab === 'source' ? '#005687' : '#232E3D',
              border: activeTab === 'source' ? 'none' : '1px solid #D4D6D8',
              fontWeight: activeTab === 'source' ? 600 : 400
            }}
          >
            Source Distribution
          </button>
          <button 
            className={`undp-button button-tertiary ${activeTab === 'theme' ? 'button-arrow' : ''}`}
            onClick={() => setActiveTab('theme')}
            style={{
              backgroundColor: activeTab === 'theme' ? '#B5D5F5' : 'transparent',
              color: activeTab === 'theme' ? '#005687' : '#232E3D',
              border: activeTab === 'theme' ? 'none' : '1px solid #D4D6D8',
              fontWeight: activeTab === 'theme' ? 600 : 400
            }}
          >
            Theme Relationships
          </button>
          <button 
            className={`undp-button button-tertiary ${activeTab === 'content' ? 'button-arrow' : ''}`}
            onClick={() => setActiveTab('content')}
            style={{
              backgroundColor: activeTab === 'content' ? '#B5D5F5' : 'transparent',
              color: activeTab === 'content' ? '#005687' : '#232E3D',
              border: activeTab === 'content' ? 'none' : '1px solid #D4D6D8',
              fontWeight: activeTab === 'content' ? 600 : 400
            }}
          >
            Content Analysis
          </button>
        </div>
      </div> */}

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'source' && (
          <div className="flex-div flex-wrap" style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '1rem',
            width: '100%'
          }}>
            <UnitDistribution unitData={chartData.unitData} />
            <StatusDistribution statusData={chartData.statusData} />
            <GeographicDistribution locationData={chartData.locationData} totalSignals={filteredData.length} />
            <MonthlyTimeline timelineData={chartData.timelineData} />
            {/* <DayOfWeek dayOfWeekData={chartData.dayOfWeekData} /> */}
          </div>
        )}
        
        {/* {activeTab === 'theme' && (
          <div className="grid-col-3 gap-07">
            <STEEPCategories steepData={chartData.steepData} />
            <SignatureSolutions signatureData={chartData.signatureData} />
            <SDGsCoverage sdgData={chartData.sdgData} />
            <ScoreDistribution scoreDistribution={comprehensiveStats.scoreDistribution} />
            <SignalPurpose createdForDistribution={comprehensiveStats.createdForDistribution} />
            <MostConnectedSignals networkData={chartData.networkData} />
          </div>
        )}
        
        {activeTab === 'content' && (
          <div className="grid-col-3 gap-07">
            <TopKeywords topKeywords={chartData.topKeywords} />
            <ScoreEvolution scoreTimeline={chartData.scoreTimeline} />
            <RecentHighImpactSignals signals={filteredData} />
            <div className="undp-viz-container">
              <h3 className="undp-typography margin-bottom-03">Additional Content Analysis</h3>
              <p className="undp-typography" style={{ fontStyle: 'italic', color: '#A9B1B7' }}>
                Additional visualization can be added here
              </p>
            </div>
          </div>
        )} */}
      </div>
    </div>
  );
};

export default SignalAnalyticsDashboard;