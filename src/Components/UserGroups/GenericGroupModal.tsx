import { Modal } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import UserGroupForm, { UserGroupFormProps } from './UserGroupForm';
import './CreateGroupModal.css';


export interface GenericGroupModalProps extends UserGroupFormProps {
  visible: boolean;
  title?: string;
}

export const GenericGroupModal: React.FC<GenericGroupModalProps> = ({
  visible,
  onClose,
  onSuccess,
  title = 'Add Collaborator',
  initialValues = { name: '', users: [], admins: [], description: '' },
  group,
  submitButtonText = 'Save Group & Send Invites',
  modalMode = true
}) => {
  if (modalMode) {
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
          onClose={onClose}
          onSuccess={onSuccess}
          initialValues={initialValues}
          group={group}
          submitButtonText={submitButtonText}
          modalMode={modalMode}
        />
      </Modal>
    );
  }

  return (
    <UserGroupForm
      onClose={onClose}
      onSuccess={onSuccess}
      initialValues={initialValues}
      group={group}
      submitButtonText={submitButtonText}
      modalMode={modalMode}
    />
  );
};

export default GenericGroupModal;