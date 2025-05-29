import React from 'react';
import styled from 'styled-components';
import { Button, Empty } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { SignalCard } from '../SignalCard';
import type { SignalDataType } from '../../Types';
import type { SignalViewProps } from './types';

const SignalsScrollContainer = styled.div`
  display: flex;
  overflow-x: auto;
  gap: 20px;
  padding: 20px 0;
  margin-top: 20px;
  border-top: 1px solid #eeeeee;
  scrollbar-width: thin;

  &::-webkit-scrollbar {
    height: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

const CompactSignalCard = styled.div`
  width: 300px;
  min-width: 300px;
  border: 1px solid #e8e8e8;
`;

const EmptyStateContainer = styled.div`
  text-align: center;
  padding: 2rem;
  width: 100%;
`;

export const SignalHorizontalView: React.FC<SignalViewProps> = ({
  signals,
  onRemove,
  onAdd,
  emptyStateMessage = "No signals found",
  showRemoveButton = true,
  loading = false,
  userGroups,
}) => {
  if (!signals || signals.length === 0) {
    return (
      <EmptyStateContainer>
        <Empty
          description={emptyStateMessage}
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
        {onAdd && (
          <div style={{ marginTop: '1rem' }}>
            <Button type="primary" onClick={onAdd}>
              Add Signal
            </Button>
          </div>
        )}
      </EmptyStateContainer>
    );
  }

  return (
    <SignalsScrollContainer>
      {signals.map(signal => (
        <div style={{ position: 'relative' }} key={signal.id}>
          <CompactSignalCard>
            <SignalCard data={signal} />
          </CompactSignalCard>
          {showRemoveButton && onRemove && (
            <Button
              danger
              type="text"
              size="small"
              icon={<DeleteOutlined />}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: 'rgba(255, 255, 255, 0.8)',
                borderRadius: '50%',
                zIndex: 10
              }}
              onClick={() => onRemove(signal)}
            />
          )}
        </div>
      ))}
    </SignalsScrollContainer>
  );
};