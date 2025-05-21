import { formatSignalData, isSignalValid } from '../FormatSignalData';
import { NewSignalDataType } from '../../Types';

describe('FormatSignalData', () => {
  // Test data
  const signalData: NewSignalDataType = {
    id: 123,
    headline: 'Test headline',
    description: 'Test description longer than 30 characters to be valid',
    steep_primary: 'Social',
    steep_secondary: ['Environmental'],
    signature_primary: 'Poverty',
    signature_secondary: ['Governance'],
    sdgs: ['1'],
    created_unit: 'Test Unit',
    url: 'https://example.com',
    relevance: 'Test relevance',
    location: 'USA',
    secondary_location: ['UK'],
    created_by: 'Test User',
    created_for: 'Test Purpose',
    score: '5',
    status: 'Draft',
    keywords: ['existing_keyword']
  };

  const keywords = ['keyword1', 'keyword2', undefined];
  const selectedTrends = [1, 2, 3];
  const selectedUserGroups = [10, 20];

  const mockChoices = {
    steep: ['Social – Social', 'Environmental – Environmental'],
    goal: ['GOAL 1 – No Poverty', 'GOAL 2 – Zero Hunger']
  };

  test('formats signal data with submit option', () => {
    const result = formatSignalData(
      signalData,
      keywords,
      mockChoices,
      selectedTrends,
      selectedUserGroups,
      { isSubmit: true }
    );

    expect(result.headline).toBe('Test headline');
    expect(result.steep_primary).toBe('Social – Social');
    expect(result.sdgs).toEqual(['GOAL 1 – No Poverty']);
    expect(result.keywords).toEqual(['keyword1', 'keyword2']);
    expect(result.status).toBe('New');
    expect(result.private).toBeUndefined();
  });

  test('formats signal data with draft option', () => {
    const result = formatSignalData(
      {} as NewSignalDataType,
      keywords,
      mockChoices,
      selectedTrends,
      selectedUserGroups,
      { isDraft: true }
    );

    expect(result.headline).toBe(null);
    expect(result.description).toBe(null);
    expect(result.status).toBe('Draft');
  });

  test('formats signal data with addToSprint option', () => {
    const result = formatSignalData(
      signalData,
      keywords,
      mockChoices,
      selectedTrends,
      selectedUserGroups,
      { isAddToSprint: true }
    );

    expect(result.private).toBe(true);
    expect(result.status).toBe(null);
  });

  test('formats signal data without choices', () => {
    const result = formatSignalData(
      signalData,
      keywords,
      undefined,
      selectedTrends,
      selectedUserGroups,
      { isSubmit: true }
    );

    expect(result.steep_primary).toBe('Social');
    expect(result.sdgs).toEqual(['1']);
  });
});

describe('isSignalValid', () => {
  test('returns true for valid signal', () => {
    const validSignal: NewSignalDataType = {
      headline: 'Test headline',
      description: 'Test description longer than 30 characters to be valid',
      steep_primary: 'Social',
      signature_primary: 'Poverty',
      sdgs: ['1'],
      created_unit: 'Test Unit',
      url: 'https://example.com',
      relevance: 'Test relevance',
      location: 'USA',
      status: 'New',
      keywords: ['keyword1']
    };

    const keywords: (string | undefined)[] = ['keyword1', undefined, undefined];

    expect(isSignalValid(validSignal, keywords)).toBe(true);
  });

  test('returns false for invalid signal - missing fields', () => {
    const invalidSignal = {
      headline: 'Test headline',
      description: 'Test description longer than 30 characters to be valid',
      status: 'New',
      keywords: ['keyword1']
      // missing other required fields
    } as NewSignalDataType;

    const keywords: (string | undefined)[] = ['keyword1', undefined, undefined];

    expect(isSignalValid(invalidSignal, keywords)).toBe(false);
  });

  test('returns false for invalid signal - short description', () => {
    const invalidSignal: NewSignalDataType = {
      headline: 'Test headline',
      description: 'Too short',
      steep_primary: 'Social',
      signature_primary: 'Poverty',
      sdgs: ['1'],
      created_unit: 'Test Unit',
      url: 'https://example.com',
      relevance: 'Test relevance',
      location: 'USA',
      status: 'New',
      keywords: ['keyword1']
    };

    const keywords: (string | undefined)[] = ['keyword1', undefined, undefined];

    expect(isSignalValid(invalidSignal, keywords)).toBe(false);
  });

  test('returns false for invalid signal - no keywords', () => {
    const invalidSignal: NewSignalDataType = {
      headline: 'Test headline',
      description: 'Test description longer than 30 characters to be valid',
      steep_primary: 'Social',
      signature_primary: 'Poverty',
      sdgs: ['1'],
      created_unit: 'Test Unit',
      url: 'https://example.com',
      relevance: 'Test relevance',
      location: 'USA',
      status: 'New',
      keywords: []
    };

    const keywords: (string | undefined)[] = [undefined, undefined, undefined];

    expect(isSignalValid(invalidSignal, keywords)).toBe(false);
  });
});