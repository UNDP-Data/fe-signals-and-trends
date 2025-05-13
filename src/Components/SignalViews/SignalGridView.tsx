import React from 'react';
import styled from 'styled-components';
import { Button, Empty } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { SignalCard } from '../SignalCard';
import type { SignalDataType } from '../../Types';
import type { SignalViewProps } from './types';

const SignalsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
`;

const EmptyStateContainer = styled.div`
  text-align: center;
  padding: 2rem;
  width: 100%;
`;

export const SignalGridView: React.FC<SignalViewProps> = ({
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
    <SignalsContainer>
      {signals.map(signal => (
        <div key={signal.id} style={{ position: 'relative' }}>
          <SignalCard data={signal} />
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
                borderRadius: '50%'
              }}
              onClick={() => onRemove(signal)}
            />
          )}
        </div>
      ))}
    </SignalsContainer>
  );
};