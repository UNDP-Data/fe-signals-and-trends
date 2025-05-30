import { useState, useContext } from 'react';
import { Modal, message } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { UserGroupDataType } from '../../Types';
import { updateUserGroup } from '../../API/userCalls';
import type { UserGroupResponseDataType } from '../../API/userCalls';
import Context from '../../Context/Context';
import UserGroupForm, { UserGroupFormValues } from './UserGroupForm';
import { logger } from '../../logger';
import './CreateGroupModal.css';

interface EditGroupModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  group: UserGroupDataType;
}

export const EditGroupModal: React.FC<EditGroupModalProps> = ({
  visible,
  onClose,
  onSuccess,
  group
}) => {
  const { userGroups, updateUserGroups, userID } = useContext(Context);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: UserGroupFormValues) => {
    setLoading(true);
    try {
      // Convert user IDs to integers
      const user_ids = values.users ? values.users.map(id => parseInt(id, 10)) : [];
      
      // Add current user if not already included
      if (userID && !user_ids.includes(userID)) {
        user_ids.push(userID);
      }

      // Update existing group
      const updatedGroupData: UserGroupResponseDataType = {
        id: group.id,
        name: values.name,
        user_ids,
        signal_ids: group.signal_ids,
        collaborator_map: group.collaborator_map,
      };
      
      const updatedGroup = await updateUserGroup(group.id, updatedGroupData);
      
      // Update context
      if (userGroups) {
        const mappedUserGroups = userGroups.map(g => {
          if (g.id === group.id) {
            return {
              ...g,
              ...updatedGroup,
              user_ids: updatedGroup.user_ids || g.user_ids,
              users: g.users,
            };
          }
          return g;
        });
        updateUserGroups(mappedUserGroups);
      }
      
      message.success(`Group "${values.name}" has been updated.`);
      
      if (onSuccess) {
        onSuccess();
      }
      
      onClose();
    } catch (error) {
      logger.error('Failed to update group:', error);
      message.error('Failed to update the group. Please try again.');
      throw error; // Re-throw to let the form handle loading state
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      className="modal-container"
      open={visible}
      title={`Edit Group: ${group?.name || ''}`}
      onCancel={onClose}
      footer={null}
      width="auto"
      style={{ maxWidth: '960px', margin: '0 20px' }}
      closeIcon={null}
    >
      <button type="button" className="close-button" onClick={onClose}>
        <CloseOutlined />
      </button>
      <UserGroupForm
        onSubmit={handleSubmit}
        initialValues={{
          name: group?.name || '',
          users: group?.user_ids ? group.user_ids.map(id => id.toString()) : [],
          description: group?.description || ''
        }}
        submitButtonText="Update Group"
        modalMode={true}
        loading={loading}
      />
    </Modal>
  );
};

export default EditGroupModal;