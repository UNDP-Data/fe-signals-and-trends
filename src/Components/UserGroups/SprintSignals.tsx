import React, { useState } from 'react';
import { Typography, Divider, Button, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { SignalHorizontalView, SignalGridView } from '../SignalViews';
import { SignalSearch } from '../SignalSearch';
import { addSignalToUserGroup, removeSignalFromUserGroup } from '../../API/userCalls';
import type { SignalDataType, UserGroupDataType } from '../../Types';
import { useQueryClient } from '@tanstack/react-query';

const { Title } = Typography;

interface SprintSignalsProps {
  sprint: UserGroupDataType & { signals?: SignalDataType[] };
  sprintId: number;
  loading?: boolean;
}

export const SprintSignals: React.FC<SprintSignalsProps> = ({ 
  sprint, 
  sprintId, 
  loading = false 
}) => {
  const [isSignalSearchVisible, setIsSignalSearchVisible] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();
  
  const signals = sprint.signals || [];

  const handleAddSignal = () => {
    setIsSignalSearchVisible(true);
  };

  const handleRemoveSignal = async (signal: SignalDataType) => {
    try {
      messageApi.loading('Removing signal from sprint...');
      await removeSignalFromUserGroup(signal.id, sprintId);
      queryClient.invalidateQueries({ queryKey: ['sprint', sprintId] });
      messageApi.success('Signal removed from sprint');
    } catch (error) {
      console.error('Failed to remove signal:', error);
      messageApi.error('Failed to remove signal from sprint');
    }
  };

  const handleSignalSelect = async (selectedSignals: SignalDataType[]) => {
    if (!selectedSignals.length) return;

    try {
      messageApi.loading('Adding signals to sprint...');

      // Process signals sequentially to avoid race conditions
      for (const signal of selectedSignals) {
        await addSignalToUserGroup(signal.id, sprintId);
      }

      // Invalidate only the sprint query since it contains all the data we need
      queryClient.invalidateQueries({ queryKey: ['sprint', sprintId] });

      messageApi.success(`Successfully added ${selectedSignals.length} signal(s) to sprint`);
      setIsSignalSearchVisible(false);
    } catch (error) {
      console.error('Failed to add signals to sprint:', error);
      messageApi.error('Failed to add signals to sprint');
    }
  };

  return (
    <div>
      {contextHolder}
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={4} className="undp-typography margin-bottom-05">
          {signals.length > 0 ? `Signals (${signals.length})` : 'No Signals in this Sprint.'}
        </Title>
        
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={handleAddSignal}
        >
          Add Signals
        </Button>
      </div>

      {/* Grid view for larger displays */}
      {signals.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <SignalGridView 
            signals={signals}
            // onRemove={handleRemoveSignal}
          />
        </div>
      )}

      {/* Signal Search Modal */}
      {/* <SignalSearch
        visible={isSignalSearchVisible}
        onClose={() => setIsSignalSearchVisible(false)}
        onSelect={handleSignalSelect}
        selectedSignals={signals}
        title={`Add Signals to ${sprint.name || 'Sprint'}`}
      /> */}
    </div>
  );
};