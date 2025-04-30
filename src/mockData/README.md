# Mock Data for Testing

This directory contains mock data that can be used during development and testing to simulate API responses.

## Available Mock Data

- `userGroupsTestData.ts` - Sample user group data
- `signalsTestData.ts` - Sample signals data that corresponds to user groups
- `exampleUsage.ts` - Examples of how to use the mock data files together

## How to Use Mock Data

### In Components

You can import the mock data directly into your components for testing:

```tsx
import { mockUserGroups } from '../mockData/userGroupsTestData';
import { mockSignals, getSignalsByGroupId } from '../mockData/signalsTestData';

// Then use it in your component
const MyComponent = () => {
  // Instead of fetching from API, use mock data
  const [userGroups, setUserGroups] = useState(mockUserGroups);
  const [selectedGroupId, setSelectedGroupId] = useState(1);
  
  // Get signals for the selected group
  const groupSignals = getSignalsByGroupId(selectedGroupId);
  
  return (
    // Your component JSX
  );
};
```

### For Unit Tests

In your test files, you can import the mock data:

```tsx
import { mockUserGroups, getMockUserGroups } from '../mockData/userGroupsTestData';
import { mockSignals, getSignalsByStatus } from '../mockData/signalsTestData';
import { render, screen } from '@testing-library/react';
import { UserGroupsList } from '../Components/UserGroups/UserGroupsList';

describe('UserGroupsList', () => {
  test('renders user groups correctly', () => {
    // Get a subset of groups for testing
    const testGroups = getMockUserGroups(3);
    
    render(<UserGroupsList userGroups={testGroups} />);
    
    // Your assertions
    expect(screen.getByText('Research Team')).toBeInTheDocument();
    // etc.
  });
  
  test('renders signals for a group', () => {
    const draftSignals = getSignalsByStatus('Draft');
    
    // Test component that displays signals
    render(<SignalsList signals={draftSignals} />);
    
    // Assertions
  });
});
```

### For Development Testing

In your development environment, you can modify the context provider to use mock data temporarily:

```tsx
// In a context provider component
import { mockUserGroups } from './mockData/userGroupsTestData';
import { mockSignals } from './mockData/signalsTestData';

// Use this flag to switch between API and mock data
const USE_MOCK_DATA = true;

const fetchUserGroups = async () => {
  if (USE_MOCK_DATA) {
    return mockUserGroups;
  } else {
    // Real API call
    return await listUserGroups();
  }
};

const fetchSignals = async (filters) => {
  if (USE_MOCK_DATA) {
    // Use the example helper functions to filter mock data
    return getFilteredSignals(filters);
  } else {
    // Real API call
    return await searchSignals(filters);
  }
};
```

### Example Usage

For detailed examples, check `exampleUsage.ts` which demonstrates:
- Getting dashboard data for a specific user group
- Filtering signals by various criteria
- Accessing signals created by members of a group

## Helper Functions

### User Groups

- `getMockUserGroups(count?)` - Get a subset of user groups
- `getMockUserGroupById(id)` - Find a specific user group by ID

### Signals

- `getMockSignals(count?)` - Get a subset of signals
- `getSignalsByGroupId(groupId)` - Get signals created by users in a specific group
- `getSignalsByStatus(status)` - Get signals with a specific status
- `getMockSignalById(id)` - Find a specific signal by ID 