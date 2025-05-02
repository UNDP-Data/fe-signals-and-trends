import type { UserGroupDataType } from '../Types';
import type { SignalDataType } from '../Types';
import mockSignals from './signalsTestData';

/**
 * Extended user type with name and email
 */
export interface UserWithNameAndEmail {
  name: string;
  email: string;
}

/**
 * Extended user group type with detailed user info
 */
export interface ExtendedUserGroupDataType extends Omit<UserGroupDataType, 'users'> {
  users: UserWithNameAndEmail[];
  signals?: SignalDataType[];
}

/**
 * Mock user groups data for testing purposes
 * This can be imported in development environments to preview UI components
 * without relying on API calls
 */
export const mockUserGroups: ExtendedUserGroupDataType[] = [
  {
    id: 1,
    name: 'Research Team',
    users: [
      { name: 'John Doe', email: 'john.doe@example.com' },
      { name: 'Jane Smith', email: 'jane.smith@example.com' },
      { name: 'Robert Jones', email: 'robert.jones@example.com' },
      { name: 'Sarah Williams', email: 'sarah.williams@example.com' },
      { name: 'Michael Brown', email: 'michael.brown@example.com' },
      { name: 'Emily Davis', email: 'emily.davis@example.com' },
      { name: 'David Miller', email: 'david.miller@example.com' }
    ],
    signals: mockSignals.filter(signal => 
      signal.created_by.includes('john.doe') || 
      signal.created_by.includes('jane.smith'))
  },
  {
    id: 2,
    name: 'Policy Advisors',
    users: [
      { name: 'Jennifer Wilson', email: 'jennifer.wilson@example.com' },
      { name: 'Thomas Anderson', email: 'thomas.anderson@example.com' },
      { name: 'Patricia Taylor', email: 'patricia.taylor@example.com' },
      { name: 'James Martinez', email: 'james.martinez@example.com' }
    ],
    signals: mockSignals.filter(signal => 
      signal.created_by.includes('jennifer.wilson') || 
      signal.created_by.includes('thomas.anderson'))
  },
  {
    id: 3,
    name: 'Project Leads',
    users: [
      { name: 'Mary Johnson', email: 'mary.johnson@example.com' },
      { name: 'Richard Clark', email: 'richard.clark@example.com' },
      { name: 'Susan Rodriguez', email: 'susan.rodriguez@example.com' }
    ],
    signals: mockSignals.filter(signal => 
      signal.created_by.includes('mary.johnson') || 
      signal.created_by.includes('richard.clark'))
  },
  {
    id: 4,
    name: 'Technical Specialists',
    users: [
      { name: 'Joseph White', email: 'joseph.white@example.com' },
      { name: 'Lisa Thomas', email: 'lisa.thomas@example.com' },
      { name: 'Daniel Harris', email: 'daniel.harris@example.com' },
      { name: 'Nancy Lewis', email: 'nancy.lewis@example.com' },
      { name: 'Paul Robinson', email: 'paul.robinson@example.com' },
      { name: 'Karen Walker', email: 'karen.walker@example.com' }
    ],
    signals: mockSignals.filter(signal => 
      signal.created_by.includes('joseph.white') || 
      signal.created_by.includes('lisa.thomas'))
  },
  {
    id: 5,
    name: 'Regional Coordinators',
    users: [
      { name: 'Betty Scott', email: 'betty.scott@example.com' },
      { name: 'Mark Nelson', email: 'mark.nelson@example.com' },
      { name: 'Laura Baker', email: 'laura.baker@example.com' },
      { name: 'Steven Gonzalez', email: 'steven.gonzalez@example.com' }
    ],
    signals: mockSignals.filter(signal => 
      signal.created_by.includes('betty.scott') || 
      signal.created_by.includes('mark.nelson'))
  },
  {
    id: 6,
    name: 'Communications',
    users: [
      { name: 'Edward Carter', email: 'edward.carter@example.com' },
      { name: 'Linda Mitchell', email: 'linda.mitchell@example.com' },
      { name: 'Jason Perez', email: 'jason.perez@example.com' }
    ],
    signals: mockSignals.filter(signal => 
      signal.created_by.includes('edward.carter') || 
      signal.created_by.includes('linda.mitchell'))
  },
  {
    id: 7,
    name: 'Advisors',
    users: [
      { name: 'Helen Roberts', email: 'helen.roberts@example.com' },
      { name: 'Frank Turner', email: 'frank.turner@example.com' },
      { name: 'Carol Phillips', email: 'carol.phillips@example.com' },
      { name: 'Kevin Campbell', email: 'kevin.campbell@example.com' },
      { name: 'Amanda Evans', email: 'amanda.evans@example.com' }
    ],
    signals: mockSignals.filter(signal => 
      signal.created_by.includes('helen.roberts') || 
      signal.created_by.includes('frank.turner'))
  }
];

/**
 * Convert ExtendedUserGroupDataType to UserGroupDataType for compatibility with existing code
 */
export const convertToStandardFormat = (groups: ExtendedUserGroupDataType[]): UserGroupDataType[] => {
  return groups.map(group => ({
    id: group.id,
    name: group.name,
    users: group.users.map(user => user.email)
  }));
};

/**
 * Get standard format user groups for compatibility with existing code
 */
export const getStandardUserGroups = (): UserGroupDataType[] => {
  return convertToStandardFormat(mockUserGroups);
};

/**
 * Function to get a subset of mock user groups for testing
 * @param count Number of user groups to return
 * @returns Array of user groups limited to the specified count
 */
export const getMockUserGroups = (count?: number): ExtendedUserGroupDataType[] => {
  if (count === undefined || count >= mockUserGroups.length) {
    return [...mockUserGroups];
  }
  return mockUserGroups.slice(0, count);
};

/**
 * Function to get a single user group by ID
 * @param id ID of the user group to retrieve
 * @returns User group with the specified ID or undefined if not found
 */
export const getMockUserGroupById = (id: number): ExtendedUserGroupDataType | undefined => {
  return mockUserGroups.find(group => group.id === id);
};

export default mockUserGroups; 