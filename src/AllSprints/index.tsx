import { useContext, useState, useRef, useEffect } from 'react';
import { Pagination, Modal, Typography, Button } from 'antd';
import sortBy from 'lodash.sortby';
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
} from '@azure/msal-react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { SignInButton } from '../Components/SignInButton';
import Context from '../Context/Context';
import { getAllUserGroups } from '../API/userCalls';
import { UserGroupsList } from '../Components/UserGroups';
import type { UserGroupDataType } from '../Types';
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

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <Title level={4} className="undp-typography margin-top-09 margin-bottom-05">
    {children}
  </Title>
);

export function AllSprints() {
  const { userName, updateUserGroups, isAdmin } = useContext(Context);
  const navigate = useNavigate();
  
  // User Groups state
  const [groupModalVisible, setGroupModalVisible] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<UserGroupDataType | undefined>(undefined);
  const [groupsCurrentPage, setGroupsCurrentPage] = useState(1);
  const groupsPageSize = 9;
  
  // Prevent unnecessary context updates by tracking previous data
  const prevGroupsRef = useRef<string>('');

  // Fetch all user groups with React Query (admin only)
  const userGroupsQuery = useQuery({
    queryKey: ['allUserGroups'],
    queryFn: async (): Promise<UserGroupDataType[]> => {
      if (!userName || !isAdmin) return [];
      
      try {
        // Use the endpoint from the OpenAPI spec for user groups
        const groups = await getAllUserGroups();
        
        // Make sure we return a valid UserGroupDataType[] by ensuring required fields
        return groups.map(group => {
          const { users, ...groupWithoutUsers } = group;
          return {
            ...groupWithoutUsers,
            // users omitted
            user_ids: group.user_ids || [],
            signal_ids: group.signal_ids || [],
            collaborator_map: group.collaborator_map || {}
          };
        }) as UserGroupDataType[];
      } catch (error) {
        console.error('Failed to fetch all user groups:', error);
        return [];
      }
    },
    enabled: !!userName && isAdmin
  });

  // Update context only when the data actually changes to prevent infinite loops
  useEffect(() => {
    if (userGroupsQuery.data && !userGroupsQuery.isLoading) {
      const dataString = JSON.stringify(userGroupsQuery.data);
      if (dataString !== prevGroupsRef.current) {
        prevGroupsRef.current = dataString;
        updateUserGroups(userGroupsQuery.data);
      }
    }
  }, [userGroupsQuery.data, userGroupsQuery.isLoading, updateUserGroups]);

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

  // Calculate pagination for groups
  const userGroups = userGroupsQuery.data || [];
  const startIndex = (groupsCurrentPage - 1) * groupsPageSize;
  const paginatedGroups = userGroups.slice(startIndex, startIndex + groupsPageSize);
  const totalGroups = userGroups.length;

  return (
    <div className='main-content-container'>
      <AuthenticatedTemplate>
        {isAdmin ? (
          <>
            <div className="flex-div flex-space-between flex-vert-align-center" style={{ flexWrap: 'wrap', gap: '1rem' }}>
              <Title level={2} className="undp-typography margin-top-05 margin-bottom-09">
                All Sprints
              </Title>
            </div>
            
            {userGroupsQuery.isLoading ? (
              <div className="undp-loader-container margin-bottom-09">
                <div className="undp-loader" />
              </div>
            ) : (
              <>
                <UserGroupsList 
                  userGroups={paginatedGroups} 
                  onEdit={handleEditGroup} 
                  onView={handleViewGroup} 
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
          </>
        ) : (
          <div className="margin-top-09">
            <Title level={2} className="undp-typography margin-bottom-09">
              Access Denied
            </Title>
            <p className="undp-typography">
              You need administrator privileges to view this page.
            </p>
          </div>
        )}
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <SignInButton buttonText='Sign In to View Dashboard' />
      </UnauthenticatedTemplate>
    </div>
  );
}