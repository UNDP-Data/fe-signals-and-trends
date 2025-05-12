import { useContext, useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Typography, Divider, Button, Skeleton, Row, Col, Avatar, Space, message, Modal } from 'antd';
import styled from 'styled-components';
import { 
  AuthenticatedTemplate,
  UnauthenticatedTemplate
} from '@azure/msal-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { SignInButton } from './Components/SignInButton';
import Context from './Context/Context';
import { getUserGroup, addSignalToUserGroup } from './API/userCalls';
import { searchSignals } from './API';
import { SprintCard } from './Components/SprintCard';
import { SignalSearch } from './Components/SignalSearch';
import type { UserGroupDataType, SignalDataType } from './Types';

const { Title, Text, Paragraph } = Typography;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const BackButton = styled(Button)`
  margin-right: 1rem;
`;

const CollaboratorAvatar = styled(Avatar)`
  background-color: #006EB5;
  cursor: pointer;
  
  &:hover {
    opacity: 0.8;
  }
`;

const SignalsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
`;

// Utility function to create a URL-friendly slug from a name
const createSprintSlug = (name: string): string => {
  if (!name) return '';
  return name.toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')     // Replace spaces with hyphens
    .trim();
};

export function SprintPage() {
  // Extract sprint ID from the URL path - get the last part after the last hyphen
  const { id: urlParam } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { userName } = useContext(Context);
  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();
  
  // Parse the ID from the URL parameter (last part after hyphen)
  const getSprintId = () => {
    if (!urlParam) return null;
    
    const parts = urlParam.split('-');
    const idPart = parts[parts.length - 1];
    
    // Check if the last part is a number
    const id = Number.parseInt(idPart, 10);
    if (Number.isNaN(id)) {
      messageApi.error('Invalid sprint ID in URL');
      return null;
    }
    
    return id;
  };
  
  const sprintId = getSprintId();
  
  // State for signal search modal
  const [isSignalSearchVisible, setIsSignalSearchVisible] = useState(false);

  // Fetch the user group details
  const sprintQuery = useQuery({
    queryKey: ['sprint', sprintId],
    queryFn: async (): Promise<UserGroupDataType> => {
      if (!sprintId) throw new Error('Sprint ID is required');
      
      try {
        const groupData = await getUserGroup(sprintId);
        
        return {
          ...groupData,
          user_ids: groupData.user_ids || [],
          signal_ids: groupData.signal_ids || [],
          collaborator_map: groupData.collaborator_map || {}
        };
      } catch (error) {
        console.error('Failed to fetch sprint details:', error);
        messageApi.error('Failed to load sprint details');
        throw error;
      }
    },
    enabled: !!sprintId && !!userName
  });

  // Check if URL needs to be updated with the correct title-id format
  useEffect(() => {
    if (sprintQuery.data?.name && sprintId) {
      const correctSlug = `${createSprintSlug(sprintQuery.data.name)}-${sprintId}`;
      
      // If URL doesn't match the correct format, update it
      if (urlParam !== correctSlug) {
        navigate(`/sprint/${correctSlug}`, { replace: true });
      }
    }
  }, [sprintQuery.data, sprintId, urlParam, navigate]);

  // Fetch signals associated with this sprint
  const signalsQuery = useQuery({
    queryKey: ['sprintSignals', sprintId],
    queryFn: async (): Promise<SignalDataType[]> => {
      if (!sprintId || !sprintQuery.data?.signal_ids?.length) return [];
      
      try {
        const response = await searchSignals({
          ids: sprintQuery.data.signal_ids,
          per_page: 100 // Fetch all signals for this sprint
        });
        
        return response.data;
      } catch (error) {
        console.error('Failed to fetch sprint signals:', error);
        messageApi.error('Failed to load sprint signals');
        return [];
      }
    },
    enabled: !!sprintQuery.data?.signal_ids?.length
  });

  // Handle back navigation
  const handleBack = () => {
    navigate('/my-sprints');
  };

  // Handle adding signals to sprint
  const handleAddSignal = () => {
    setIsSignalSearchVisible(true);
  };

  const handleSignalSelect = async (selectedSignals: SignalDataType[]) => {
    if (!sprintId || !selectedSignals.length) return;
    
    try {
      messageApi.loading('Adding signals to sprint...');
      
      // Process signals sequentially to avoid race conditions
      for (const signal of selectedSignals) {
        await addSignalToUserGroup(signal.id, sprintId);
      }
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['sprint', sprintId] });
      queryClient.invalidateQueries({ queryKey: ['sprintSignals', sprintId] });
      
      messageApi.success(`Successfully added ${selectedSignals.length} signal(s) to sprint`);
      setIsSignalSearchVisible(false);
    } catch (error) {
      console.error('Failed to add signals to sprint:', error);
      messageApi.error('Failed to add signals to sprint');
    }
  };

  return (
    <div className='margin-top-13 padding-top-09 margin-bottom-09 padding-left-1 padding-right-1'>
      {contextHolder}
      <AuthenticatedTemplate>
        <HeaderContainer>
          <div>
            <BackButton type="default" onClick={handleBack}>
              ← Back to Sprints
            </BackButton>
            {sprintQuery.isLoading ? (
              <Skeleton.Input active style={{ width: 300 }} />
            ) : (
              <Title level={2} className="undp-typography margin-top-05 margin-bottom-02 inline">
                {sprintQuery.data?.name || 'Sprint Details'}
              </Title>
            )}
          </div>
          
          <Button 
            type="primary" 
            style={{ backgroundColor: '#006EB5' }}
            onClick={() => {
              if (sprintQuery.data?.name && sprintId) {
                const slug = createSprintSlug(sprintQuery.data.name);
                navigate(`/sprint/${slug}-${sprintId}/edit`);
              }
            }}>
            Edit Sprint
          </Button>
        </HeaderContainer>

        {/* Sprint details */}
        {sprintQuery.isLoading ? (
          <Skeleton active paragraph={{ rows: 3 }} />
        ) : (
          <>
            <Paragraph className="undp-typography">
              {sprintQuery.data?.description || 'No description available for this sprint.'}
            </Paragraph>
            
            <Divider />
            
            <Title level={4} className="undp-typography margin-bottom-05">
              Collaborators
            </Title>
            
            <Space size="middle" wrap style={{ marginBottom: '2rem' }}>
              {/* Show avatar for each collaborator */}
              {sprintQuery.data?.user_ids?.length ? (
                sprintQuery.data.user_ids.map((userId, index) => (
                  <CollaboratorAvatar key={userId} size="large">
                    {index + 1}
                  </CollaboratorAvatar>
                ))
              ) : (
                <Text type="secondary">No collaborators added to this sprint</Text>
              )}
              
              <CollaboratorAvatar size="large" style={{ backgroundColor: '#8FC0E3' }}>
                +
              </CollaboratorAvatar>
            </Space>
            
            <Divider />
            
            <Title level={4} className="undp-typography margin-bottom-05">
              Signals in this Sprint
            </Title>
            
            {signalsQuery.isLoading ? (
              <Row gutter={[24, 24]}>
                {[1, 2, 3].map(i => (
                  <Col key={i} xs={24} sm={12} lg={8} xl={6}>
                    <Skeleton active />
                  </Col>
                ))}
              </Row>
            ) : signalsQuery.data?.length ? (
              <SignalsContainer>
                {signalsQuery.data.map(signal => (
                  <SprintCard key={signal.id} data={signal} />
                ))}
              </SignalsContainer>
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <Text type="secondary" style={{ fontSize: '16px' }}>
                  No signals have been added to this sprint yet.
                </Text>
                <div style={{ marginTop: '1rem' }}>
                  <Button type="primary" onClick={handleAddSignal}>
                    Add Signal to Sprint
                  </Button>
                </div>
              </div>
            )}

            {/* Add Signal Button when signals exist */}
            {signalsQuery.data?.length ? (
              <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                <Button type="primary" onClick={handleAddSignal}>
                  Add More Signals
                </Button>
              </div>
            ) : null}

            {/* Signal Search Modal */}
            <SignalSearch
              visible={isSignalSearchVisible}
              onClose={() => setIsSignalSearchVisible(false)}
              onSelect={handleSignalSelect}
              selectedSignals={signalsQuery.data || []}
              title="Add Signals to Sprint"
            />
          </>
        )}
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <SignInButton buttonText='Sign In to View Sprint Details' />
      </UnauthenticatedTemplate>
    </div>
  );
}
