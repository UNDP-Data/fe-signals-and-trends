import { useState, useContext } from 'react';
import { Modal, message } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import UserGroupForm, { UserGroupFormValues } from './UserGroupForm';
import { UserGroupDataType } from '../../Types';
import { createUserGroup, updateUserGroup } from '../../API/userCalls';
import type { UserGroupResponseDataType } from '../../API/userCalls';
import Context from '../../Context/Context';
import { logger } from '../../logger';
import './CreateGroupModal.css';

export interface GenericGroupModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  title?: string;
  initialValues?: {
    name?: string;
    users?: string[];
    admins?: string[];
    description?: string;
  };
  group?: UserGroupDataType;
  submitButtonText?: string;
  modalMode?: boolean;
}

export const GenericGroupModal: React.FC<GenericGroupModalProps> = ({
  visible,
  onClose,
  onSuccess,
  title = 'Add Collaborator',
  initialValues = { name: '', users: [], admins: [], description: '' },
  group,
  submitButtonText = 'Save Group & Send Invites',
  modalMode = true,
}) => {
  const { userGroups, updateUserGroups, userID } = useContext(Context);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: UserGroupFormValues) => {
    setLoading(true);
    try {
      // Convert user IDs to integers
      const submitData = {
        name: values.name,
        user_ids: values.users ? values.users.map(id => parseInt(id, 10)) : [],
      };

      const user_ids = [...submitData.user_ids];
      if (userID && !user_ids.includes(userID)) {
        user_ids.push(userID);
      }

      if (group) {
        // Update existing group
        const updatedGroupData: UserGroupResponseDataType = {
          id: group.id,
          name: submitData.name,
          user_ids,
          signal_ids: group.signal_ids,
          collaborator_map: group.collaborator_map,
        };
        const updatedGroup = await updateUserGroup(group.id, updatedGroupData);
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
      } else {
        // Create new group
        const newGroup = await createUserGroup({ ...submitData, user_ids });

        // Convert to UserGroupDataType format for compatibility
        const newGroupData: UserGroupDataType = {
          ...newGroup,
          user_ids: newGroup.user_ids || [],
          signal_ids: [],
          collaborator_map: {},
        };

        updateUserGroups(
          userGroups ? [...userGroups, newGroupData] : [newGroupData],
        );
        message.success(`Group "${values.name}" has been created.`);
      }

      if (onSuccess) {
        onSuccess();
      }

      onClose();
    } catch (error) {
      message.error(
        `Failed to ${group ? 'update' : 'create'} the group. Please try again.`,
      );
      logger.error('Failed to create/update group:', error);
      throw error; // Re-throw to let the form handle loading state
    } finally {
      setLoading(false);
    }
  };

  if (!modalMode) {
    return (
      <UserGroupForm
        onSubmit={handleSubmit}
        initialValues={initialValues}
        submitButtonText={submitButtonText}
        modalMode={modalMode}
        loading={loading}
      />
    );
  }

  return (
    <Modal
      className="modal-container"
      open={visible}
      title={title}
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
        initialValues={initialValues}
        submitButtonText={submitButtonText}
        modalMode={modalMode}
        loading={loading}
      />
    </Modal>
  );
};

export default GenericGroupModal;