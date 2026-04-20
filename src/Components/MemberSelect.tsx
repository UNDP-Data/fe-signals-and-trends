import { useState, useContext } from 'react';
import { Form, Input, Select, message } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { searchUsers } from '../API/userCalls';
import './MemberSelect.css';
import { logger } from '../logger';
import Context from '../Context/Context';

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
  value?: string[];
  onChange?: (value: string[]) => void;
  placeholder?: string;
  isAdminSelect?: boolean;
  label?: string;
}

const MemberSelect: React.FC<MemberSelectProps> = ({
  value = [],
  onChange,
  placeholder = "Type a name or UNDP email to search and select users",
  isAdminSelect = false,
  label
}) => {
  const [searchValue, setSearchValue] = useState('');
  const { userID, } = useContext(Context);

  // Use React Query to fetch initial users
  const { data: initialUsers, isLoading: isInitialLoading } = useQuery({
    queryKey: ['users', 'initial'],
    queryFn: async () => {
      const response = await searchUsers({
        per_page: 100
      });
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Use React Query for search with debouncing
  const { data: searchedUsers, isLoading: isSearchLoading } = useQuery({
    queryKey: ['users', 'search', searchValue],
    queryFn: async () => {
      const response = await searchUsers({
        per_page: 100,
        query: searchValue
      });
      return response.data;
    },
    enabled: searchValue.trim().length > 1,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

  // Determine which users to show
  let users = searchValue.trim().length > 1 ? searchedUsers : initialUsers;
  users = users?.filter(user => user.id !== userID);

  value = value.filter(id => id !== userID?.toString());

  const isLoading = searchValue.trim().length > 1 ? isSearchLoading : isInitialLoading;

  // Format users for Select options
  const userOptions = (users || []).map(user => ({
    label: `${user.name} (${user.email})`,
    value: user.id.toString(),
  })).filter(option => option.value !== userID?.toString());

  // Handle search input
  const handleSearch = (value: string) => {
    setSearchValue(value);
  };

  const handleChange = (newValue: string[]) => {
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <div className={`member-select-container ${isAdminSelect ? 'admin-select' : ''}`}>
      {label && (
        <div className="member-select-label">
          {label}
          {isAdminSelect && <span className="admin-indicator"> (Admin)</span>}
        </div>
      )}
      <Form.Item
        className={`member-select-form-item ${isAdminSelect ? 'admin-select-form-item' : ''}`}
      >
        <Select
          className={`member-select ${isAdminSelect ? 'admin-select-input' : ''}`}
          mode="multiple"
          placeholder={placeholder}
          options={userOptions}
          optionFilterProp="label"
          showSearch
          loading={isLoading}
          filterOption={false}
          onSearch={handleSearch}
          notFoundContent={isLoading ? "Searching..." : "No users found"}
          listHeight={100}
          value={value}
          onChange={handleChange}
          maxTagCount={isAdminSelect ? 1 : undefined}
          dropdownStyle={{ minWidth: 400, maxWidth: 600 }}
        />
      </Form.Item>
    </div>
  );
};

export default MemberSelect;
