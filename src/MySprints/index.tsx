import { useContext, useState, useCallback, useRef, useEffect } from 'react';
import { Pagination, Modal, Typography, Divider, Button } from 'antd';
import type { PaginationProps } from 'antd';
import sortBy from 'lodash.sortby';
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
} from '@azure/msal-react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { SignInButton } from '../Components/SignInButton';
import Context from '../Context/Context';
import { searchSignals } from '../API';
import { listUserGroups } from '../API/userCalls';
import { GenericGroupModal, UserGroupsList } from '../Components/UserGroups';
import type { UserGroupDataType, SignalDataType } from '../Types';
import { SignalCard } from '../Components/SignalCard';
import TEST_USER_GROUPS, { 
  ExtendedUserGroupDataType,
  convertToStandardFormat 
} from '../mockData/userGroupsTestData';
import styled from 'styled-components';


const CreateButton = styled.button`
  background-color: #006EB5;
  color: white;
  border: none;
  padding: 12px 20px;
  font-weight: bold;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  
  &:hover {
    background-color: #005A8F;
  }
`;

const { Title } = Typography;

// Check if test data loading is enabled via environment variable
const LOAD_TEST_DATA = import.meta.env.VITE_LOAD_TEST_DATA === 'true';

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <Title level={4} className="undp-typography margin-top-09 margin-bottom-05">
    {children}
  </Title>
);

export function MySprints() {
  const { userName, updateSignalList, updateUserGroups } = useContext(Context);
  const [paginationValue, setPaginationValue] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const navigate = useNavigate();
  
  // User Groups state
  const [groupModalVisible, setGroupModalVisible] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<UserGroupDataType | undefined>(undefined);
  const [groupsCurrentPage, setGroupsCurrentPage] = useState(1);
  const groupsPageSize = 9;
  
  // Test data loading state
  const [useTestData, setUseTestData] = useState(false);

  // Fetch user's sprints with React Query
  const sprintsQuery = useQuery({
    queryKey: ['sprints', userName, paginationValue, pageSize],
    queryFn: async (): Promise<SignalDataType[]> => {
      if (!userName) return [];
      
      try {
        const response = await searchSignals({
          page: paginationValue,
          per_page: pageSize,
          statuses: ['Draft'],
          created_by: userName,
        });
        
        return sortBy(response.data, d => Date.parse(d.created_at)).reverse();
      } catch (err) {
        if (err instanceof Error || (err && typeof err === 'object' && 'response' in err)) {
          const error = err as Error & { response?: { status?: number } };
          if (error.response?.status === 404) {
            return [];
          }
          throw new Error(
            `${error}. ${
              error.response?.status === 500
                ? 'Please try again in some time'
                : ''
            }`
          );
        }
        throw new Error('An unknown error occurred');
      }
    },
    enabled: !!userName && !useTestData
  });

  // Fetch user groups with React Query
  const userGroupsQuery = useQuery({
    queryKey: ['userGroups', userName],
    queryFn: async (): Promise<UserGroupDataType[]> => {
      if (!userName) return [];
      
      try {
        // Use the endpoint from the OpenAPI spec for user groups
        const groups = await listUserGroups();
        
        // Make sure we return a valid UserGroupDataType[] by ensuring required fields
        return groups.map(group => {
          return {
            ...group,
            // users omitted
            user_ids: group.user_ids || [],
            signal_ids: group.signal_ids || [],
            collaborator_map: group.collaborator_map || {}
          };
        }) as UserGroupDataType[];
      } catch (error) {
        console.error('Failed to fetch user groups:', error);
        return [];
      }
    },
    enabled: !!userName && !useTestData
  });

  const handleEditGroup = (group: UserGroupDataType) => {
    setSelectedGroup(group);
    setGroupModalVisible(true);
  };

  const handleViewGroup = (groupId: number) => {
    // Find the group to get its name
    const group = userGroups.find(g => g.id === groupId);
    if (group) {
      // Create a URL-friendly slug from the group name
      const slug = group.name.toLowerCase()
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-')     // Replace spaces with hyphens
        .trim();
      
      // Navigate to the sprint page with name and ID in the URL
      navigate(`/sprint/${slug}-${groupId}`);
    } else {
      // Fallback if group not found
      navigate(`/sprint/${groupId}`);
    }
  };

  const handleGroupModalClose = () => {
    setGroupModalVisible(false);
    setSelectedGroup(undefined);
  };

  const onGroupFormSuccess = () => {
    setGroupModalVisible(false);
    setSelectedGroup(undefined);
    // Invalidate the userGroups query to trigger a refetch
    userGroupsQuery.refetch();
  };

  // Handle loading test data
  const handleLoadTestData = () => {
    setUseTestData(true);
    // Convert to standard format for context update
    updateUserGroups(convertToStandardFormat(TEST_USER_GROUPS));
    
    // Get all signals from test user groups
    const allSignals: SignalDataType[] = [];
    
    // Use for...of instead of forEach
    for (const group of TEST_USER_GROUPS) {
      if (group.signals && group.signals.length > 0) {
        allSignals.push(...group.signals);
      }
    }
    
    // Sort by creation date (newest first)
    const sortedSignals = sortBy(allSignals, d => -Date.parse(d.created_at));
    updateSignalList(sortedSignals);
  };

  // Calculate pagination for groups
  const userGroups = userGroupsQuery.data || [];
  const displayGroups = useTestData ? TEST_USER_GROUPS : userGroups;
  const groupStartIndex = (groupsCurrentPage - 1) * groupsPageSize;
  const paginatedGroups = displayGroups.slice(groupStartIndex, groupStartIndex + groupsPageSize);
  const totalGroups = displayGroups.length;

  return (
     <>
        <div className="flex-div flex-space-between flex-vert-align-center" style={{ flexWrap: 'wrap', gap: '1rem' }}>
          <Title level={2} className="undp-typography margin-top-05 margin-bottom-09">
            My Sprints
          </Title>
          <div style={{ display: 'flex', gap: '12px' }}>
            {LOAD_TEST_DATA && !useTestData && (
              <Button
                type="primary"
                onClick={handleLoadTestData}
                style={{
                  backgroundColor: '#2E6EB5',
                  marginBottom: '1rem'
                }}
              >
                Load Test Data
              </Button>
            )}
            <CreateButton onClick={() => navigate('/add-new-sprint')}>
              <span>+</span> Create Sprint
            </CreateButton>
          </div>
        </div>
        <div style={{ marginBottom: '2rem' }}>
          <p className="undp-typography" style={{ fontSize: '1.1rem', color: '#2C3E50', marginBottom: 0 }}>
            Welcome to your workspace for individual exploration and team collaboration.<br />
            <br />
            Use sprints to group and explore signals around shared topics. If you're working on a specific project or initiative and want to look for signals on the future of a particular issue, this space is designed for focused collaboration with your team or for individual exploration.<br />
            <br />
            This space helps you organize insights and co-develop foresight content. Click "Create Sprint" to get started and invite collaborators.
          </p>
        </div>
        
        {userGroupsQuery.isLoading && !useTestData ? (
          <div className="undp-loader-container margin-bottom-09">
            <div className="undp-loader" />
          </div>
        ) : (
          <>
            <UserGroupsList 
              userGroups={paginatedGroups} 
              onView={handleViewGroup} 
              variant='simple'
            />
            
            {totalGroups > groupsPageSize && (
              <div className="flex-div flex-hor-align-center margin-top-07 margin-bottom-09">
                <Pagination
                  className="undp-pagination"
                  onChange={setGroupsCurrentPage}
                  current={groupsCurrentPage}
                  total={totalGroups}
                  pageSize={groupsPageSize}
                  showSizeChanger={false}
                />
              </div>
            )}
          </>
        )}
        <Modal
          title={selectedGroup ? `Edit Sprint: ${selectedGroup.name}` : "Create New Sprint"}
          open={groupModalVisible}
          onCancel={handleGroupModalClose}
          footer={null}
          width={600}
          className="undp-modal"
        >
          <GenericGroupModal 
            visible={true}
            onClose={handleGroupModalClose}
            group={selectedGroup}
            onSuccess={onGroupFormSuccess}
            modalMode={false}
          />
        </Modal>
    </>
  );
}
