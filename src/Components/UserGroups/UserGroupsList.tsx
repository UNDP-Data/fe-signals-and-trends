import { useContext, useState } from 'react';
import { Modal, message, Empty, Typography, Avatar, Tooltip, Dropdown, Badge, Button } from 'antd';
import { 
  DeleteOutlined, 
  EditOutlined, 
  ExclamationCircleOutlined, 
  UserOutlined, 
  PlusCircleOutlined,
  EllipsisOutlined,
  FileTextOutlined,
  PlusOutlined
} from '@ant-design/icons';
import styled from 'styled-components';
import Context from '../../Context/Context';
import type { UserGroupDataType } from '../../Types';
import { deleteUserGroup } from '../../API/userCalls';
import { CreateGroupModal } from './CreateGroupModal';
import { SignalCard } from '../SignalCard';
import type { SignalDataType } from '../../Types';
import type { MenuProps } from 'antd';
import { SignalSearch } from '../SignalSearch';

interface UserWithNameAndEmail {
  name: string;
  email: string;
}

interface ExtendedUserGroupDataType extends UserGroupDataType {
  users: UserWithNameAndEmail[];
  signals?: SignalDataType[];
}

interface UserGroupsListProps {
  onEdit?: (group: UserGroupDataType) => void;
  onView?: (groupId: number) => void;
  userGroups?: UserGroupDataType[] | ExtendedUserGroupDataType[];
}

const { Title, Text } = Typography;

const GroupCard = styled.div`
  margin-bottom: 30px;
  width: 100%;
`;

const GroupHeader = styled.div`
  background-color: #F7F7F7;
  border-bottom: 1px solid #D4D6D8;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const GroupTitle = styled(Title)`
  margin: 0 !important;
  font-size: 22px !important;
`;

const GroupContent = styled.div`
  padding: 20px;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const ActionButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const UserAvatarGroup = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 16px;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: rgba(0, 110, 181, 0.1);
  }
`;

const SignalAvatarGroup = styled(UserAvatarGroup)`
  margin: 0;
  height: 100%;
`;

const UserAvatar = styled(Avatar)`
  margin-right: -10px;
  border: 2px solid white;
`;

const MoreUsers = styled(Avatar)`
  background-color: #f0f0f0;
  color: #666;
  cursor: pointer;
`;

const AddUserButton = styled(PlusCircleOutlined)`
  color: #006EB5;
  font-size: 16px;
  margin-left: 6px;
  cursor: pointer;
`;

const GroupHeaderContent = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
`;

const MenuButton = styled.div`
  cursor: pointer;
  padding: 5px;
  border-radius: 4px;
  
  &:hover {
    background-color: #f0f0f0;
  }
`;

const SignalsContainer = styled.div`
  display: flex;
  overflow-x: auto;
  gap: 20px;
  padding: 20px 0;
  margin-top: 20px;
  border-top: 1px solid #eeeeee;
`;

const CompactSignalCard = styled.div`
  width: 300px;
  min-width: 300px;
  border: 1px solid #e8e8e8;
`;

const SignalBadge = styled(Badge)`
  margin-left: 5px;
`;

// Helper function to get initials from a name
const getInitials = (name: string): string => {
  const parts = name.split(' ');
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

// Helper to get avatar color based on name
const getAvatarColor = (name: string): string => {
  const colors = [
    '#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1',
    '#13c2c2', '#eb2f96', '#fa541c', '#a0d911', '#2f54eb'
  ];
  
  // Simple hash function to generate a consistent color for a name
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
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
    sdgs: group.sdgs
  }));
};

export const UserGroupsList = ({ onEdit, onView, userGroups: propUserGroups }: UserGroupsListProps) => {
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
    // Here you would update the group with the selected signals
    // This would typically involve an API call
    message.success(`${signals.length} signals added to ${currentGroup?.name}`);
    
    // This is a placeholder - in a real implementation, you would need to update the group
    // with the selected signals and update the context or prop
  };

  const renderUserAvatars = (group: UserGroupDataType | ExtendedUserGroupDataType, compact = false) => {
    // For ExtendedUserGroupDataType, we have users as UserWithNameAndEmail[]
    // For UserGroupDataType, we need to use user_ids since it doesn't have a users property
    const isExtendedGroup = 'users' in group && Array.isArray(group.users);
    
    // Get users data from the appropriate place
    const users = isExtendedGroup
      ? (group as ExtendedUserGroupDataType).users
      : []; // If it's a standard UserGroupDataType, we don't have user data, just IDs
      
    const totalUsers = users.length;
    const displayedUsers = compact ? users.slice(0, 2) : users.slice(0, 3);
    const remainingCount = totalUsers - displayedUsers.length;
    
    // Convert to standard format if needed before passing to onEdit
    const handleClick = () => {
      const standardGroup = isExtendedGroup
        ? {
            id: group.id,
            name: group.name,
            user_ids: group.user_ids,
            signal_ids: group.signal_ids,
            collaborator_map: group.collaborator_map,
          } as UserGroupDataType
        : group as UserGroupDataType;
      
      onEdit?.(standardGroup);
    };
    
    return (
      <UserAvatarGroup onClick={handleClick}>
        {!compact && <Text style={{ marginRight: '15px' }}><UserOutlined /> Collaborators:</Text>}
        
        {isExtendedGroup ? (
          // Render avatars for extended user groups
          displayedUsers.map((user) => (
            <Tooltip title={user.name} key={user.email}>
              <UserAvatar 
                style={{ backgroundColor: getAvatarColor(user.name) }}
                size={compact ? "small" : "default"}
              >
                {getInitials(user.name)}
              </UserAvatar>
            </Tooltip>
          ))
        ) : (
          // For standard UserGroupDataType, we don't have user details
          // This is a placeholder rendering when we only have user_ids
          <Text type="secondary">No user details available</Text>
        )}
        
        {remainingCount > 0 && (
          <Tooltip title={`${remainingCount} more collaborators`}>
            <MoreUsers size={compact ? "small" : "default"}>+{remainingCount}</MoreUsers>
          </Tooltip>
        )}
        
        <Tooltip title="Edit collaborators">
          <AddUserButton />
        </Tooltip>
      </UserAvatarGroup>
    );
  };

  const renderSignalAvatars = (group: UserGroupDataType | ExtendedUserGroupDataType) => {
    // Use signals property if it exists on the group (for ExtendedUserGroupDataType)
    const signals = 'signals' in group ? group.signals : undefined;
    const signalCount = signals?.length || 0;
    
    return (
      <SignalAvatarGroup onClick={() => handleAddSignals(group)}>
        <Text style={{ marginRight: '15px' }}><FileTextOutlined /> Signals:</Text>
        
        {signalCount > 0 ? (
          <>
            <Text strong style={{ marginRight: '8px' }}>{signalCount}</Text>
            <SignalBadge count={signalCount} color="#006EB5" />
          </>
        ) : (
          <Text type="secondary">No signals</Text>
        )}
        
        <Tooltip title="Add signals">
          <AddUserButton />
        </Tooltip>
      </SignalAvatarGroup>
    );
  };

  const renderGroupSignals = (group: UserGroupDataType | ExtendedUserGroupDataType) => {
    const signals = 'signals' in group ? group.signals : undefined;
    
    if (!signals || signals.length === 0) {
      return null;
    }
    
    return (
      <SignalsContainer>
        {signals.slice(0, 3).map(signal => (
          <CompactSignalCard key={signal.id}>
            <SignalCard data={signal} />
          </CompactSignalCard>
        ))}
      </SignalsContainer>
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

    return userGroups.map(group => {
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
          onClick: () => onEdit?.(standardGroup)
        },
        {
          key: 'delete',
          label: 'Delete Group',
          icon: <DeleteOutlined style={{ color: '#FF4D4F' }} />,
          onClick: () => handleDelete(group),
          danger: true
        }
      ];

      const handleGroupClick = () => {
        if (onView) {
          onView(group.id);
        }
      };
      
      return (
        <GroupCard key={group.id} style={{ cursor: onView ? 'pointer' : 'default' }} onClick={onView ? handleGroupClick : undefined}>
          <GroupHeader>
            <GroupHeaderContent>
              <GroupTitle level={3}>{group.name}</GroupTitle>
              {renderUserAvatars(group, true)}
              {renderSignalAvatars(group)}
            </GroupHeaderContent>
            <Dropdown menu={{ items: menuItems }} trigger={['click']}>
              <MenuButton onClick={(e) => e.stopPropagation()}>
                <EllipsisOutlined style={{ fontSize: '24px' }} />
              </MenuButton>
            </Dropdown>
          </GroupHeader>
          <GroupContent>
            {renderGroupSignals(group)}
          </GroupContent>
        </GroupCard>
      );
    });
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