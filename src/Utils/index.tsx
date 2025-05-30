// Export all utility functions from this index file
export * from './AuthStatusHandler';
export * from './ExtractKeyWords';
export * from './FetchNewsItems';
export * from './GetSDGIcons';
export * from './UpdateLocalStrage';
export * from './FormatSignalData';

export const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};