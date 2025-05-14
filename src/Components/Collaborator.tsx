import React from 'react';
import { Avatar, Typography, Tooltip, Tag } from 'antd';
import styled from 'styled-components';

const { Text } = Typography;

interface CollaboratorProps {
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
  isAdmin: boolean;
}

const CollaboratorContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  border-radius: 4px;
  background-color: rgba(0,0,0,0.02);
`;

const UserInfoContainer = styled.div`
  overflow: hidden;
  flex: 1;
`;

const AdminTag = styled(Tag)`
  background-color: #006EB5;
  color: white;
  margin-left: auto;
`;

// Helper function to get initials from a name
const getInitials = (name: string): string => {
  if (!name) return '?';
  const parts = name.split(' ');
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

// Helper to get user avatar color based on name
const getUserColor = (name: string): string => {
  if (!name) return '#1890ff';
  const colors = [
    '#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1',
    '#13c2c2', '#eb2f96', '#fa541c', '#a0d911', '#2f54eb'
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

export const Collaborator: React.FC<CollaboratorProps> = ({ user, isAdmin }) => {
  return (
    <CollaboratorContainer>
      <Avatar
        size="large"
        style={{
          backgroundColor: getUserColor(user.name),
          flexShrink: 0
        }}
      >
        {getInitials(user.name)}
      </Avatar>
      <UserInfoContainer>
        <Text strong ellipsis>{user.name}</Text>
        <div>
          <Text type="secondary" style={{ fontSize: '12px' }} ellipsis>{user.email}</Text>
        </div>
      </UserInfoContainer>
      {isAdmin && (
        <Tooltip title="This user has admin permissions for this sprint">
          <AdminTag>Admin</AdminTag>
        </Tooltip>
      )}
    </CollaboratorContainer>
  );
};