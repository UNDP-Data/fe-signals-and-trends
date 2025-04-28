import { useState, useContext, useEffect } from 'react';
import { Modal, Tabs, Button, Form, Input, Select, message } from 'antd';
import { SearchOutlined, CloseOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import Context from '../../Context/Context';
import { UserGroupDataType } from '../../Types';
import { createUserGroup, searchUsers } from '../../API/userCalls';

interface CreateGroupModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const StyledModal = styled(Modal)`
  .ant-modal-content {
    border-radius: 0;
  }
  
  .ant-modal-header {
    border-radius: 0;
    background-color: #FFFFFF;
    border-bottom: none;
    padding: 24px 24px 0;
  }
  
  .ant-modal-title {
    font-family: 'Proxima Nova', sans-serif;
    font-weight: 600;
    font-size: 25px;
    line-height: 1.15;
    color: rgba(0, 0, 0, 0.88);
  }
  
  .ant-modal-body {
    padding: 24px;
  }
  
  .ant-modal-footer {
    border-top: none;
    padding: 0 24px 24px;
  }

  .ant-tabs-tab {
    text-transform: uppercase;
    font-weight: 700;
    font-size: 16px;
    padding: 12px 16px;
  }

  .ant-tabs-tab-active {
    position: relative;
  }

  .ant-tabs-tab-active::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background-color: #E5243B;
  }

  .ant-tabs-ink-bar {
    background-color: transparent;
  }
  
  .close-button {
    position: absolute;
    top: 20px;
    right: 20px;
    z-index: 10;
    background: transparent;
    border: none;
    font-size: 20px;
    color: rgba(0, 0, 0, 0.45);
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    padding: 0;
    border-radius: 4px;
    
    &:hover {
      background-color: rgba(0, 0, 0, 0.05);
    }
  }
`;

const SearchButton = styled(Button)`
  background-color: #006EB5;
  color: white;
  border-radius: 0;
  border: none;
  height: auto;
  padding: 8px 16px;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover, &:focus {
    background-color: #005A8F;
    color: white;
  }
`;

const SaveButton = styled(Button)`
  background-color: #006EB5;
  color: white;
  border-radius: 0;
  border: none;
  height: auto;
  padding: 16px 24px;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  
  &:hover, &:focus {
    background-color: #005A8F;
    color: white;
  }
`;

const GroupTitle = styled.div`
  font-family: 'Proxima Nova', sans-serif;
  font-size: 20px;
  font-weight: 400;
  line-height: 1.4;
  color: #000000;
  margin-bottom: 4px;
`;

const StyledInput = styled(Input)`
  border: 2px solid #000000;
  border-radius: 0;
  padding: 8px 12px;
  font-size: 16px;
  height: auto;
  
  &::placeholder {
    color: rgba(0, 0, 0, 0.25);
  }
`;

const StyledFormItem = styled(Form.Item)`
  margin-bottom: 24px;
`;

const MembersTitle = styled.div`
  font-family: 'Proxima Nova', sans-serif;
  font-size: 20px;
  font-weight: 400;
  line-height: 1.4;
  color: #000000;
  margin-bottom: 2px;
`;

const SearchContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
`;

export const CreateGroupModal: React.FC<CreateGroupModalProps> = ({
  visible,
  onClose,
  onSuccess
}) => {
  const [form] = Form.useForm();
  const { userGroups, updateUserGroups } = useContext(Context);
  const [activeTab, setActiveTab] = useState('2'); // Default to 'Create a new group'
  const [loading, setLoading] = useState(false);
  const [userOptions, setUserOptions] = useState<{ label: string; value: string }[]>([]);
  const [searchValue, setSearchValue] = useState('');

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

    if (visible) {
      fetchUsers();
    }
  }, [visible]);

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

  const handleSearch = () => {
    // Implement search functionality here
    console.log('Searching for:', searchValue);
  };

  return (
    <StyledModal
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
      
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        className="undp-tabs"
        items={[
          {
            key: '1',
            label: 'Select Members from the existing Group',
            disabled: true,
            children: null
          },
          {
            key: '2',
            label: 'Create a new group',
            children: (
              <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={{ users: [] }}
              >
                <StyledFormItem name="name" required={false}>
                  <GroupTitle>Group Title*</GroupTitle>
                  <StyledInput
                    placeholder="Enter group title (max 100 characters)"
                    maxLength={100}
                  />
                </StyledFormItem>

                <StyledFormItem name="users" required={false}>
                  <MembersTitle>Add Members*</MembersTitle>
                  <SearchContainer>
                    <StyledInput 
                      placeholder="Type a name or UNDP email to search"
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      style={{ flex: 1 }}
                      onPressEnter={handleSearch}
                    />
                    <SearchButton onClick={handleSearch}>
                      Search
                    </SearchButton>
                  </SearchContainer>
                  <Select
                    mode="multiple"
                    placeholder="Select users"
                    style={{ width: '100%' }}
                    options={userOptions}
                    optionFilterProp="label"
                    showSearch
                    filterOption={(input, option) =>
                      (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    listHeight={280}
                  />
                </StyledFormItem>

                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '24px' }}>
                  <SaveButton
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                  >
                    Save Group & Send Invites
                    <svg width="10" height="16" viewBox="0 0 10 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <title>Right arrow</title>
                      <path d="M1.5 1L8.5 8L1.5 15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </SaveButton>
                </div>
              </Form>
            ),
          },
        ]}
      />
    </StyledModal>
  );
};

export default CreateGroupModal; 