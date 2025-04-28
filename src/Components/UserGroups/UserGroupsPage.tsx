import { useState } from 'react';
import { Button } from 'antd';
import { UserGroupsList, UserGroupForm, CreateGroupModal } from './index';
import type { UserGroupDataType } from '../../Types';

const UserGroupsPage = () => {
  const [selectedGroup, setSelectedGroup] = useState<UserGroupDataType | undefined>(undefined);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleEdit = (group: UserGroupDataType) => {
    setSelectedGroup(group);
    setIsFormVisible(true);
  };

  const handleFormSuccess = () => {
    setSelectedGroup(undefined);
    setIsFormVisible(false);
  };

  const handleModalSuccess = () => {
    // Refresh the list or any other actions needed after successful group creation
  };

  return (
    <div className="undp-container">
      <div className="undp-section-header">
        <h1 className="undp-typography margin-bottom-00">User Groups</h1>
        
        <div className="undp-button-group">
          <Button 
            type="primary"
            onClick={() => setIsModalVisible(true)}
            style={{ 
              background: '#006EB5', 
              borderRadius: 0,
              border: 'none',
              height: 'auto',
              padding: '12px 20px',
              fontSize: '14px',
              fontWeight: 'bold',
              letterSpacing: '0.05em',
              textTransform: 'uppercase'
            }}
          >
            Create New Group
          </Button>
        </div>
      </div>

      {isFormVisible ? (
        <div className="undp-form-container">
          <h2 className="undp-typography margin-bottom-07">
            {selectedGroup ? 'Edit User Group' : 'Create New User Group'}
          </h2>
          <UserGroupForm 
            group={selectedGroup} 
            onSuccess={handleFormSuccess} 
          />
          <Button 
            onClick={() => {
              setSelectedGroup(undefined);
              setIsFormVisible(false);
            }}
            style={{ marginTop: '16px' }}
          >
            Cancel
          </Button>
        </div>
      ) : (
        <UserGroupsList onEdit={handleEdit} />
      )}

      {/* New Modal Component */}
      <CreateGroupModal 
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSuccess={handleModalSuccess}
      />

      <style>{`
        .undp-container {
          padding: 24px;
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .undp-section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }
        
        .undp-form-container {
          background: #FFFFFF;
          border: 1px solid #D4D6D8;
          padding: 24px;
          margin-bottom: 24px;
        }
      `}</style>
    </div>
  );
};

export default UserGroupsPage; 