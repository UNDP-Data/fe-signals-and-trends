import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
} from '@azure/msal-react';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { createUserGroup } from '../API/userCalls';
import { SignInButton } from '../Components/SignInButton';
import Context from '../Context/Context';
import UserGroupForm from '../Components/UserGroups/UserGroupForm';

export function AddNewSprintEl() {
  const navigate = useNavigate();
  const { userName } = useContext(Context);
  const [messageApi, contextHolder] = message.useMessage();

  // Handler for successful form submission
  const handleSuccess = async (values?: { name: string; users: string[]; description?: string }) => {
    if (!values || !values.name) {
      messageApi.error('Sprint name is required.');
      return;
    }
    try {
      messageApi.loading('Creating your sprint...');
      
      const submitData = {
        name: values.name,
        users: values.users || [],
      };
      
      // Create the sprint/user group
      const newGroup = await createUserGroup(submitData);
      
      messageApi.success(`Sprint "${values.name}" has been created successfully!`);
      
      // Redirect to the new sprint page
      // Create a URL-friendly slug from the name
      const sprintSlug = values.name.toLowerCase()
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-')     // Replace spaces with hyphens
        .trim();
      
      // Navigate to the new sprint page
      navigate(`/sprint/${sprintSlug}-${newGroup.id}`);
    } catch (error) {
      console.error('Error creating sprint:', error);
      messageApi.error('Failed to create the sprint. Please try again.');
    }
  };

  return (
    <div
      className='undp-container flex-wrap margin-bottom-09'
      style={{ maxWidth: '64rem', padding: '0 2rem', marginTop: '10rem' }}
    >
      {contextHolder}
      <AuthenticatedTemplate>
        <button
          className='undp-button button-tertiary'
          type='button'
          onClick={() => {
            navigate(-1);
          }}
        >
          ← Back
        </button>
        <h3 className='undp-typography margin-top-05'>Add New Sprint</h3>
        <div className='margin-top-07'>
          <UserGroupForm
            onClose={() => navigate('/my-sprints')}
            onSuccess={handleSuccess}
            initialValues={{ 
              name: '', 
              users: userName ? [userName] : [] // Add current user by default
            }}
            submitButtonText='Create Sprint'
            modalMode={false}
          />
        </div>
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <div
          className='flex-div flex-wrap flex-hor-align-center'
          style={{ flexDirection: 'column' }}
        >
          <h6 className='undp-typography margin-bottom-03'>
            Please login to create a new sprint
          </h6>
          <SignInButton />
        </div>
      </UnauthenticatedTemplate>
    </div>
  );
}