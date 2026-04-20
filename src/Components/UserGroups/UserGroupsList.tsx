import { useContext, useState } from 'react';
import { Modal, message, Empty, Typography } from 'antd';
import { 
  DeleteOutlined, 
  EditOutlined, 
  ExclamationCircleOutlined, 
  UserOutlined, 
  FileTextOutlined
} from '@ant-design/icons';
import styled from 'styled-components';
import { formatDistanceToNow } from 'date-fns';
import Context from '../../Context/Context';
import type { UserGroupDataType } from '../../Types';
import { deleteUserGroup } from '../../API/userCalls';
import { CreateGroupModal } from './CreateGroupModal';
import type { SignalDataType } from '../../Types';
import type { MenuProps } from 'antd';
import { SignalSearch } from '../SignalSearch';
import { SignalHorizontalView } from '../SignalViews';
import { HeroCard } from '../HeroCard';

interface UserWithNameAndEmail {
  name: string;
  email: string;
}

interface ExtendedUserGroupDataType extends Omit<UserGroupDataType, 'users'> {
  users: UserWithNameAndEmail[];
  signals?: SignalDataType[];
}

interface UserGroupsListProps {
  onEdit?: (group: UserGroupDataType) => void;
  onView?: (groupId: number) => void;
  userGroups?: UserGroupDataType[] | ExtendedUserGroupDataType[];
  variant?: 'hero' | 'simple';
}

const { Text } = Typography;

const GroupsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const GroupCard = styled.div`
  margin-bottom: 20px;
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
  background-color: #ffffff;
  border: 1px solid #d4d6d8;
  border-top: 6px solid var(--blue-600);
  border-radius: 0;
  box-shadow: none;

  .hero-card {
    box-shadow: none !important;
    transform: none !important;
    transition: background-color 0.2s ease;
  }

  .hero-card:hover {
    box-shadow: none !important;
    transform: none !important;
  }

  .hero-card:hover [class*='HeroImageEl'] {
    filter: brightness(92%);
  }

  .hero-card h3,
  .hero-card .ant-typography {
    font-family: var(--fontFamilyHeadings) !important;
  }
  
  a:hover {
    text-decoration: underline !important;
  }
`;

const InfoSection = styled.div`
  display: flex;
  flex-direction: row;
  gap: 16px;
  margin-top: 0;
  padding: 0 20px 20px 20px;
  align-items: center;
  flex-wrap: wrap;
`;

const UserAvatarGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d4d6d8;
  border-radius: 0;
  background-color: var(--gray-200);
  
  &:hover {
    background-color: var(--gray-300);
  }

  .ant-typography {
    color: var(--gray-700);
    font-size: 0.875rem;
    font-weight: 600;
    margin: 0;
    text-transform: uppercase;
  }
`;

const SignalAvatarGroup = styled(UserAvatarGroup)`
  margin: 0;
`;

const SimpleGroupCard = styled.a`
  display: block;
  width: 100%;
  color: inherit;
  text-decoration: none !important;
  background-color: #ffffff;
  border: 1px solid #d4d6d8;
  border-top: 6px solid var(--blue-600);
  padding: 1.25rem;
  transition: background-color 0.2s ease, border-color 0.2s ease;

  * {
    text-decoration: none !important;
  }

  &:hover {
    background-color: var(--gray-100);
    border-color: var(--gray-500);
    text-decoration: none !important;
  }
`;

const SimpleGroupTitle = styled.h4`
  margin: 0 0 0.75rem 0;
  color: var(--black);
  font-family: var(--fontFamilyHeadings);
  font-size: 1.75rem;
  line-height: 1;
`;

const SimpleGroupMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

const SimpleMetaItem = styled.div`
  color: var(--gray-700);
  font-family: var(--fontFamily);
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
`;

const SimpleGroupFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  border-top: 1px solid #d4d6d8;
  padding-top: 0.875rem;
  padding-right: 1rem;
`;

const SimpleModified = styled.div`
  color: var(--gray-600);
  font-size: 0.875rem;
`;

const SimpleOpenLabel = styled.div`
  align-items: center;
  background-color: var(--blue-600);
  border: 2px solid var(--blue-600);
  color: var(--white);
  display: inline-flex;
  flex-shrink: 0;
  font-family: var(--fontFamilyHeadings);
  font-size: 0.8125rem;
  font-weight: 700;
  gap: 0.5rem;
  line-height: 1;
  margin-left: auto;
  margin-right: 1rem;
  min-height: 2.5rem;
  padding: 0.75rem 1rem;
  text-decoration: none !important;
  text-transform: uppercase;
  transform: none !important;
  transition: none !important;
  white-space: nowrap;

  &::after {
    content: '→';
    font-size: 1rem;
    line-height: 1;
  }

  &:hover,
  &:focus,
  &:active {
    background-color: var(--blue-600);
    border-color: var(--blue-600);
    color: var(--white);
    text-decoration: none !important;
  }
`;

// TimeAgo component for displaying relative time from a date string
export const TimeAgo = ({ date }: { date?: string | null }): string | undefined => {
  if (!date) return undefined;
  try {
    const parsedDate = new Date(date);
    const timeAgo = formatDistanceToNow(parsedDate, { addSuffix: true });
    return `Modified ${timeAgo}`;
  } catch (error) {
    console.error('Error formatting date:', error);
    return undefined;
  }
};

// Convert extended user group type to standard format
const convertToStandardFormat = (
  groups: ExtendedUserGroupDataType[]
): UserGroupDataType[] => {
  return groups.map(group => ({
    id: group.id,
    name: group.name,
    user_ids: group.user_ids,
    signal_ids: group.signal_ids,
    collaborator_map: group.collaborator_map,
    // Keep any other required fields from UserGroupDataType
    created_at: group.created_at,
    created_by: group.created_by,
    modified_at: group.modified_at,
    modified_by: group.modified_by,
    status: group.status,
    headline: group.headline,
    description: group.description,
    attachment: group.attachment,
    steep_primary: group.steep_primary,
    steep_secondary: group.steep_secondary,
    signature_primary: group.signature_primary,
    signature_secondary: group.signature_secondary,
    sdgs: group.sdgs,
  }));
};

export const UserGroupsList = ({
  userGroups: propUserGroups,
  variant = 'hero',
}: UserGroupsListProps) => {
  const { userGroups: contextUserGroups, updateUserGroups } = useContext(Context);
  const { confirm } = Modal;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSignalSearchVisible, setIsSignalSearchVisible] = useState(false);
  const [currentGroup, setCurrentGroup] = useState<UserGroupDataType | ExtendedUserGroupDataType | null>(null);
  
  // Use prop userGroups if provided, otherwise fall back to context
  const userGroups = propUserGroups || contextUserGroups;

  const handleDelete = (group: UserGroupDataType | ExtendedUserGroupDataType) => {
    confirm({
      title: `Are you sure you want to delete the group "${group.name}"?`,
      icon: <ExclamationCircleOutlined />,
      content: 'This action cannot be undone.',
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await deleteUserGroup(group.id);
          
          // Make sure we can update the context with the correct type
          if (userGroups) {
            const updatedGroups = 
              Array.isArray(userGroups) ? 
                (userGroups as Array<UserGroupDataType | ExtendedUserGroupDataType>).filter((g: UserGroupDataType | ExtendedUserGroupDataType) => g.id !== group.id) : 
                [];
                
            // Convert to standard format if we're using extended user groups
            const standardGroups = isExtendedUserGroupArray(updatedGroups) ?
              convertToStandardFormat(updatedGroups) :
              updatedGroups as UserGroupDataType[];
              
            updateUserGroups(standardGroups);
          }
          
          message.success(`Group "${group.name}" has been deleted.`);
        } catch (error) {
          message.error('Failed to delete the group. Please try again.');
          console.error(error);
        }
      },
    });
  };

  // Type guard to check if we have an array of ExtendedUserGroupDataType
  const isExtendedUserGroupArray = (
    arr: (UserGroupDataType | ExtendedUserGroupDataType)[]
  ): arr is ExtendedUserGroupDataType[] => {
    return (
      arr.length > 0 &&
      'users' in arr[0] &&
      Array.isArray(arr[0].users)
    );
  };

  const handleModalSuccess = () => {
    message.success('Group created successfully!');
  };

  const handleAddSignals = (group: UserGroupDataType | ExtendedUserGroupDataType) => {
    setCurrentGroup(group);
    setIsSignalSearchVisible(true);
  };

  const handleSignalSelect = (signals: SignalDataType[]) => {
    message.success(`${signals.length} signals added to ${currentGroup?.name}`);
  };

  const renderCollaboratorCount = (group: UserGroupDataType | ExtendedUserGroupDataType) => {
    const collaboratorCount = group.user_ids ? group.user_ids.length : 0;

    return (
      <UserAvatarGroup>
        <Text>
          <UserOutlined /> {collaboratorCount} {collaboratorCount === 1 ? 'Collaborator' : 'Collaborators'}
        </Text>
      </UserAvatarGroup>
    );
  };

  const renderSignalCount = (group: UserGroupDataType | ExtendedUserGroupDataType) => {
    const signalCount = group.signal_ids ? group.signal_ids.length : 0;

    return (
      <SignalAvatarGroup>
        <Text>
          <FileTextOutlined /> {signalCount} {signalCount === 1 ? 'Signal' : 'Signals'}
        </Text>
      </SignalAvatarGroup>
    );
  };

  const renderGroupSignals = (group: UserGroupDataType | ExtendedUserGroupDataType) => {
    const signals = 'signals' in group ? group.signals : undefined;

    if (!signals || signals.length === 0) {
      return null;
    }

    return (
      <SignalHorizontalView
        signals={signals.slice(0, 3)}
        showRemoveButton={false}
      />
    );
  };

  const renderGroups = () => {
    if (!userGroups || userGroups.length === 0) {
      return (
        <Empty 
          description="No user groups found" 
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      );
    }

    return (
      <GroupsGrid>
        {userGroups.map(group => {
          // Convert to standard format if needed before passing to onEdit
          const isExtendedGroup = 'users' in group;
          const standardGroup = isExtendedGroup
            ? {
                id: group.id,
                name: group.name,
                user_ids: group.user_ids,
                signal_ids: group.signal_ids,
                collaborator_map: group.collaborator_map,
              } as UserGroupDataType
            : group as UserGroupDataType;
          
          const menuItems: MenuProps['items'] = [
            {
              key: 'edit',
              label: 'Edit Group',
              icon: <EditOutlined />,
              onClick: () => {
                window.location.href = `/sprint/${standardGroup.id}`;
              }
            },
            {
              key: 'delete',
              label: 'Delete Group',
              icon: <DeleteOutlined style={{ color: '#FF4D4F' }} />,
              onClick: () => handleDelete(group),
              danger: true
            }
          ];

          // Generate URL for the group
          const getGroupUrl = () => {
            
            // Create a URL-friendly slug from the group name
            const slug = group.name.toLowerCase()
              .replace(/[^\w\s-]/g, '') // Remove special characters
              .replace(/\s+/g, '-')     // Replace spaces with hyphens
              .trim();
            
            return `/sprint/${slug}-${group.id}`;
          };
          
          return (
            <GroupCard key={group.id}>
              {variant === 'simple' ? (
                <SimpleGroupCard href={getGroupUrl()}>
                  <SimpleGroupTitle>{group.name}</SimpleGroupTitle>
                  <SimpleGroupMeta>
                    <SimpleMetaItem>
                      <UserOutlined /> {group.user_ids?.length || 0}{' '}
                      {(group.user_ids?.length || 0) === 1
                        ? 'Collaborator'
                        : 'Collaborators'}
                    </SimpleMetaItem>
                    <SimpleMetaItem>
                      <FileTextOutlined /> {group.signal_ids?.length || 0}{' '}
                      {(group.signal_ids?.length || 0) === 1
                        ? 'Signal'
                        : 'Signals'}
                    </SimpleMetaItem>
                  </SimpleGroupMeta>
                  <SimpleGroupFooter>
                    <SimpleModified>
                      {TimeAgo({ date: group.modified_at }) || 'Recently updated'}
                    </SimpleModified>
                    <SimpleOpenLabel>Open Sprint</SimpleOpenLabel>
                  </SimpleGroupFooter>
                </SimpleGroupCard>
              ) : (
                <HeroCard
                  title={group.name}
                  bgImage={group.attachment || undefined}
                  url={getGroupUrl()}
                >
                  <InfoSection>
                    {renderCollaboratorCount(group)}
                    {renderSignalCount(group)}
                  </InfoSection>
                  {renderGroupSignals(group)}
                </HeroCard>
              )}
            </GroupCard>
          );
        })}
      </GroupsGrid>
    );
  };

  return (
    <>
      {renderGroups()}

      <CreateGroupModal 
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSuccess={handleModalSuccess}
      />

      {currentGroup && (
        <SignalSearch
          visible={isSignalSearchVisible}
          onClose={() => setIsSignalSearchVisible(false)}
          onSelect={handleSignalSelect}
          selectedSignals={'signals' in currentGroup ? currentGroup.signals : []}
          title={`Add Signals to ${currentGroup.name}`}
        />
      )}
    </>
  );
}; 
