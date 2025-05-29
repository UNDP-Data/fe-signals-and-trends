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
      group={group}
      submitButtonText="Update Group"
    />
  );
};

export default EditGroupModal;