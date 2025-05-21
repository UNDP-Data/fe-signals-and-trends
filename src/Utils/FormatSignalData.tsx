import { NewSignalDataType, SignalDataType } from '../Types';

export interface SubmissionOptions {
  isSubmit?: boolean;
  isAddToSprint?: boolean;
  isDraft?: boolean;
}

/**
 * Format signal data for API submission
 * @param signalData - The signal data to format
 * @param keywords - Array of keywords
 * @param choices - Available choices for dropdowns
 * @param selectedTrendsList - List of selected trends
 * @param selectedUserGroups - List of selected user groups
 * @param options - Submission options (isSubmit, isAddToSprint, isDraft)
 * @returns Formatted signal data ready for API submission
 */
export const formatSignalData = (
  signalData: SignalDataType | NewSignalDataType,
  keywords: (string | undefined)[],
  choices: any,
  selectedTrendsList: number[],
  selectedUserGroups: number[],
  options: SubmissionOptions = {}
): any => {
  const { isSubmit, isAddToSprint, isDraft } = options;
  
  // Determine if values should be null for drafts or when adding to sprint
  const useNullValues = isDraft || isAddToSprint;
  
  // Format keywords - remove undefined/null values
  const formattedKeywords = keywords.filter(
    (d): d is string => d !== null && d !== undefined && d.trim() !== ''
  );
  
  // Make sure steep_primary is in the correct format
  let steep_primary = signalData.steep_primary || (useNullValues ? null : '');
  if (steep_primary && !String(steep_primary).includes(' – ') && choices?.steep) {
    const fullSteep = choices.steep.find((s: string) => s.startsWith(steep_primary as string));
    if (fullSteep) {
      steep_primary = fullSteep;
    }
  }
  
  // Make sure sdgs are in the correct format
  let sdgs = signalData.sdgs || (useNullValues ? null : []);
  if (sdgs && sdgs.length > 0 && !sdgs[0].startsWith('GOAL') && choices?.goal) {
    sdgs = sdgs.map((sdg: string) => {
      const fullSdg = choices.goal.find((g: string) => g.includes(sdg));
      return fullSdg || sdg;
    });
  }

  // Construct the base formatted data
  const formattedData: any = {
    id: signalData.id,
    headline: signalData.headline || (useNullValues ? null : ''),
    description: signalData.description || (useNullValues ? null : ''),
    attachment: signalData.attachment || (useNullValues ? null : ''),
    steep_primary,
    steep_secondary: signalData.steep_secondary || (useNullValues ? null : []),
    signature_primary: signalData.signature_primary || (useNullValues ? null : ''),
    signature_secondary: signalData.signature_secondary || (useNullValues ? null : []),
    sdgs,
    url: signalData.url || (useNullValues ? null : ''),
    relevance: signalData.relevance || (useNullValues ? null : ''),
    location: signalData.location || (useNullValues ? null : ''),
    secondary_location: signalData.secondary_location || (useNullValues ? null : []),
    created_by: signalData.created_by || (useNullValues ? null : ''),
    created_unit: signalData.created_unit || (useNullValues ? null : ''),
    created_for: signalData.created_for || (useNullValues ? null : ''),
    score: signalData.score || (useNullValues ? null : undefined),
    connected_trends: selectedTrendsList || (useNullValues ? null : []),
    user_group_ids: selectedUserGroups,
    keywords: formattedKeywords,
    status: null // Initialize with null, will be updated based on options
  };

  // Add status based on submission type
  if (isSubmit) {
    formattedData.status = 'New';
  } else if (isDraft) {
    formattedData.status = 'Draft';
  }
  // Don't set status for Add to Sprint

  // Add private flag for adding to sprint
  if (isAddToSprint) {
    formattedData.private = true;
    // Remove status when adding to sprint
    formattedData.status = null;
  }

  return formattedData;
};

/**
 * Check if signal data is valid for submission
 * @param signal - The signal data to validate
 * @param keyWords - Array of keywords
 * @returns Boolean indicating if the signal is valid
 */
export const isSignalValid = (
  signal: SignalDataType | NewSignalDataType,
  keyWords: (string | undefined)[]
): boolean => {
  return !!(
    signal.headline &&
    signal.created_unit &&
    signal.description &&
    signal.description.length > 30 &&
    keyWords.filter(d => d !== undefined && d.trim() !== '').length > 0 &&
    signal.location &&
    signal.steep_primary &&
    signal.signature_primary &&
    signal.sdgs &&
    signal.sdgs?.length > 0 &&
    signal.relevance &&
    signal.url
  );
};