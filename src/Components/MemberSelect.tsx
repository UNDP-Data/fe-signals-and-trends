import { useState, useEffect } from 'react';
import { Form, Input, Select, message } from 'antd';
import { searchUsers } from '../API/userCalls';
import './MemberSelect.css';

interface User {
  id: number;
  created_at: string;
  email: string;
  role: string;
  name: string;
  unit: string | null;
  acclab: boolean | null;
}

interface MemberSelectProps {
  value?: string[] | User[];
  onChange?: (value: string[]) => void;
  placeholder?: string;
}

const MemberSelect: React.FC<MemberSelectProps> = ({
  value = [],
  onChange,
  placeholder = "Type a name or UNDP email to search and select users"
}) => {
  const [searchLoading, setSearchLoading] = useState(false);
  const [userOptions, setUserOptions] = useState<{ label: string; value: string }[]>([]);
  const [searchValue, setSearchValue] = useState('');

  // Format value to ensure it's always a string[] for the Select component
  const formattedValue = Array.isArray(value)
    ? value.map(item => typeof item === 'string' ? item : item.email)
    : [];

  // Load initial users
  useEffect(() => {
    fetchUsers();
  }, []);

  // Function to fetch users based on search query
  const fetchUsers = async (query?: string) => {
    setSearchLoading(true);
    try {
      const response = await searchUsers({
        per_page: 100,
        query: query || undefined
      });

      const options = response.data.map(user => ({
        label: `${user.name} (${user.email})`,
        value: user.email,
      }));

      setUserOptions(options);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      message.error('Failed to fetch users. Please try again.');
    } finally {
      setSearchLoading(false);
    }
  };

  // Debounced search function
  const handleSearch = async (value: string) => {
    setSearchValue(value);
    if (value.trim().length > 1) {
      await fetchUsers(value.trim());
    } else if (value.trim() === '') {
      await fetchUsers();
    }
  };

  const handleChange = (newValue: string[]) => {
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <div className="member-select-container">
      <Form.Item
        className="member-select-form-item"
      >
        <Select
          className="member-select"
          mode="multiple"
          placeholder={placeholder}
          options={userOptions}
          optionFilterProp="label"
          showSearch
          loading={searchLoading}
          filterOption={false}
          onSearch={handleSearch}
          notFoundContent={searchLoading ? "Searching..." : "No users found"}
          listHeight={280}
          value={formattedValue}
          onChange={handleChange}
        />
      </Form.Item>
    </div>
  );
};

export default MemberSelect;
