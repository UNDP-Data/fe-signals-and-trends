import type { SignalDataType } from '../Types';
import { mockUserGroups } from './userGroupsTestData';

/**
 * Mock signals data for testing purposes
 * This provides 2 signals for each user group in the mock data
 */
export const mockSignals: SignalDataType[] = [
  // Signals for Research Team (Group ID: 1)
  {
    id: 101,
    status: 'Draft',
    created_at: '2023-10-15T09:23:45Z',
    created_by: 'john.doe@example.com',
    headline: 'Emerging AI Models Show Human-Like Reasoning Capabilities',
    description: 'Recent research demonstrates that advanced AI models are developing reasoning abilities that were previously thought to be exclusive to humans.',
    steep_primary: 'Technological',
    steep_secondary: ['Social', 'Economic'],
    signature_primary: 'Digitalization',
    signature_secondary: ['Poverty and Inequality'],
    sdgs: ['SDG 9', 'SDG 8'],
    created_unit: 'Research Team',
    url: 'https://example.com/ai-reasoning-capabilities',
    relevance: 'High',
    keywords: ['artificial intelligence', 'machine learning', 'reasoning', 'cognitive science'],
    location: 'Global',
    secondary_location: ['North America', 'Europe'],
    score: '0.85',
    connected_trends: [201, 203],
    favorite: true
  },
  {
    id: 102,
    status: 'Approved',
    created_at: '2023-11-02T14:32:18Z',
    created_by: 'jane.smith@example.com',
    headline: 'Climate-Resilient Agriculture Technologies Gain Traction',
    description: 'New agricultural technologies designed to withstand extreme weather conditions are being rapidly adopted in regions most affected by climate change.',
    steep_primary: 'Environmental',
    steep_secondary: ['Technological', 'Economic'],
    signature_primary: 'Environment',
    signature_secondary: ['Poverty and Inequality', 'Resilience'],
    sdgs: ['SDG 2', 'SDG 13', 'SDG 15'],
    created_unit: 'Research Team',
    url: 'https://example.com/climate-resilient-agriculture',
    relevance: 'High',
    keywords: ['agriculture', 'climate change', 'resilience', 'food security'],
    location: 'Africa',
    secondary_location: ['Asia', 'South America'],
    score: '0.79',
    connected_trends: [205, 208],
    created_for: 'Regional Analysis'
  },

  // Signals for Policy Advisors (Group ID: 2)
  {
    id: 103,
    status: 'Draft',
    created_at: '2023-09-28T11:45:22Z',
    created_by: 'jennifer.wilson@example.com',
    headline: 'Digital Identity Systems Reshaping Government Services',
    description: 'Countries implementing national digital identity systems are reporting significant improvements in service delivery efficiency and reduction in fraud.',
    steep_primary: 'Political',
    steep_secondary: ['Technological', 'Social'],
    signature_primary: 'Governance',
    signature_secondary: ['Digitalization'],
    sdgs: ['SDG 16', 'SDG 9'],
    created_unit: 'Policy Advisors',
    url: 'https://example.com/digital-identity-systems',
    relevance: 'Medium',
    keywords: ['digital identity', 'e-government', 'public services', 'identification'],
    location: 'Asia',
    secondary_location: ['Africa'],
    score: '0.72',
    connected_trends: [202, 209]
  },
  {
    id: 104,
    status: 'New',
    created_at: '2023-12-05T08:15:33Z',
    created_by: 'thomas.anderson@example.com',
    headline: 'Urban Micro-Mobility Solutions Reduce Emissions',
    description: 'Cities implementing shared micro-mobility solutions are experiencing measurable reductions in carbon emissions and traffic congestion.',
    steep_primary: 'Environmental',
    steep_secondary: ['Technological', 'Social'],
    signature_primary: 'Environment',
    signature_secondary: ['Energy'],
    sdgs: ['SDG 11', 'SDG 13'],
    created_unit: 'Policy Advisors',
    url: 'https://example.com/urban-micro-mobility',
    relevance: 'High',
    keywords: ['micro-mobility', 'urban planning', 'transportation', 'emissions'],
    location: 'Europe',
    secondary_location: ['North America'],
    score: '0.81',
    connected_trends: [204, 207]
  },

  // Signals for Project Leads (Group ID: 3)
  {
    id: 105,
    status: 'Approved',
    created_at: '2023-08-17T16:20:55Z',
    created_by: 'mary.johnson@example.com',
    headline: 'Blockchain-Based Supply Chain Transparency Solutions',
    description: 'New blockchain applications are enabling unprecedented levels of transparency in global supply chains, reducing fraud and improving sustainability compliance.',
    steep_primary: 'Technological',
    steep_secondary: ['Economic', 'Environmental'],
    signature_primary: 'Digitalization',
    signature_secondary: ['Governance'],
    sdgs: ['SDG 12', 'SDG 9'],
    created_unit: 'Project Leads',
    url: 'https://example.com/blockchain-supply-chain',
    relevance: 'Medium',
    keywords: ['blockchain', 'supply chain', 'transparency', 'sustainability'],
    location: 'Global',
    secondary_location: ['Asia', 'Europe'],
    score: '0.68',
    connected_trends: [201, 206]
  },
  {
    id: 106,
    status: 'Draft',
    created_at: '2023-10-23T13:47:29Z',
    created_by: 'richard.clark@example.com',
    headline: 'Peer-to-Peer Energy Trading Networks Emerge',
    description: 'Community-based peer-to-peer energy trading platforms are gaining popularity, enabling households to buy and sell excess renewable energy directly.',
    steep_primary: 'Technological',
    steep_secondary: ['Economic', 'Environmental'],
    signature_primary: 'Energy',
    signature_secondary: ['Digitalization', 'Environment'],
    sdgs: ['SDG 7', 'SDG 11', 'SDG 13'],
    created_unit: 'Project Leads',
    url: 'https://example.com/p2p-energy-trading',
    relevance: 'High',
    keywords: ['energy', 'peer-to-peer', 'renewable', 'decentralization'],
    location: 'Europe',
    secondary_location: ['North America', 'Australia'],
    score: '0.75',
    connected_trends: [203, 205]
  },

  // Signals for Technical Specialists (Group ID: 4)
  {
    id: 107,
    status: 'New',
    created_at: '2023-11-18T09:12:37Z',
    created_by: 'joseph.white@example.com',
    headline: 'Synthetic Biology Breakthroughs for Carbon Capture',
    description: 'Novel synthetic biology approaches are showing promise for efficient carbon capture at industrial scale, potentially offering new pathways for climate change mitigation.',
    steep_primary: 'Technological',
    steep_secondary: ['Environmental', 'Economic'],
    signature_primary: 'Environment',
    signature_secondary: ['Energy'],
    sdgs: ['SDG 13', 'SDG 9', 'SDG 14'],
    created_unit: 'Technical Specialists',
    url: 'https://example.com/synthetic-biology-carbon-capture',
    relevance: 'High',
    keywords: ['synthetic biology', 'carbon capture', 'climate change', 'biotechnology'],
    location: 'North America',
    secondary_location: ['Europe'],
    score: '0.83',
    connected_trends: [202, 208]
  },
  {
    id: 108,
    status: 'Draft',
    created_at: '2023-09-05T15:40:19Z',
    created_by: 'lisa.thomas@example.com',
    headline: 'Quantum Computing Solutions for Drug Discovery',
    description: 'Pharmaceutical companies are beginning to use quantum computing to accelerate drug discovery, potentially reducing development timelines by years.',
    steep_primary: 'Technological',
    steep_secondary: ['Social', 'Economic'],
    signature_primary: 'Digitalization',
    signature_secondary: ['Health'],
    sdgs: ['SDG 3', 'SDG 9'],
    created_unit: 'Technical Specialists',
    url: 'https://example.com/quantum-computing-drug-discovery',
    relevance: 'Medium',
    keywords: ['quantum computing', 'drug discovery', 'pharmaceuticals', 'healthcare'],
    location: 'Global',
    secondary_location: ['North America', 'Europe', 'Asia'],
    score: '0.77',
    connected_trends: [201, 204]
  },

  // Signals for Regional Coordinators (Group ID: 5)
  {
    id: 109,
    status: 'Approved',
    created_at: '2023-07-29T10:25:43Z',
    created_by: 'betty.scott@example.com',
    headline: 'Indigenous Knowledge Systems Integrated into Climate Adaptation',
    description: 'Regional climate adaptation strategies are increasingly incorporating indigenous knowledge systems, leading to more effective and culturally appropriate responses.',
    steep_primary: 'Social',
    steep_secondary: ['Environmental', 'Cultural'],
    signature_primary: 'Environment',
    signature_secondary: ['Resilience', 'Governance'],
    sdgs: ['SDG 13', 'SDG 15', 'SDG 10'],
    created_unit: 'Regional Coordinators',
    url: 'https://example.com/indigenous-knowledge-climate',
    relevance: 'High',
    keywords: ['indigenous knowledge', 'climate adaptation', 'traditional practices', 'cultural heritage'],
    location: 'South America',
    secondary_location: ['Oceania', 'North America'],
    score: '0.84',
    connected_trends: [203, 206],
    created_for: 'Regional Analysis'
  },
  {
    id: 110,
    status: 'Draft',
    created_at: '2023-10-12T14:38:27Z',
    created_by: 'mark.nelson@example.com',
    headline: 'Cross-Border Water Management Cooperation Frameworks',
    description: 'New cooperative frameworks for transboundary water resource management are emerging in regions facing water scarcity, reducing potential for conflict.',
    steep_primary: 'Political',
    steep_secondary: ['Environmental', 'Social'],
    signature_primary: 'Governance',
    signature_secondary: ['Resilience', 'Environment'],
    sdgs: ['SDG 6', 'SDG 16', 'SDG 17'],
    created_unit: 'Regional Coordinators',
    url: 'https://example.com/transboundary-water-management',
    relevance: 'High',
    keywords: ['water management', 'transboundary cooperation', 'conflict prevention', 'resource sharing'],
    location: 'Africa',
    secondary_location: ['Middle East', 'Asia'],
    score: '0.71',
    connected_trends: [205, 209]
  },

  // Signals for Communications (Group ID: 6)
  {
    id: 111,
    status: 'New',
    created_at: '2023-11-30T11:20:15Z',
    created_by: 'edward.carter@example.com',
    headline: 'Virtual Reality for Public Engagement in Urban Planning',
    description: 'Cities are using virtual reality to engage citizens in urban planning, resulting in higher participation rates and more inclusive design outcomes.',
    steep_primary: 'Technological',
    steep_secondary: ['Social', 'Political'],
    signature_primary: 'Digitalization',
    signature_secondary: ['Governance'],
    sdgs: ['SDG 11', 'SDG 16'],
    created_unit: 'Communications',
    url: 'https://example.com/vr-urban-planning',
    relevance: 'Medium',
    keywords: ['virtual reality', 'urban planning', 'citizen engagement', 'public participation'],
    location: 'Europe',
    secondary_location: ['North America', 'Asia'],
    score: '0.69',
    connected_trends: [202, 207]
  },
  {
    id: 112,
    status: 'Draft',
    created_at: '2023-09-14T08:55:39Z',
    created_by: 'linda.mitchell@example.com',
    headline: 'Digital Misinformation Detection Using AI',
    description: 'Advanced AI tools for detecting and countering digital misinformation are being deployed by fact-checking organizations and media platforms.',
    steep_primary: 'Technological',
    steep_secondary: ['Social', 'Political'],
    signature_primary: 'Digitalization',
    signature_secondary: ['Governance'],
    sdgs: ['SDG 16', 'SDG 4'],
    created_unit: 'Communications',
    url: 'https://example.com/ai-misinformation-detection',
    relevance: 'High',
    keywords: ['misinformation', 'artificial intelligence', 'fact-checking', 'digital media'],
    location: 'Global',
    secondary_location: [],
    score: '0.82',
    connected_trends: [201, 204]
  },

  // Signals for Advisors (Group ID: 7)
  {
    id: 113,
    status: 'Approved',
    created_at: '2023-08-03T16:42:11Z',
    created_by: 'helen.roberts@example.com',
    headline: 'Regenerative Finance Models for Sustainable Development',
    description: 'New financial models based on regenerative principles are emerging, creating investment opportunities aligned with ecological restoration and community resilience.',
    steep_primary: 'Economic',
    steep_secondary: ['Environmental', 'Social'],
    signature_primary: 'Poverty and Inequality',
    signature_secondary: ['Environment', 'Resilience'],
    sdgs: ['SDG 1', 'SDG 8', 'SDG 15'],
    created_unit: 'Advisors',
    url: 'https://example.com/regenerative-finance',
    relevance: 'Medium',
    keywords: ['regenerative finance', 'sustainable investment', 'impact investing', 'ecological economics'],
    location: 'Global',
    secondary_location: ['Europe', 'North America'],
    score: '0.74',
    connected_trends: [206, 209]
  },
  {
    id: 114,
    status: 'Draft',
    created_at: '2023-10-27T09:33:47Z',
    created_by: 'frank.turner@example.com',
    headline: 'Universal Basic Income Pilots Show Promising Results',
    description: 'Initial results from universal basic income pilot programs indicate positive impacts on wellbeing, entrepreneurship, and community resilience.',
    steep_primary: 'Economic',
    steep_secondary: ['Social', 'Political'],
    signature_primary: 'Poverty and Inequality',
    signature_secondary: ['Governance', 'Resilience'],
    sdgs: ['SDG 1', 'SDG 10', 'SDG 8'],
    created_unit: 'Advisors',
    url: 'https://example.com/ubi-pilot-results',
    relevance: 'High',
    keywords: ['universal basic income', 'economic policy', 'social safety net', 'poverty reduction'],
    location: 'Europe',
    secondary_location: ['North America', 'Africa'],
    score: '0.78',
    connected_trends: [205, 208]
  }
];

/**
 * Function to get a subset of mock signals for testing
 * @param count Number of signals to return
 * @returns Array of signals limited to the specified count
 */
export const getMockSignals = (count?: number): SignalDataType[] => {
  if (count === undefined || count >= mockSignals.length) {
    return [...mockSignals];
  }
  return mockSignals.slice(0, count);
};

/**
 * Function to get signals for a specific user group
 * @param groupId The ID of the user group
 * @returns Array of signals created by members of the specified group
 */
export const getSignalsByGroupId = (groupId: number): SignalDataType[] => {
  const group = mockUserGroups.find(g => g.id === groupId);
  if (!group) return [];

  return mockSignals.filter(signal => 
    group.users.includes(signal.created_by)
  );
};

/**
 * Function to get signals by status
 * @param status The status to filter by
 * @returns Array of signals with the specified status
 */
export const getSignalsByStatus = (status: string): SignalDataType[] => {
  return mockSignals.filter(signal => signal.status === status);
};

/**
 * Function to get a single signal by ID
 * @param id ID of the signal to retrieve
 * @returns Signal with the specified ID or undefined if not found
 */
export const getMockSignalById = (id: number): SignalDataType | undefined => {
  return mockSignals.find(signal => signal.id === id);
};

export default mockSignals; 