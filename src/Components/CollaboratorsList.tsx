import React from 'react';
import styled from 'styled-components';
import { Collaborator } from './Collaborator';
import { Typography } from 'antd';

const { Title } = Typography;

interface CollaboratorsListProps {
  users: Array<{
    id: number;
    name: string;
    email: string;
    role: string;
  }>;
  adminId?: number;
}

const StyledCollaboratorsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  width: 100%;

  @media (min-width: 768px) {
    flex-flow: row wrap;
    & > div {
      width: calc(50% - 12px);
    }
  }
`;

const SectionTitle = styled(Title)`
  font-size: 18px !important;
  margin-bottom: 16px !important;
`;

export const CollaboratorsList: React.FC<CollaboratorsListProps> = ({ users, adminId }) => {
  // Sort users - admin first, then alphabetically by name
  const sortedUsers = [...users].sort((a, b) => {
    // If one is admin, they go first
    if (a.id === adminId && b.id !== adminId) return -1;
    if (a.id !== adminId && b.id === adminId) return 1;
    
    // Otherwise sort by role (Admin > Basic)
    if (a.role === 'Admin' && b.role !== 'Admin') return -1;
    if (a.role !== 'Admin' && b.role === 'Admin') return 1;
    
    // Finally sort alphabetically
    return a.name.localeCompare(b.name);
  });

  return (
    <div>
      <SectionTitle level={4}>Collaborators</SectionTitle>
      <StyledCollaboratorsList>
        {sortedUsers.map(user => (
          <Collaborator 
            key={user.id} 
            user={user} 
            isAdmin={user.role === 'Admin' || user.id === adminId}
          />
        ))}
      </StyledCollaboratorsList>
    </div>
  );
};

export default CollaboratorsList;