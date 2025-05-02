import { useContext, useState, useEffect } from 'react';
import { Form, Input, Button, Select, message } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import Context from '../../Context/Context';
import type { UserGroupDataType } from '../../Types';
import { createUserGroup, updateUserGroup, searchUsers } from '../../API/userCalls';

interface UserGroupFormProps {
  group?: UserGroupDataType;
  onSuccess?: () => void;
}

export const UserGroupForm = ({ group, onSuccess }: UserGroupFormProps) => {
  const [form] = Form.useForm();
  const { userGroups, updateUserGroups } = useContext(Context);
  const [loading, setLoading] = useState(false);
  const [userOptions, setUserOptions] = useState<{ label: string; value: string }[]>([]);
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    if (group) {
      form.setFieldsValue({
        name: group.name,
        users: group.users,
      });
    }
  }, [group, form]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await searchUsers({ per_page: 100 });
        const options = response.data.map(user => ({
          label: `${user.name} (${user.email})`,
          value: user.email,
        }));
        setUserOptions(options);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleSubmit = async (values: { name: string; users: string[] }) => {
    setLoading(true);
    try {
      if (group) {
        // Update existing group
        const updatedGroup = await updateUserGroup(group.id, values);
        if (userGroups) {
          updateUserGroups(
            userGroups.map(g => (g.id === group.id ? updatedGroup : g))
          );
        }
        message.success(`Group "${values.name}" has been updated.`);
      } else {
        // Create new group
        const newGroup = await createUserGroup(values);
        updateUserGroups(userGroups ? [...userGroups, newGroup] : [newGroup]);
        message.success(`Group "${values.name}" has been created.`);
        form.resetFields();
      }
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      message.error(`Failed to ${group ? 'update' : 'create'} the group. Please try again.`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Handle search input changes
  const handleSearchChange = (value: string) => {
    setSearchValue(value);
  };

  // Filter options based on search value
  const filteredOptions = searchValue
    ? userOptions.filter(option => 
        option.label.toLowerCase().includes(searchValue.toLowerCase()))
    : userOptions;

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
        rules={[{ required: true, message: 'Please select at least one member' }]}
      >
        <div className="undp-select-container">
          <Input
            placeholder="Type a name or UNDP email to search"
            value={searchValue}
            onChange={(e) => handleSearchChange(e.target.value)}
            style={{ 
              border: '2px solid #000', 
              borderRadius: 0, 
              padding: '8px 12px',
              marginBottom: '12px',
              fontSize: '16px'
            }}
            suffix={<SearchOutlined />}
          />
          <Select
            mode="multiple"
            placeholder="Select users"
            style={{ 
              width: '100%',
              fontSize: '16px'
            }}
            options={filteredOptions}
            optionFilterProp="label"
            showSearch
            className="undp-select"
            listHeight={280}
            listItemHeight={40}
          />
        </div>
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