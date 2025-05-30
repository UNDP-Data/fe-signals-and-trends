import { useState, useContext } from 'react';
import { Button, Form, Input, message } from 'antd';
import Context from '../../Context/Context';
import MemberSelect from '../MemberSelect';
// import UserSelect from './UserSelect'; // Commented out this import
import { UserGroupDataType } from '../../Types';
import { createUserGroup, updateUserGroup } from '../../API/userCalls';
import type { UserGroupResponseDataType } from '../../API/userCalls';
import { logger } from '../../logger';

export interface UserGroupFormProps {
  onClose: () => void;
  onSuccess?: (values?: { name: string; users: string[]; description?: string }) => void;
  initialValues?: {
    name?: string;
    users?: string[];
    admins?: string[];
    description?: string;
  };
  group?: UserGroupDataType;
  submitButtonText?: string;
  modalMode?: boolean;
}

const UserGroupForm: React.FC<UserGroupFormProps> = ({
  onClose,
onSuccess,
  initialValues = { name: '', users: [], admins: [], description: '' },
  group,
  submitButtonText = 'Save Group & Send Invites',
  modalMode = true,
}) => {
  const [form] = Form.useForm();
  const { userGroups, updateUserGroups, userID } = useContext(Context);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: {
    name: string;
    users: string[];
    admins?: string[];
    description?: string;
  }) => {
    setLoading(true);
    try {
      // For creating a new group, we need to convert user IDs to integers
      const submitData = {
        name: values.name,
        user_ids: values.users ? values.users.map(id => parseInt(id, 10)) : [],
      };

      let user_ids = [...submitData.user_ids]
      if (userID) {
        user_ids.push(userID)
      }

      if (group) {
        // Update existing group
        const updatedGroupData: UserGroupResponseDataType = {
          id: group.id,
          name: submitData.name,
          user_ids,
          signal_ids: group.signal_ids,
          collaborator_map: group.collaborator_map,
        };
        const updatedGroup = await updateUserGroup(group.id, updatedGroupData);
        if (userGroups) {
          const mappedUserGroups = userGroups.map(g => {
            if (g.id === group.id) {
              return {
                ...g,
                ...updatedGroup,
                user_ids: updatedGroup.user_ids || g.user_ids,
                users: g.users,
              };
            }
            return g;
          });
          updateUserGroups(mappedUserGroups);
        }
        message.success(`Group "${values.name}" has been updated.`);
      } else {
        // Create new group
        const newGroup = await createUserGroup(submitData);

        // Convert to UserGroupDataType format for compatibility
        const newGroupData: UserGroupDataType = {
          ...newGroup,
          user_ids: newGroup.user_ids || [],
          signal_ids: [],
          collaborator_map: {},
        };

        updateUserGroups(
          userGroups ? [...userGroups, newGroupData] : [newGroupData],
        );
        message.success(`Group "${values.name}" has been created.`);
        form.resetFields();
      }

      if (onSuccess) {
        onSuccess(values);
      }

      if (modalMode) {
        form.resetFields();
        onClose();
      }
    } catch (error) {
      message.error(
        `Failed to ${group ? 'update' : 'create'} the group. Please try again.`,
      );
      logger.error('Failed to create/update group:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      form={form}
      layout='vertical'
      onFinish={values => {
        // Trim the name before submission
        const trimmedValues = {
          ...values,
          name: values.name?.trim(),
          description: values.description?.trim(),
        };
        handleSubmit(trimmedValues);
      }}
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
