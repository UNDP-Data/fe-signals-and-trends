import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { createUserGroup } from '../API/userCalls';
import Context from '../Context/Context';
import UserGroupForm, { UserGroupFormValues } from '../Components/UserGroups/UserGroupForm';
import { UserGroupDataType } from '../Types';
import { logger } from '../logger';

export function AddNewSprintEl() {
  const navigate = useNavigate();
  const { userID, userGroups, updateUserGroups } = useContext(Context);
  const [loading, setLoading] = useState(false);

  // Handler for form submission
  const handleSubmit = async (values: UserGroupFormValues) => {
    setLoading(true);
    try {
      // Convert user IDs to integers
      const submitData = {
        name: values.name,
        user_ids: values.users ? values.users.map(id => parseInt(id, 10)) : [],
      };

      // Add current user to the group if they're not already included
      const user_ids = [...submitData.user_ids];
      if (userID && !user_ids.includes(userID)) {
        user_ids.push(userID);
      }

      // Create the sprint/user group
      const newGroup = await createUserGroup({ ...submitData, user_ids });

      // Convert to UserGroupDataType format for compatibility
      const newGroupData: UserGroupDataType = {
        ...newGroup,
        user_ids: newGroup.user_ids || [],
        signal_ids: [],
        collaborator_map: {},
      };

      // Update context with new group
      updateUserGroups(
        userGroups ? [...userGroups, newGroupData] : [newGroupData],
      );

      message.success(`Sprint "${values.name}" has been created successfully!`);
      
      // Redirect to the new sprint page
      // Create a URL-friendly slug from the name
      const sprintSlug = values.name.toLowerCase()
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-')     // Replace spaces with hyphens
        .trim();
      
      // Navigate to the new sprint page
      navigate(`/sprint/${sprintSlug}-${newGroup.id}`);
    } catch (error) {
      logger.error('Error creating sprint:', error);
      message.error('Failed to create the sprint. Please try again.');
      throw error; // Re-throw to let the form handle loading state
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h3 className='undp-typography margin-top-05'>Add New Sprint</h3>
      <div className='margin-top-07'>
        <UserGroupForm
          onSubmit={handleSubmit}
          initialValues={{ 
            name: '', 
            users: []
          }}
          submitButtonText='Create Sprint'
          modalMode={false}
          loading={loading}
        />
      </div>
    </>
  );
}