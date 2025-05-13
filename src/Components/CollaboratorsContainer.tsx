import { Avatar, Tooltip, Button, Typography } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import React from 'react';

const { Text } = Typography;

const CollaboratorAvatar = styled(Avatar)`
  background-color: #006EB5;
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
`;

const CollaboratorsContainerStyled = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: flex-start;
`;

const CollaboratorsButton = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 8px;
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

export interface CollaboratorUser {
  id: number;
  name: string;
  email: string;
}

interface CollaboratorsContainerProps {
  users: CollaboratorUser[];
  loading?: boolean;
  expanded?: boolean;
  onToggle?: () => void;
  onAdd?: () => void;
}

export const CollaboratorsContainer: React.FC<CollaboratorsContainerProps> = ({
  users = [],
  loading = false,
  expanded = false,
  onToggle,
  onAdd
}) => {
  console.log('users', {users});
  return (
    <CollaboratorsContainerStyled>
      {!loading && (
        <>
          {users.length > 0 ? (
            <>
              {users.slice(0, 3).map((user) => (
                <Tooltip key={user.id} title={`${user.name} (${user.email})`}>
                  <CollaboratorAvatar
                    size="large"
                    style={{ backgroundColor: getUserColor(user.name) }}
                  >
                    {getInitials(user.name)}
                  </CollaboratorAvatar>
                </Tooltip>
              ))}
              {users.length > 3 && (
                <Tooltip title="View all collaborators">
                  <CollaboratorAvatar
                    size="large"
                    style={{ backgroundColor: '#52c41a' }}
                    onClick={onToggle}
                  >
                    +{users.length - 3}
                  </CollaboratorAvatar>
                </Tooltip>
              )}
              <CollaboratorsButton
                type="text"
                onClick={onToggle}
                icon={expanded ? <UpOutlined /> : <DownOutlined />}
              />
            </>
          ) : (
            <Text type="secondary" style={{ marginRight: '8px' }}>No collaborators</Text>
          )}
          <CollaboratorAvatar
            size="large"
            style={{ backgroundColor: '#8FC0E3' }}
            onClick={onAdd}
          >
            +
          </CollaboratorAvatar>
        </>
      )}
    </CollaboratorsContainerStyled>
  );
}; 