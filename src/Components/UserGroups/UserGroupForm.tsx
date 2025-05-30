import { useState } from 'react';
import { Button, Form, Input } from 'antd';
import MemberSelect from '../MemberSelect';

export interface UserGroupFormValues {
  name: string;
  users: string[];
  admins?: string[];
  description?: string;
}

export interface UserGroupFormProps {
  onSubmit: (values: UserGroupFormValues) => Promise<void>;
  initialValues?: {
    name?: string;
    users?: string[];
    admins?: string[];
    description?: string;
  };
  submitButtonText?: string;
  modalMode?: boolean;
  loading?: boolean;
}

const UserGroupForm: React.FC<UserGroupFormProps> = ({
  onSubmit,
  initialValues = { name: '', users: [], admins: [], description: '' },
  submitButtonText = 'Save Group & Send Invites',
  modalMode = true,
  loading: externalLoading,
}) => {
  const [form] = Form.useForm();
  const [internalLoading, setInternalLoading] = useState(false);

  const loading = externalLoading !== undefined ? externalLoading : internalLoading;

  const handleSubmit = async (values: UserGroupFormValues) => {
    setInternalLoading(true);
    try {
      // Trim the name before submission
      const trimmedValues = {
        ...values,
        name: values.name?.trim(),
        description: values.description?.trim(),
      };
      await onSubmit(trimmedValues);
      if (modalMode) {
        form.resetFields();
      }
    } finally {
      setInternalLoading(false);
    }
  };

  return (
    <Form
      form={form}
      layout='vertical'
      onFinish={handleSubmit}
      initialValues={initialValues}
      validateTrigger={['onChange', 'onBlur']}
      className={modalMode ? undefined : 'undp-form'}
    >
      <Form.Item
        name='name'
        label={
          modalMode ? (
            'Group Title'
          ) : (
            <span className='undp-form-label'>Group Title*</span>
          )
        }
        className={modalMode ? 'styled-form-item' : undefined}
        rules={[
          {
            required: true,
            whitespace: true,
            message: 'Please enter a group title',
          },
        ]}
        validateTrigger={['onChange', 'onBlur']}
      >
        <Input
          className={modalMode ? 'styled-input' : 'undp-input'}
          placeholder='Enter group title (max 100 characters)'
          maxLength={100}
          style={
            !modalMode
              ? {
                  border: '2px solid #000',
                  borderRadius: 0,
                  padding: '8px 12px',
                  fontSize: '16px',
                }
              : undefined
          }
        />
      </Form.Item>
      <>
        <div className={modalMode ? 'members-title' : 'undp-form-label'}>
          {modalMode ? 'Members' : 'Add Members*'}
        </div>
        <Form.Item
          name='users'
          rules={[
            {
              required: false,
              message: 'Please select at least one member',
            },
          ]}
        >
          <MemberSelect
            placeholder='Type a name or UNDP email to search and select users'
            label='Group Members'
          />
        </Form.Item>
      </>

      <div
        style={{
          display: 'flex',
          justifyContent: modalMode ? 'center' : 'flex-start',
          marginTop: '24px',
        }}
      >
        <Button
          type='primary'
          htmlType='submit'
          loading={loading}
          className={modalMode ? 'save-button' : undefined}
          style={
            !modalMode
              ? {
                  background: '#006EB5',
                  borderRadius: 0,
                  border: 'none',
                  height: 'auto',
                  padding: '16px 24px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                }
              : undefined
          }
        >
          {submitButtonText}
          {modalMode && (
            <svg
              width='10'
              height='16'
              viewBox='0 0 10 16'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
              aria-hidden='true'
            >
              <title>Right arrow</title>
              <path
                d='M1.5 1L8.5 8L1.5 15'
                stroke='white'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
          )}
        </Button>
      </div>

      {!modalMode && (
        <style>{`
          .undp-form-label {
            font-family: 'Proxima Nova', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 20px;
            font-weight: 400;
            line-height: 1.4;
          }
          
          .undp-form .ant-select-selection-item {
            background-color: #F7F7F7 !important;
            border: 1px solid #D4D6D8 !important;
            border-radius: 0 !important;
            padding: 4px 8px !important;
          }
          
          .undp-form .ant-select-selection-item-remove {
            color: #000 !important;
          }
          
          .undp-form .ant-select-dropdown {
            border-radius: 0 !important;
          }
          
          .undp-form .ant-select-item {
            padding: 10px 12px !important;
            font-family: 'Proxima Nova', sans-serif;
            border-bottom: 1px solid #D4D6D8;
          }
          
          .undp-form .ant-select-item-option-selected {
            font-weight: 600;
            background-color: #F7F7F7 !important;
          }
        `}</style>
      )}
    </Form>
  );
};

export default UserGroupForm;
