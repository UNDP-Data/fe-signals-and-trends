import { useContext, useState } from 'react';
import { Card, Button, Tooltip, Modal, message, Empty } from 'antd';
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined, UserOutlined, PlusOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import Context from '../../Context/Context';
import type { UserGroupDataType } from '../../Types';
import { deleteUserGroup } from '../../API/userCalls';
import { CreateGroupModal } from './CreateGroupModal';

interface UserGroupsListProps {
  onEdit?: (group: UserGroupDataType) => void;
}

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Title = styled.h2`
  font-family: 'Proxima Nova', sans-serif;
  font-size: 28px;
  font-weight: 600;
  margin: 0;
`;

const CreateButton = styled(Button)`
  background-color: #006EB5;
  color: white;
  border-radius: 0;
  border: none;
  height: auto;
  padding: 10px 16px;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover, &:focus {
    background-color: #005A8F;
    color: white;
  }
`;

export const UserGroupsList = ({ onEdit }: UserGroupsListProps) => {
  const { userGroups, updateUserGroups } = useContext(Context);
  const { confirm } = Modal;
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleDelete = (group: UserGroupDataType) => {
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
          if (userGroups) {
            updateUserGroups(userGroups.filter(g => g.id !== group.id));
          }
          message.success(`Group "${group.name}" has been deleted.`);
        } catch (error) {
          message.error('Failed to delete the group. Please try again.');
          console.error(error);
        }
      },
    });
  };

  const handleModalSuccess = () => {
    // Any additional actions after group creation
    message.success('Group created successfully!');
  };

  const renderGroupCards = () => {
    if (!userGroups || userGroups.length === 0) {
      return (
        <Empty 
          description="No user groups found" 
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          className="undp-empty"
        />
      );
    }

    return userGroups.map(group => (
      <Card 
        key={group.id}
        title={
          <div className="undp-card-title">{group.name}</div>
        }
        className="undp-card margin-bottom-09 margin-right-09"
        style={{ 
          width: 320, 
          border: '2px solid #000',
          borderRadius: 0,
          overflow: 'hidden'
        }}
        headStyle={{ 
          background: '#F7F7F7', 
          borderBottom: '1px solid #D4D6D8',
          borderRadius: 0,
          padding: '16px 20px',
        }}
        bodyStyle={{ 
          padding: '20px'
        }}
        actions={[
          <Tooltip title="Edit Group" key="edit">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => onEdit?.(group)}
              style={{ fontSize: '16px' }}
            />
          </Tooltip>,
          <Tooltip title="Delete Group" key="delete">
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(group)}
              style={{ fontSize: '16px' }}
            />
          </Tooltip>,
        ]}
      >
        <div className="undp-card-content">
          <p className="undp-card-subtitle">
            <UserOutlined style={{ marginRight: '8px' }} />
            <strong>Members:</strong> {group.users.length}
          </p>
          <ul className="undp-user-list">
            {group.users.slice(0, 5).map(user => (
              <li key={user} className="undp-user-item">
                {user}
              </li>
            ))}
            {group.users.length > 5 && (
              <li className="undp-user-item undp-user-more">
                ...and {group.users.length - 5} more
              </li>
            )}
          </ul>
        </div>
      </Card>
    ));
  };

  return (
    <>
      <HeaderContainer>
        <Title>User Groups</Title>
        <CreateButton 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={() => setIsModalVisible(true)}
        >
          Create Group
        </CreateButton>
      </HeaderContainer>

      <div className="flex-div flex-wrap">
        {renderGroupCards()}
      </div>

      <CreateGroupModal 
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSuccess={handleModalSuccess}
      />

      <style>{`
        .undp-card .ant-card-head-title {
          padding: 10px 0;
        }
        
        .undp-card-title {
          font-family: 'Proxima Nova', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-size: 20px;
          font-weight: 600;
          line-height: 1.4;
        }
        
        .undp-card-subtitle {
          font-family: 'Proxima Nova', sans-serif;
          font-size: 16px;
          margin-bottom: 12px;
        }
        
        .undp-user-list {
          list-style-type: none;
          padding-left: 12px;
          margin-bottom: 0;
        }
        
        .undp-user-item {
          font-family: 'Proxima Nova', sans-serif;
          font-size: 14px;
          line-height: 1.6;
          padding: 4px 0;
          border-bottom: 1px solid #F7F7F7;
        }
        
        .undp-user-more {
          color: #006EB5;
          font-style: italic;
        }
        
        .undp-empty {
          margin: 40px auto;
        }
        
        .flex-div {
          display: flex;
          flex-wrap: wrap;
        }
      `}</style>
    </>
  );
}; 