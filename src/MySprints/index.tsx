import { useContext, useEffect, useState } from 'react';
import { Pagination, Modal, Typography, Divider } from 'antd';
import type { PaginationProps } from 'antd';
import sortBy from 'lodash.sortby';
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
} from '@azure/msal-react';
import { SignInButton } from '../Components/SignInButton';
import Context from '../Context/Context';
import { searchSignals } from '../API';
import { listUserGroups } from '../API/userCalls';
import { ProjectsCardList } from '../Signals/AllSignals/MySprintsGridView';
import { UserGroupForm, UserGroupsList } from '../Components/UserGroups';
import type { UserGroupDataType } from '../Types';
import { Collaborator } from '../Components/Collaborator';

const { Title } = Typography;

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <Title level={4} className="undp-typography margin-top-09 margin-bottom-05">
    {children}
  </Title>
);

export function MySprints() {
  const { userName, signalList, updateSignalList, role, userGroups, updateUserGroups } = useContext(Context);
  const [paginationValue, setPaginationValue] = useState(1);
  const [error, setError] = useState<undefined | string>(undefined);
  const [pageSize, setPageSize] = useState(20);
  const [totalNoOfPages, setTotalNoOfPages] = useState(0);
  
  // User Groups state
  const [groupModalVisible, setGroupModalVisible] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<UserGroupDataType | undefined>(undefined);
  const [groupsLoading, setGroupsLoading] = useState(false);
  const [groupsCurrentPage, setGroupsCurrentPage] = useState(1);
  const groupsPageSize = 9;
  const [hasFetchedGroups, setHasFetchedGroups] = useState(false);

  // Fetch sprints data
  useEffect(() => {
    if (!userName) return; // Don't fetch if userName is not available
    
    setError(undefined);
    
    searchSignals({
      page: paginationValue,
      per_page: pageSize,
      statuses: ['Draft'],
      created_by: userName,
    })
      .then(response => {
        updateSignalList(
          sortBy(response.data, d => Date.parse(d.created_at)).reverse(),
        );
        setTotalNoOfPages(response.total_pages || 0);
      })
      .catch(err => {
        if (err.response?.status === 404) {
          updateSignalList([]);
        } else {
          setError(
            `${err}. ${
              err.response?.status === 500
                ? 'Please try again in some time'
                : ''
            }`,
          );
        }
      });
  }, [paginationValue, pageSize, userName, updateSignalList]);

  // Fetch user groups
  useEffect(() => {
    if (!hasFetchedGroups) {
      fetchUserGroups();
      setHasFetchedGroups(true);
    }
  }, [hasFetchedGroups]);

  const fetchUserGroups = async () => {
    if (groupsLoading) return; // Prevent multiple simultaneous fetches
    
    setGroupsLoading(true);
    try {
      // Uncomment when API call is ready
      // const groups = await listUserGroups();
      // updateUserGroups(groups);
      
      // For now, using empty array (dummy data)
      const groups: UserGroupDataType[] = [];
      updateUserGroups(groups);
    } catch (error) {
      console.error('Failed to fetch user groups:', error);
    } finally {
      setGroupsLoading(false);
    }
  };

  const handleEditGroup = (group: UserGroupDataType) => {
    setSelectedGroup(group);
    setGroupModalVisible(true);
  };

  const handleGroupModalClose = () => {
    setGroupModalVisible(false);
    setSelectedGroup(undefined);
  };

  const onGroupFormSuccess = () => {
    setGroupModalVisible(false);
    setSelectedGroup(undefined);
    // If we need to refresh groups, we can set hasFetchedGroups to false to trigger a re-fetch
    setHasFetchedGroups(false);
  };

  const onShowSizeChange: PaginationProps['onShowSizeChange'] = (
    _current,
    size,
  ) => {
    setPageSize(size);
  };

  // Calculate pagination for groups
  const groupStartIndex = (groupsCurrentPage - 1) * groupsPageSize;
  const paginatedGroups = userGroups ? userGroups.slice(groupStartIndex, groupStartIndex + groupsPageSize) : [];
  const totalGroups = userGroups?.length || 0;

  return (
    <div
      className='margin-top-13 padding-top-09 margin-bottom-09'
      style={{ paddingLeft: '1rem', paddingRight: '1rem' }}
    >
      <AuthenticatedTemplate>
        <div className="flex-div flex-space-between flex-vert-align-center">
          <Title level={2} className="undp-typography margin-top-05 margin-bottom-09">
            My Dashboard
          </Title>
        </div>

        {/* My Sprints Section */}
        <SectionTitle>My Sprints</SectionTitle>
        <Divider className="margin-top-00 margin-bottom-07" />
        
        {signalList ? (
          <div>
            <div className='flex-div flex-wrap listing'>
              {signalList.length > 0 ? (
                <ProjectsCardList />
              ) : (
                <h5
                  className='undp-typography bold'
                  style={{
                    backgroundColor: 'var(--gray-200)',
                    textAlign: 'center',
                    padding: 'var(--spacing-07)',
                    width: 'calc(100% - 4rem)',
                    border: '1px solid var(--gray-400)',
                  }}
                >
                  You don't have any sprints yet
                </h5>
              )}
            </div>
            {signalList.length > 0 && (
              <div className='flex-div flex-hor-align-center margin-top-07 margin-bottom-09'>
                <Pagination
                  className='undp-pagination'
                  onChange={e => {
                    setPaginationValue(e);
                  }}
                  defaultCurrent={1}
                  current={paginationValue}
                  total={totalNoOfPages * pageSize}
                  pageSize={pageSize}
                  showSizeChanger
                  onShowSizeChange={onShowSizeChange}
                />
              </div>
            )}
          </div>
        ) : error ? (
          <p
            className='margin-top-00 margin-bottom-09'
            style={{ color: 'var(--dark-red)' }}
          >
            {error}
          </p>
        ) : (
          <div className='undp-loader-container margin-bottom-09'>
            <div className='undp-loader' />
          </div>
        )}

        {/* User Groups Section */}
        <SectionTitle>User Groups</SectionTitle>
        <Divider className="margin-top-00 margin-bottom-07" />
        
        {groupsLoading ? (
          <div className="undp-loader-container margin-bottom-09">
            <div className="undp-loader" />
          </div>
        ) : (
          <>
            <UserGroupsList onEdit={handleEditGroup} />
            
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

        {/* Collaborators Section */}
        <SectionTitle>Collaborators</SectionTitle>
        <Divider className="margin-top-00 margin-bottom-07" />
        
        <div className="flex-div flex-wrap margin-top-07 margin-bottom-09">
          {userGroups?.flatMap(group => 
            group.users.map(user => (
              <div key={`${group.id}-${user}`} className="margin-right-05 margin-bottom-05">
                <Collaborator name={user} />
              </div>
            ))
          )}
          
          {(!userGroups || userGroups.length === 0 || userGroups.every(g => g.users.length === 0)) && (
            <p className="margin-top-00 margin-bottom-09">No collaborators found.</p>
          )}
        </div>

        <Modal
          title={selectedGroup ? `Edit Group: ${selectedGroup.name}` : "Create New Group"}
          open={groupModalVisible}
          onCancel={handleGroupModalClose}
          footer={null}
          width={600}
          className="undp-modal"
        >
          <UserGroupForm 
            group={selectedGroup} 
            onSuccess={onGroupFormSuccess} 
          />
        </Modal>
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <SignInButton buttonText='Sign In to View Dashboard' />
      </UnauthenticatedTemplate>
    </div>
  );
}
