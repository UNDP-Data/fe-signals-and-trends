import { useState, useContext, useEffect } from 'react';
import { Modal, Button, Form, Input, message } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import Context from '../../Context/Context';
import { createUserGroup } from '../../API/userCalls';
import MemberSelect from '../MemberSelect';
import './CreateGroupModal.css';

interface CreateGroupModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const CreateGroupModal: React.FC<CreateGroupModalProps> = ({
  visible,
  onClose,
  onSuccess
}) => {
  const [form] = Form.useForm();
  const { userGroups, updateUserGroups } = useContext(Context);
  const [loading, setLoading] = useState(false);

  // Reset form when modal opens
  useEffect(() => {
    if (visible) {
      form.resetFields();
    }
  }, [visible, form]);

  const handleSubmit = async (values: { name: string; users: string[] }) => {
    setLoading(true);
    try {
      const newGroup = await createUserGroup(values);
      updateUserGroups(userGroups ? [...userGroups, newGroup] : [newGroup]);
      message.success(`Group "${values.name}" has been created.`);
      form.resetFields();
      
      if (onSuccess) {
        onSuccess();
      }
      onClose();
    } catch (error) {
      message.error('Failed to create the group. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  function CreateForm(){
    return <Form
    form={form}
    layout="vertical"
    onFinish={(values) => {
      // Trim the name before submission
      const trimmedValues = {
        ...values,
        name: values.name?.trim()
      };
      handleSubmit(trimmedValues);
    }}
    initialValues={{ users: [] }}
    validateTrigger={['onChange', 'onBlur']}
  >
    <Form.Item 
      name="name" 
      className="styled-form-item"
      rules={[{ 
        required: true, 
        whitespace: true,
        message: 'Please enter a group title'
      }]}
      validateTrigger={['onChange', 'onBlur']}
    >
      <div className="group-title">Group Title*</div>
      <Input
        className="styled-input"
        placeholder="Enter group title (max 100 characters)"
        maxLength={100}
      />
    </Form.Item>

    <div className="members-title">Members</div>
    <Form.Item name="users">
      <MemberSelect placeholder="Type a name or UNDP email to search and select users" />
    </Form.Item>

    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '24px' }}>
      <Button
        type="primary"
        htmlType="submit"
        loading={loading}
        className="save-button"
      >
        Save Group & Send Invites
        <svg width="10" height="16" viewBox="0 0 10 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <title>Right arrow</title>
          <path d="M1.5 1L8.5 8L1.5 15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </Button>
    </div>
  </Form>
  }

  return (
    <Modal
      className="modal-container"
      open={visible}
      title="Add Collaborator"
      onCancel={onClose}
      footer={null}
      width={960}
      closeIcon={null}
    >
      <button type="button" className="close-button" onClick={onClose}>
        <CloseOutlined />
      </button>
      <CreateForm />
    </Modal>
  );
};

export default CreateGroupModal; 