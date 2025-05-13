import { useState, useContext } from 'react';
import { message } from 'antd';
import { updateUserGroup, UserGroupResponseDataType } from '../../API/userCalls';
import { UserGroupDataType, UserDataType } from '../../Types';
import GenericGroupModal from './GenericGroupModal';

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
  const handleSubmit = async (values: { name: string; users: string[]; description?: string }, groupId?: number) => {
    if (!groupId) throw new Error('Group ID is required for updating a group');

    // Create updated group data, preserving existing fields except users
    const { users, ...groupWithoutUsers } = group;
    
    // Convert to UserGroupResponseDataType which is what the API expects
    const updatedGroup: UserGroupResponseDataType = {
      id: groupId,
      name: values.name,
      users: values.users,
      user_ids: group.user_ids,
      signal_ids: group.signal_ids,
      collaborator_map: group.collaborator_map
    };

    // Call the API to update the group
    const result = await updateUserGroup(groupId, updatedGroup);
    return result;
  };

  return (
    <GenericGroupModal
      visible={visible}
      onClose={onClose}
      onSuccess={onSuccess}
      title={`Edit Group: ${group?.name || ''}`}
      initialValues={{
        name: group?.name || '',
        users: group?.users ? group.users.map(u => u.email) : [],
        description: group?.description || ''
      }}
      groupId={group?.id}
      submitButtonText="Update Group"
      onSubmit={handleSubmit}
    />
  );
};

export default EditGroupModal;