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
        users: group?.user_ids ? group.user_ids.map(id => id.toString()) : [],
        description: group?.description || ''
      }}
      group={group}
      submitButtonText="Update Group"
    />
  );
};

export default EditGroupModal;