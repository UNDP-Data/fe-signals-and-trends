import { useContext, useState } from 'react';
import { Modal, message, Empty, Typography, Avatar, Badge, Tooltip } from 'antd';
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined, UserOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import Context from '../../Context/Context';
import type { UserGroupDataType } from '../../Types';
import { deleteUserGroup } from '../../API/userCalls';
import { CreateGroupModal } from './CreateGroupModal';
import { SignalCard } from '../SignalCard';
import type { SignalDataType } from '../../Types';

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
  userGroups?: UserGroupDataType[] | ExtendedUserGroupDataType[];
}

const { Title, Text } = Typography;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const PageTitle = styled(Title)`
  margin: 0 !important;
`;

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
  margin: 15px 0;
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

const BadgeCount = styled(Badge)`
  margin-left: 15px;
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
    users: group.users.map(user => user.email)
  }));
};

export const UserGroupsList = ({ onEdit, userGroups: propUserGroups }: UserGroupsListProps) => {
  const { userGroups: contextUserGroups, updateUserGroups } = useContext(Context);
  const { confirm } = Modal;
  const [isModalVisible, setIsModalVisible] = useState(false);
  
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
      arr[0].users.length > 0 &&
      typeof arr[0].users[0] !== 'string'
    );
  };

  const handleModalSuccess = () => {
    message.success('Group created successfully!');
  };

  const renderUserAvatars = (group: UserGroupDataType | ExtendedUserGroupDataType) => {
    const users = 'users' in group && Array.isArray(group.users)
      ? group.users
      : [];
      
    const totalUsers = users.length;
    const displayedUsers = users.slice(0, 3);
    const remainingCount = totalUsers - displayedUsers.length;
    
    // Check if we're dealing with the extended user group type
    const isExtendedGroup = displayedUsers.length > 0 && 
      typeof displayedUsers[0] !== 'string';
    
    return (
      <UserAvatarGroup>
        <Text style={{ marginRight: '15px' }}><UserOutlined /> Collaborators:</Text>
        
        {isExtendedGroup ? (
          // Render avatars for extended user groups
          (displayedUsers as UserWithNameAndEmail[]).map((user) => (
            <Tooltip title={user.name} key={user.email}>
              <UserAvatar 
                style={{ backgroundColor: getAvatarColor(user.name) }}
              >
                {getInitials(user.name)}
              </UserAvatar>
            </Tooltip>
          ))
        ) : (
          // Render avatars for standard user groups
          (displayedUsers as string[]).map((user) => (
            <Tooltip title={user} key={user}>
              <UserAvatar 
                style={{ backgroundColor: getAvatarColor(user) }}
              >
                {user.substring(0, 2).toUpperCase()}
              </UserAvatar>
            </Tooltip>
          ))
        )}
        
        {remainingCount > 0 && (
          <Tooltip title={`${remainingCount} more collaborators`}>
            <MoreUsers>+{remainingCount}</MoreUsers>
          </Tooltip>
        )}
        
        <BadgeCount count={totalUsers} color="#006EB5" />
      </UserAvatarGroup>
    );
  };

  const renderGroupSignals = (group: UserGroupDataType | ExtendedUserGroupDataType) => {
    // Use signals property if it exists on the group (for ExtendedUserGroupDataType)
    const signals = 'signals' in group ? group.signals : undefined;
    
    if (!signals || signals.length === 0) {
      return <Text type="secondary">No signals found for this group</Text>;
    }
    
    return (
      <>
        <SignalsContainer>
          {signals.slice(0, 3).map(signal => (
            <CompactSignalCard key={signal.id}>
              <SignalCard data={signal} />
            </CompactSignalCard>
          ))}
        </SignalsContainer>
      </>
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

    return userGroups.map(group => (
      <GroupCard key={group.id}>
        <GroupHeader>
          <GroupTitle level={3}>{group.name}</GroupTitle>
          <ActionButtons>
            <ActionButton 
              onClick={() => {
                // Convert to standard format if needed before passing to onEdit
                const standardGroup = 'users' in group && 
                  typeof group.users[0] !== 'string' ?
                  {
                    id: group.id,
                    name: group.name,
                    users: (group.users as UserWithNameAndEmail[]).map(u => u.email)
                  } : 
                  group as UserGroupDataType;
                
                onEdit?.(standardGroup);
              }}
              title="Edit Group"
            >
              <EditOutlined style={{ color: '#006EB5' }} />
            </ActionButton>
            <ActionButton 
              onClick={() => handleDelete(group)}
              title="Delete Group"
            >
              <DeleteOutlined style={{ color: '#FF4D4F' }} />
            </ActionButton>
          </ActionButtons>
        </GroupHeader>
        <GroupContent>
          {renderUserAvatars(group)}
          {renderGroupSignals(group)}
        </GroupContent>
      </GroupCard>
    ));
  };

  return (
    <>
      <HeaderContainer>
        <PageTitle level={2}>User Groups</PageTitle>
        <CreateButton onClick={() => setIsModalVisible(true)}>
          <span>+</span> Create Group
        </CreateButton>
      </HeaderContainer>

      {renderGroups()}

      <CreateGroupModal 
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSuccess={handleModalSuccess}
      />
    </>
  );
}; 