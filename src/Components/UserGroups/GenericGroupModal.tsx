import { useState, useContext, useEffect } from 'react';
import { Modal, Button, Form, Input, message } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import Context from '../../Context/Context';
import MemberSelect from '../MemberSelect';
import { UserDataType, UserGroupDataType } from '../../Types';
import './CreateGroupModal.css';

export interface GenericGroupModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  title?: string;
  initialValues?: {
    name?: string;
    users?: string[];
    description?: string;
  };
  groupId?: number;
  submitButtonText?: string;
  onSubmit: (values: { name: string; users: string[]; description?: string }, groupId?: number) => Promise<any>;
}

export const GenericGroupModal: React.FC<GenericGroupModalProps> = ({
  visible,
  onClose,
  onSuccess,
  title = 'Add Collaborator',
  initialValues = { name: '', users: [], description: '' },
  groupId,
  submitButtonText = 'Save Group & Send Invites',
  onSubmit
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Reset form and set initial values when modal opens or initialValues change
  useEffect(() => {
    if (visible) {
      form.resetFields();
      
      // Only set fields that have values
      const fieldsToSet: Record<string, any> = {};
      if (initialValues.name) fieldsToSet.name = initialValues.name;
      if (initialValues.users) fieldsToSet.users = initialValues.users;
      if (initialValues.description) fieldsToSet.description = initialValues.description;
      
      if (Object.keys(fieldsToSet).length > 0) {
        form.setFieldsValue(fieldsToSet);
      }
    }
  }, [visible, form, initialValues]);

  const handleSubmit = async (values: { name: string; users: string[]; description?: string }) => {
    setLoading(true);
    try {
      await onSubmit(values, groupId);
      
      if (onSuccess) {
        onSuccess();
      } else {
        // Fallback if onSuccess is not provided
        message.success(`Group "${values.name}" has been ${groupId ? 'updated' : 'created'}.`);
      }
      
      form.resetFields();
      onClose();
    } catch (error) {
      message.error(`Failed to ${groupId ? 'update' : 'create'} the group. Please try again.`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

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
      <Form
        form={form}
        layout="vertical"
        onFinish={(values) => {
          // Trim the name before submission
          const trimmedValues = {
            ...values,
            name: values.name?.trim(),
            description: values.description?.trim()
          };
          handleSubmit(trimmedValues);
        }}
        initialValues={{ users: [] }}
        validateTrigger={['onChange', 'onBlur']}
      >
        <Form.Item 
          name="name" 
          label="Group Title"
          className="styled-form-item"
          rules={[{ 
            required: true, 
            whitespace: true,
            message: 'Please enter a group title'
          }]}
          validateTrigger={['onChange', 'onBlur']}
        >
          <Input
            className="styled-input"
            placeholder="Enter group title (max 100 characters)"
            maxLength={100}
          />
        </Form.Item>

        {/* Optional description field */}
        {/* <Form.Item 
          name="description" 
          label="Description (optional)"
          className="styled-form-item"
        >
          <Input.TextArea
            className="styled-input"
            placeholder="Add a description for this group"
            maxLength={500}
            rows={3}
          />
        </Form.Item> */}

        <div className="members-title">Members</div>
        <Form.Item name="users">
          <MemberSelect
            placeholder="Type a name or UNDP email to search and select users"
            value={initialValues.users || []}
          />
        </Form.Item>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '24px' }}>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="save-button"
          >
            {submitButtonText}
            <svg width="10" height="16" viewBox="0 0 10 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <title>Right arrow</title>
              <path d="M1.5 1L8.5 8L1.5 15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default GenericGroupModal;