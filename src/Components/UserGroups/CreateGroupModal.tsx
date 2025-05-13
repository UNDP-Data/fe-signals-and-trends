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
  return (
    <GenericGroupModal
      visible={visible}
      onClose={onClose}
      onSuccess={onSuccess}
      title="Add Collaborator"
      initialValues={initialValues}
      submitButtonText="Save Group & Send Invites"
    />
  );
};

export default CreateGroupModal;