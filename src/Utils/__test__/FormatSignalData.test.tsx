import { formatSignalData, isSignalValid } from '../FormatSignalData';

describe('FormatSignalData', () => {
  // Test data
  const signalData = {
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
    score: 5,
    status: 'Draft'
  };

  const keywords = ['keyword1', 'keyword2', undefined];
  const selectedTrends = [1, 2, 3];
  const selectedUserGroups = [10, 20];

  const mockChoices = {
    steep: ['Social – Social', 'Environmental – Environmental'],
    goal: ['GOAL 1 – No Poverty', 'GOAL 2 – Zero Hunger']
  };

  test('formats signal data with standard values', () => {
    const result = formatSignalData(
      signalData,
      keywords,
      selectedTrends,
      selectedUserGroups,
      { status: 'New' },
      mockChoices
    );

    expect(result.headline).toBe('Test headline');
    expect(result.steep_primary).toBe('Social – Social');
    expect(result.sdgs).toEqual(['GOAL 1 – No Poverty']);
    expect(result.keywords).toEqual(['keyword1', 'keyword2']);
    expect(result.status).toBe('New');
    expect(result.private).toBeUndefined();
  });

  test('formats signal data with allowNulls option', () => {
    const result = formatSignalData(
      {},
      keywords,
      selectedTrends,
      selectedUserGroups,
      { status: 'Draft', allowNulls: true },
      mockChoices
    );

    expect(result.headline).toBe(null);
    expect(result.description).toBe(null);
    expect(result.status).toBe('Draft');
  });

  test('formats signal data with private option', () => {
    const result = formatSignalData(
      signalData,
      keywords,
      selectedTrends,
      selectedUserGroups,
      { status: 'Draft', private: true },
      mockChoices
    );

    expect(result.private).toBe(true);
    expect(result.status).toBe('Draft');
  });

  test('formats signal data without choices', () => {
    const result = formatSignalData(
      signalData,
      keywords,
      selectedTrends,
      selectedUserGroups,
      { status: 'New' }
    );

    expect(result.steep_primary).toBe('Social');
    expect(result.sdgs).toEqual(['1']);
  });
});

describe('isSignalValid', () => {
  test('returns true for valid signal', () => {
    const validSignal = {
      headline: 'Test headline',
      description: 'Test description longer than 30 characters to be valid',
      steep_primary: 'Social',
      signature_primary: 'Poverty',
      sdgs: ['1'],
      created_unit: 'Test Unit',
      url: 'https://example.com',
      relevance: 'Test relevance',
      location: 'USA'
    };

    const keywords: [string | undefined, string | undefined, string | undefined] = 
      ['keyword1', undefined, undefined];

    expect(isSignalValid(validSignal, keywords)).toBe(true);
  });

  test('returns false for invalid signal - missing fields', () => {
    const invalidSignal = {
      headline: 'Test headline',
      description: 'Test description longer than 30 characters to be valid',
      // missing other required fields
    };

    const keywords: [string | undefined, string | undefined, string | undefined] = 
      ['keyword1', undefined, undefined];

    expect(isSignalValid(invalidSignal, keywords)).toBe(false);
  });

  test('returns false for invalid signal - short description', () => {
    const invalidSignal = {
      headline: 'Test headline',
      description: 'Too short',
      steep_primary: 'Social',
      signature_primary: 'Poverty',
      sdgs: ['1'],
      created_unit: 'Test Unit',
      url: 'https://example.com',
      relevance: 'Test relevance',
      location: 'USA'
    };

    const keywords: [string | undefined, string | undefined, string | undefined] = 
      ['keyword1', undefined, undefined];

    expect(isSignalValid(invalidSignal, keywords)).toBe(false);
  });

  test('returns false for invalid signal - no keywords', () => {
    const invalidSignal = {
      headline: 'Test headline',
      description: 'Test description longer than 30 characters to be valid',
      steep_primary: 'Social',
      signature_primary: 'Poverty',
      sdgs: ['1'],
      created_unit: 'Test Unit',
      url: 'https://example.com',
      relevance: 'Test relevance',
      location: 'USA'
    };

    const keywords: [string | undefined, string | undefined, string | undefined] = 
      [undefined, undefined, undefined];

    expect(isSignalValid(invalidSignal, keywords)).toBe(false);
  });
});