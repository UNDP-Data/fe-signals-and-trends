import { useState, useContext, useEffect } from 'react';
import { Modal, Button, Form, Input, Select, message } from 'antd';
import { CloseOutlined, SearchOutlined } from '@ant-design/icons';
import Context from '../../Context/Context';
import MemberSelect from '../MemberSelect';
import { UserDataType, UserGroupDataType } from '../../Types';
import { searchUsers, createUserGroup, updateUserGroup } from '../../API/userCalls';
import type { UserGroupResponseDataType } from '../../API/userCalls';
import { logger } from '../../logger';
import './CreateGroupModal.css';

interface UserOption {
  label: string;
  value: string;
  email: string;
}

export interface GenericGroupModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  title?: string;
  initialValues?: {
    name?: string;
    users?: string[];
    admins?: string[];
    description?: string;
  };
  group?: UserGroupDataType;
  submitButtonText?: string;
  modalMode?: boolean;
  useMemberSelect?: boolean;
}

export const GenericGroupModal: React.FC<GenericGroupModalProps> = ({
  visible,
  onClose,
  onSuccess,
  title = 'Add Collaborator',
  initialValues = { name: '', users: [], admins: [], description: '' },
  group,
  submitButtonText = 'Save Group & Send Invites',
  modalMode = true,
  useMemberSelect = true
}) => {
  const [form] = Form.useForm();
  const { userGroups, updateUserGroups } = useContext(Context);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const [userOptions, setUserOptions] = useState<UserOption[]>([]);

  // Fetch user details for existing group members on initial load when not using MemberSelect
  useEffect(() => {
    const fetchInitialUsers = async () => {
      if (!visible || useMemberSelect) return;
      if (!group || !group.user_ids || group.user_ids.length === 0) return;
      
      setInitialLoading(true);
      try {
        // Fetch all users at once with a larger page size
        const response = await searchUsers({ per_page: 100 });
        const allUsers = response.data;
        
        // Filter the users that are in the group
        const groupUsers = allUsers.filter((user: UserDataType) => 
          group.user_ids?.includes(user.id)
        );
        
        if (groupUsers.length > 0) {
          // Create options for the select with proper labels and values
          const options = groupUsers.map((user: UserDataType) => ({
            label: user.name,
            value: user.email,
            // Keep email in a searchable property for filtering
            email: user.email
          }));
          
          setUserOptions(options);
          
          // Set form values with emails instead of IDs
          form.setFieldsValue({
            name: group.name,
            users: groupUsers.map((user: UserDataType) => user.email),
          });
        } else {
          // If no matching users are found, just set the name
          form.setFieldsValue({
            name: group.name,
            users: [],
          });
        }
      } catch (error) {
        logger.error('Failed to fetch initial users:', error);
        form.setFieldsValue({
          name: group.name,
          users: [],
        });
      } finally {
        setInitialLoading(false);
      }
    };

    fetchInitialUsers();
  }, [group, form, visible, useMemberSelect]);

  // Reset form and set initial values when modal opens or initialValues change
  useEffect(() => {
    if (visible) {
      form.resetFields();
      
      // Set fields from initialValues or group
      if (group) {
        // Group takes precedence if provided
        form.setFieldsValue({
          name: group.name || '',
          users: group.users ? group.users.map(u => u.email) : []
        });
      } else if (initialValues) {
        const fieldsToSet: Record<string, any> = {};
        if (initialValues.name) fieldsToSet.name = initialValues.name;
        if (initialValues.users) fieldsToSet.users = initialValues.users;
        if (initialValues.admins) fieldsToSet.admins = initialValues.admins;
        if (initialValues.description) fieldsToSet.description = initialValues.description;
        
        if (Object.keys(fieldsToSet).length > 0) {
          form.setFieldsValue(fieldsToSet);
        }
      }
    }
  }, [visible, form, initialValues, group]);

  const handleSearch = async (value: string) => {
    if (!useMemberSelect && visible) {
      if (!value) {
        // Don't clear options if we have initial values loaded
        if (!group || userOptions.length === 0) {
          setUserOptions([]);
        }
        return;
      }
      
      setFetching(true);
      try {
        const response = await searchUsers({ 
          per_page: 20,
          query: value 
        });
        
        const options = response.data.map((user: UserDataType) => ({
          label: user.name,
          value: user.email,
          // Keep email in a searchable property for filtering
          email: user.email
        }));
        
        setUserOptions(options);
      } catch (error) {
        logger.error('Failed to fetch users:', error);
      } finally {
        setFetching(false);
      }
    }
  };

  const handleSubmit = async (values: { name: string; users: string[]; admins?: string[]; description?: string }) => {
    setLoading(true);
    try {
      const submitData = {
        name: values.name,
        users: values.users || [],
      };
      
      if (group) {
        // Update existing group
        const updatedGroupData: UserGroupResponseDataType = {
          id: group.id,
          name: submitData.name,
          users: submitData.users,
          // Include other properties that may be needed for the API
          user_ids: group.user_ids,
          signal_ids: group.signal_ids,
          collaborator_map: group.collaborator_map
        };
        const updatedGroup = await updateUserGroup(group.id, updatedGroupData);
        if (userGroups) {
          const mappedUserGroups = userGroups.map(g => {
            if (g.id === group.id) {
              return {
                ...g, 
                ...updatedGroup,
                user_ids: updatedGroup.user_ids || g.user_ids,
                users: g.users
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
        
        // Remove users property if present (from API response)
        const { users, ...newGroupWithoutUsers } = newGroup;
        // Convert to UserGroupDataType format for compatibility
        const newGroupData: UserGroupDataType = {
          ...newGroupWithoutUsers,
          user_ids: newGroup.user_ids || [],
          signal_ids: [],
          collaborator_map: {},
        };
        
        updateUserGroups(userGroups ? [...userGroups, newGroupData] : [newGroupData]);
        message.success(`Group "${values.name}" has been created.`);
        form.resetFields();
      }
      
      if (onSuccess) {
        onSuccess();
      }
      
      if (modalMode) {
        form.resetFields();
        onClose();
      }
    } catch (error) {
      message.error(`Failed to ${group ? 'update' : 'create'} the group. Please try again.`);
      logger.error('Failed to create/update group:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderForm = () => (
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
      initialValues={{ users: [], admins: [] }}
      validateTrigger={['onChange', 'onBlur']}
      className={modalMode ? undefined : "undp-form"}
    >
      <Form.Item 
        name="name" 
        label={modalMode ? "Group Title" : <span className="undp-form-label">Group Title*</span>}
        className={modalMode ? "styled-form-item" : undefined}
        rules={[{ 
          required: true, 
          whitespace: true,
          message: 'Please enter a group title'
        }]}
        validateTrigger={['onChange', 'onBlur']}
      >
        <Input
          className={modalMode ? "styled-input" : "undp-input"}
          placeholder="Enter group title (max 100 characters)"
          maxLength={100}
          style={!modalMode ? { 
            border: '2px solid #000', 
            borderRadius: 0, 
            padding: '8px 12px',
            fontSize: '16px'
          } : undefined}
        />
      </Form.Item>

      {/* Users selection using either MemberSelect or custom Select */}
      {useMemberSelect ? (
        <>
          <div className={modalMode ? "members-title" : "undp-form-label"}>
            {modalMode ? "Members" : "Add Members*"}
          </div>
          <Form.Item 
            name="users"
            rules={[
              { 
                required: false,
                message: 'Please select at least one member'
              }
            ]}
          >
            <MemberSelect
              placeholder="Type a name or UNDP email to search and select users"
              value={group?.users ? group.users.map(u => u.email) : initialValues.users || []}
              label="Group Members"
            />
          </Form.Item>
        </>
      ) : (
        <Form.Item
          name="users"
          label={<span className="undp-form-label">Add Members*</span>}
          rules={[
            { 
              required: false,
              message: 'Please select at least one member'
            }
          ]}
        >
          <Select
            mode="multiple"
            placeholder="Type a name or UNDP email to search"
            style={{ 
              width: '100%',
              fontSize: '16px'
            }}
            options={userOptions}
            showSearch
            className="undp-select"
            filterOption={false}
            onSearch={handleSearch}
            notFoundContent={
              initialLoading || fetching 
                ? "Loading..." 
                : userOptions.length === 0 
                  ? "Type to search users" 
                  : "No users found"
            }
            suffixIcon={<SearchOutlined />}
            listHeight={280}
            listItemHeight={40}
            loading={initialLoading || fetching}
            optionRender={(option) => (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span>{option.label}</span>
                <span style={{ fontSize: '12px', color: '#666' }}>{option.data.email}</span>
              </div>
            )}
          />
        </Form.Item>
      )}

      <div style={{ 
        display: 'flex', 
        justifyContent: modalMode ? 'center' : 'flex-start', 
        marginTop: '24px' 
      }}>
        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          className={modalMode ? "save-button" : undefined}
          style={!modalMode ? { 
            background: '#006EB5', 
            borderRadius: 0,
            border: 'none',
            height: 'auto',
            padding: '16px 24px',
            fontSize: '16px',
            fontWeight: 'bold',
            letterSpacing: '0.05em',
            textTransform: 'uppercase'
          } : undefined}
        >
          {submitButtonText}
          {modalMode && (
            <svg width="10" height="16" viewBox="0 0 10 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <title>Right arrow</title>
              <path d="M1.5 1L8.5 8L1.5 15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
        {renderForm()}
      </Modal>
    );
  }

  return renderForm();
};

export default GenericGroupModal;