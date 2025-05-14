import { useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  Typography,
  Divider,
  Button,
  Skeleton,
  Row,
  Col,
  Avatar,
  Space,
  message,
  Modal,
  Empty,
  Tooltip,
  Input,
  Popconfirm,
  Collapse,
  InputRef
} from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  CheckOutlined,
  CloseOutlined,
  DownOutlined,
  UpOutlined
} from '@ant-design/icons';
import styled from 'styled-components';
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate
} from '@azure/msal-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { SignInButton } from './Components/SignInButton';
import Context from './Context/Context';
import {
  getUserGroup,
  addSignalToUserGroup,
  updateUserGroup,
  deleteUserGroup,
  removeSignalFromUserGroup
} from './API/userCalls';
import { searchSignals } from './API';
// SprintCard has been removed in favor of SignalCard
import { SignalSearch } from './Components/SignalSearch';
import { SignalCard } from './Components/SignalCard';
import { SignalGridView, SignalHorizontalView } from './Components/SignalViews';
import { SprintSignals, EditGroupModal } from './Components/UserGroups';
import type { UserGroupDataType, SignalDataType } from './Types';
import { CollaboratorsContainer } from './Components/CollaboratorsContainer';
import { CollaboratorsList } from './Components/CollaboratorsList';

const { Title, Text, Paragraph } = Typography;

// Utility functions for collaborator display are now moved to Collaborator.tsx and CollaboratorsList.tsx

const BackButtonContainer = styled.div`
  margin-bottom: 1rem;
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const BackButton = styled(Button)`
  display: inline-block;
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

// Utility function to create a URL-friendly slug from a name
const createSprintSlug = (name: string): string => {
  if (!name) return '';
  return name.toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')     // Replace spaces with hyphens
    .trim();
};


export function SprintPage() {
  // Extract sprint ID from the URL path - get the last part after the last hyphen
  const { id: urlParam } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { userName, userID, isAdmin } = useContext(Context);
  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();
  const [isSprintAdmin, setIsSprintAdmin] = useState(false);
  const [hasEditPermission, setHasEditPermission] = useState(false);
  
  // Parse the ID from the URL parameter (last part after hyphen)
  const getSprintId = () => {
    if (!urlParam) return null;
    
    const parts = urlParam.split('-');
    const idPart = parts[parts.length - 1];
    
    // Check if the last part is a number
    const id = Number.parseInt(idPart, 10);
    if (Number.isNaN(id)) {
      messageApi.error('Invalid sprint ID in URL');
      return null;
    }
    
    return id;
  };
  
  const sprintId = getSprintId();
  
  // Fetch the user group details with nested users and signals
  const sprintQuery = useQuery({
    queryKey: ['sprint', sprintId],
    queryFn: async (): Promise<UserGroupDataType & { users?: any[], signals?: any[] }> => {
      if (!sprintId) throw new Error('Sprint ID is required');

      try {
        const groupData = await getUserGroup(sprintId);
        return {
          ...groupData,
          user_ids: groupData.user_ids || [],
          signal_ids: groupData.signal_ids || [],
          collaborator_map: groupData.collaborator_map || {},
        };
      } catch (error) {
        console.error('Failed to fetch sprint details:', error);
        messageApi.error('Failed to load sprint details');
        throw error;
      }
    },
    enabled: !!sprintId && !!userName
  });

  // Check if URL needs to be updated with the correct title-id format
  useEffect(() => {
    if (sprintQuery.data?.name && sprintId) {
      const correctSlug = `${createSprintSlug(sprintQuery.data.name)}-${sprintId}`;
      
      // If URL doesn't match the correct format, update it
      if (urlParam !== correctSlug) {
        navigate(`/sprint/${correctSlug}`, { replace: true });
      }
    }
  }, [sprintQuery.data, sprintId, urlParam, navigate]);

  // We don't need a separate signals query since they're included in the sprint response
  const signalsQuery = {
    isLoading: sprintQuery.isLoading,
    data: sprintQuery.data?.signals || []
  };

  // Handle back navigation
  const handleBack = () => {
    navigate('/my-sprints');
  };

  // State for signal search modal
  const [isSignalSearchVisible, setIsSignalSearchVisible] = useState(false);

  // State for editable name and collaborators display
  const [isEditingName, setIsEditingName] = useState(false);
  const [sprintName, setSprintName] = useState('');
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isCollaboratorModalVisible, setIsCollaboratorModalVisible] = useState(false);
  const [isCollaboratorsExpanded, setIsCollaboratorsExpanded] = useState(false);
  const nameInputRef = useRef<InputRef>(null);

  // Initialize sprint name when data loads
  useEffect(() => {
    if (sprintQuery.data?.name) {
      setSprintName(sprintQuery.data.name);
    }
  }, [sprintQuery.data]);
  
  // Check if current user has edit permissions for this sprint
  useEffect(() => {
    if (sprintQuery.data && userID) {
      // Check if current user is the creator (admin) of the sprint
      const isCreatorAdmin = sprintQuery.data.created_by === userName;
      
      // Also check if they're in the user_ids array and are the first user (typically the admin)
      const isFirstUser = Array.isArray(sprintQuery.data.user_ids) && 
                         sprintQuery.data.user_ids.length > 0 && 
                         sprintQuery.data.user_ids[0] === userID;
      
      // Set sprint admin status based on creator or first user
      const sprintAdminStatus = isCreatorAdmin || isFirstUser;
      setIsSprintAdmin(sprintAdminStatus);
      
      // User has edit permission if they're either a sprint admin or an application admin
      setHasEditPermission(sprintAdminStatus || !!isAdmin);
    }
  }, [sprintQuery.data, userID, userName, isAdmin]);

  // Handle sprint name update
  const handleNameUpdate = async () => {
    if (!sprintId || !sprintQuery.data) return;
    
    // Verify user has permission before allowing name update
    if (!hasEditPermission) {
      messageApi.error('Permission denied: Only sprint or application admins can modify sprint details');
      setIsEditingName(false);
      if (sprintQuery.data?.name) {
        setSprintName(sprintQuery.data.name);
      }
      return;
    }

    try {
      // Don't update if name is empty or unchanged
      if (!sprintName.trim() || sprintName === sprintQuery.data.name) {
        setSprintName(sprintQuery.data.name);
        setIsEditingName(false);
        return;
      }

      messageApi.loading('Updating sprint name...');

      // Create updated group data
      const updatedGroup = {
        ...sprintQuery.data,
        name: sprintName,
        users: Array.isArray(sprintQuery.data?.users)
          ? sprintQuery.data.users.map((u: any) => typeof u === 'string' ? u : u.email)
          : []
      };

      await updateUserGroup(sprintId, updatedGroup);

      // Update URL to match new name
      const newSlug = createSprintSlug(sprintName);
      navigate(`/sprint/${newSlug}-${sprintId}`, { replace: true });

      // Refetch data
      queryClient.invalidateQueries({ queryKey: ['sprint', sprintId] });

      messageApi.success('Sprint name updated successfully');
      setIsEditingName(false);
    } catch (error) {
      console.error('Failed to update sprint name:', error);
      messageApi.error('Failed to update sprint name');
      // Reset to original name
      if (sprintQuery.data?.name) {
        setSprintName(sprintQuery.data.name);
      }
      setIsEditingName(false);
    }
  };

  // Handle sprint deletion
  const handleDeleteSprint = async () => {
    if (!sprintId) return;
    
    // Additional verification that user has permission before allowing deletion
    if (!hasEditPermission) {
      messageApi.error('Permission denied: Only sprint or application admins can delete sprints');
      setIsDeleteModalVisible(false);
      return;
    }

    try {
      messageApi.loading('Deleting sprint...');

      await deleteUserGroup(sprintId);

      messageApi.success('Sprint deleted successfully');

      // Navigate back to sprints page
      navigate('/my-sprints');
    } catch (error) {
      console.error('Failed to delete sprint:', error);
      messageApi.error('Failed to delete sprint');
    }
  };

  // Focus input when editing starts
  useEffect(() => {
    if (isEditingName && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [isEditingName]);

  return (
    <div className='main-content-container'>
      {contextHolder}
      <AuthenticatedTemplate>
        <BackButtonContainer>
          <BackButton type="default" onClick={handleBack}>
            ← Back to Sprints
          </BackButton>
        </BackButtonContainer>

        <HeaderContainer>
          <HeaderContent>
            <div>
              {sprintQuery.isLoading ? (
                <Skeleton.Input active style={{ width: 300 }} />
              ) : isEditingName ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Input
                    ref={nameInputRef}
                    value={sprintName}
                    onChange={(e) => setSprintName(e.target.value)}
                    style={{ width: '300px', fontSize: '1.5rem', fontWeight: 'bold' }}
                    onPressEnter={handleNameUpdate}
                  />
                  <Button
                    type="text"
                    icon={<CheckOutlined style={{ color: 'green' }}/>}
                    onClick={handleNameUpdate}
                  />
                  <Button
                    type="text"
                    icon={<CloseOutlined style={{ color: 'red' }}/>}
                    onClick={() => {
                      if (sprintQuery.data?.name) {
                        setSprintName(sprintQuery.data.name);
                      }
                      setIsEditingName(false);
                    }}
                  />
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Title level={2} className="undp-typography margin-top-05 margin-bottom-02 inline">
                    {sprintQuery.data?.name || 'Sprint Details'}
                  </Title>
                  {hasEditPermission ? (
                    <Button
                      type="text"
                      icon={<EditOutlined />}
                      onClick={() => setIsEditingName(true)}
                    />
                  ) : null}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginLeft: 'auto', marginRight: '16px' }}>
              {/* Collaborator avatars with limit and dropdown */}
              <CollaboratorsContainer
                users={sprintQuery.data?.users ?? []}
                loading={sprintQuery.isLoading}
                expanded={isCollaboratorsExpanded}
                onToggle={() => setIsCollaboratorsExpanded(!isCollaboratorsExpanded)}
                onAdd={hasEditPermission ? () => setIsCollaboratorModalVisible(true) : undefined}
              />

              {/* Action buttons */}
              <div>
                {hasEditPermission ? (
                  <>
                    <Button
                      type="primary"
                      style={{ backgroundColor: '#006EB5' }}
                      onClick={() => setIsCollaboratorModalVisible(true)}>
                      Edit Sprint
                    </Button>
                    <Button
                      danger
                      style={{ marginRight: '10px' }}
                      icon={<DeleteOutlined />}
                      onClick={() => setIsDeleteModalVisible(true)}
                    >
                      Delete
                    </Button>
                  </>
                ) : (
                  <Tooltip title="Only sprint admins or application admins can edit or delete this sprint">
                    <Button
                      type="default"
                      onClick={() => messageApi.info('You need to be a sprint admin or application admin to edit this sprint')}>
                      View Sprint Details
                    </Button>
                  </Tooltip>
                )}
              </div>
            </div>
          </HeaderContent>
        </HeaderContainer>

        {/* Delete confirmation modal */}
        <Modal
          title="Delete Sprint"
          open={isDeleteModalVisible}
          onOk={handleDeleteSprint}
          onCancel={() => setIsDeleteModalVisible(false)}
          okText="Delete"
          okButtonProps={{ danger: true }}
          cancelText="Cancel"
        >
          <p>Are you sure you want to delete the sprint "{sprintQuery.data?.name}"?</p>
          <p>This action cannot be undone.</p>
        </Modal>

        {/* Sprint details */}
        {sprintQuery.isLoading ? (
          <Skeleton active paragraph={{ rows: 3 }} />
        ) : (
          <>
            {sprintQuery.data?.description && (
              <Paragraph className="undp-typography">
                {sprintQuery.data?.description || 'No description available for this sprint.'}
              </Paragraph>
            )}

            {/* Expanded collaborators view */}
            {isCollaboratorsExpanded && (sprintQuery.data?.users ?? []).length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <CollaboratorsList 
                  users={sprintQuery.data?.users ?? []} 
                  adminId={sprintQuery.data?.user_ids?.[0]} // Assume first user is admin
                />
              </div>
            )}

            <Divider />

            {signalsQuery.isLoading ? (
              <Row gutter={[24, 24]}>
                {[1, 2, 3].map(i => (
                  <Col key={i} xs={24} sm={12} lg={8} xl={6}>
                    <Skeleton active />
                  </Col>
                ))}
              </Row>
            ) : (
              <SprintSignals
                sprint={sprintQuery.data as UserGroupDataType & { signals?: SignalDataType[] }}
                sprintId={sprintId as number}
                loading={signalsQuery.isLoading}
              />
            )}

            {/* Signal Search Modal moved to bottom of the component */}
          </>
        )}

        {/* Collaborator Edit Modal */}
        {sprintId && sprintQuery.data && hasEditPermission && (
          <EditGroupModal
            visible={isCollaboratorModalVisible}
            onClose={() => setIsCollaboratorModalVisible(false)}
            onSuccess={() => {
              // Refetch sprint data after successful update
              queryClient.invalidateQueries({ queryKey: ['sprint', sprintId] });
              messageApi.success('Sprint updated successfully');
            }}
            group={{
              ...sprintQuery.data,
              // Ensure users array is available
              users: sprintQuery.data.users || []
            }}
          />
        )}
        
        {/* Non-admin message if they somehow trigger the modal */}
        {sprintId && sprintQuery.data && !hasEditPermission && isCollaboratorModalVisible && (
          <Modal
            open={isCollaboratorModalVisible}
            title="Permission Denied"
            onCancel={() => setIsCollaboratorModalVisible(false)}
            footer={[
              <Button key="close" onClick={() => setIsCollaboratorModalVisible(false)}>
                Close
              </Button>
            ]}
          >
            <p>Only sprint admins or application admins can edit sprint details and manage collaborators.</p>
          </Modal>
        )}
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <SignInButton buttonText='Sign In to View Sprint Details' />
      </UnauthenticatedTemplate>
    </div>
  );
}
