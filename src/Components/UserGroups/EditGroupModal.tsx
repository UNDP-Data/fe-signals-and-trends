import { useState, useContext } from 'react';
import { message } from 'antd';
import { updateUserGroup } from '../../API/userCalls';
import { UserGroupDataType } from '../../Types';
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
    const updatedGroup = {
      ...groupWithoutUsers,
      name: values.name,
      description: values.description,
      users: values.users
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