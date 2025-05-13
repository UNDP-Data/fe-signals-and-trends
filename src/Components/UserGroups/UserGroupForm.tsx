import { useContext, useState, useEffect } from 'react';
import { Form, Input, Button, Select, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Context from '../../Context/Context';
import type { UserDataType, UserGroupDataType } from '../../Types';
import { createUserGroup, updateUserGroup, searchUsers } from '../../API/userCalls';
import type { UserGroupResponseDataType } from '../../API/userCalls';
import { logger } from '../../logger';

interface UserOption {
  label: string;
  value: string;
  email: string;
}

interface UserGroupFormProps {
  group?: UserGroupDataType;
  onSuccess?: () => void;
}

export const UserGroupForm = ({ group, onSuccess }: UserGroupFormProps) => {
  const [form] = Form.useForm();
  const { userGroups, updateUserGroups } = useContext(Context);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const [userOptions, setUserOptions] = useState<UserOption[]>([]);
  
  // Fetch user details for existing group members on initial load
  useEffect(() => {
    const fetchInitialUsers = async () => {
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
  }, [group, form]);

  const handleSearch = async (value: string) => {
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
  };

  const handleSubmit = async (values: { name: string; users?: string[] }) => {
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
    } catch (error) {
      message.error(`Failed to ${group ? 'update' : 'create'} the group. Please try again.`);
      logger.error('Failed to create/update group:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={{ users: [] }}
      className="undp-form"
    >
      <Form.Item
        name="name"
        label={<span className="undp-form-label">Group Title*</span>}
        rules={[{ required: true, message: 'Please enter a group name' }]}
      >
        <Input 
          placeholder="Enter group name" 
          className="undp-input"
          style={{ 
            border: '2px solid #000', 
            borderRadius: 0, 
            padding: '8px 12px',
            fontSize: '16px'
          }}
        />
      </Form.Item>

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

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          style={{ 
            background: '#006EB5', 
            borderRadius: 0,
            border: 'none',
            height: 'auto',
            padding: '16px 24px',
            fontSize: '16px',
            fontWeight: 'bold',
            letterSpacing: '0.05em',
            textTransform: 'uppercase'
          }}
        >
          {group ? 'Update Group & Send Invites' : 'Save Group & Send Invites'}
        </Button>
      </Form.Item>

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
    </Form>
  );
}; 