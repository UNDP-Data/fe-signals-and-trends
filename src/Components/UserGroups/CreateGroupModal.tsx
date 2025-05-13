import { useState, useContext } from 'react';
import { createUserGroup } from '../../API/userCalls';
import GenericGroupModal from './GenericGroupModal';
import './CreateGroupModal.css';

interface CreateGroupModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialValues?: {
    name?: string;
    users?: string[];
    description?: string;
  };
}

export const CreateGroupModal: React.FC<CreateGroupModalProps> = ({
  visible,
  onClose,
  onSuccess,
  initialValues
}) => {
  const handleSubmit = async (values: { name: string; users: string[]; description?: string }) => {
    // Call the API to create a new group
    const newGroup = await createUserGroup(values);
    return newGroup;
  };

  return (
    <GenericGroupModal
      visible={visible}
      onClose={onClose}
      onSuccess={onSuccess}
      title="Add Collaborator"
      initialValues={initialValues}
      submitButtonText="Save Group & Send Invites"
      onSubmit={handleSubmit}
    />
  );
};

export default CreateGroupModal; 