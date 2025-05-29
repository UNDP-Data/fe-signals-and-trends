import { SignalDataType } from '../../Types';

export interface ChartDataType {
  unitData: Array<{ name: string; value: number; percentage: string }>;
  statusData: Array<{ name: string; value: number }>;
  steepData: Array<{ name: string; value: number }>;
  signatureData: Array<{ name: string; value: number }>;
  sdgData: Array<{ name: string; value: number }>;
  timelineData: Array<{ month: string; count: number }>;
  yearlyData: Array<{ year: number; count: number }>;
  topKeywords: Array<{ keyword: string; count: number }>;
  locationData: Array<{ name: string; value: number }>;
  scoreTimeline: Array<{ month: string; [key: string]: any }>;
  networkData: Array<{ id: number; headline: string; connections: number; unit: string }>;
  dayOfWeekData: Array<{ day: string; count: number }>;
}

export interface ComprehensiveStatsType {
  totalSignals: number;
  activeUnits: number;
  uniqueContributors: number;
  signalsWithTrends: number;
  avgKeywordsPerSignal: string;
  scoreDistribution: Record<string, number>;
  createdForDistribution: Record<string, number>;
}

export const COLORS = [
  '#A5D7E8', '#D0BFFF', '#FFB6C1', '#AEDEFC', '#BDCDD6', '#EEE0C9', '#ADC4CE', '#CDF5FD',
  '#F9E2AF', '#C5DFF8', '#9BB8CD', '#FFE3BB', '#D4E2D4', '#E9D4E9'
];

export const STATUS_COLORS = {
  'New': '#A5D7E8',
  'Approved': '#B5E4D1',
  'Draft': '#BDCDD6',
  'Archived': '#E0E0E0',
  'Created': '#FFE3BB',
  'Deleted': '#FFB6C1'
};

export const SCORE_COLORS = {
  '1': '#FFB6C1',
  '2': '#FFCF96',
  '3': '#FFF3B2',
  '4': '#B5E4D1',
  '5': '#A5D7E8'
};