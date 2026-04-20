import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Pagination, PaginationProps, Empty, Button, Space } from 'antd';
import { AppstoreOutlined, BarsOutlined } from '@ant-design/icons';
import { SignalGridView } from './SignalGridView';
import { SignalHorizontalView } from './SignalHorizontalView';
import type { SignalDataType, UserGroupDataType, UserDataType } from '../../Types';
import { listUserGroups, UserGroupResponseDataType } from '../../API/userCalls';

const ViewToggleContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 16px;
`;

const EmptyStateContainer = styled.div`
  text-align: center;
  padding: 2rem;
  width: 100%;
  background-color: var(--gray-200);
  border: 1px solid var(--gray-400);
`;

export interface SignalsListProps {
  signals: SignalDataType[];
  title?: string;
  loading?: boolean;
  onRemove?: (signal: SignalDataType) => Promise<void>;
  onAdd?: () => void;
  emptyStateMessage?: string;
  showRemoveButton?: boolean;
  pageSize?: number;
  showPagination?: boolean;
  showViewToggle?: boolean;
}

export const SignalsList: React.FC<SignalsListProps> = ({
  signals,
  title,
  loading = false,
  onRemove,
  onAdd,
  emptyStateMessage = "No signals found",
  showRemoveButton = false,
  pageSize: initialPageSize = 20,
  showPagination = true,
  showViewToggle = true,
}) => {
  const [userGroups, setUserGroups] = useState<UserGroupDataType[]>([]);
  const [paginationValue, setPaginationValue] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [viewMode, setViewMode] = useState<'grid' | 'horizontal'>('grid');

  // Convert UserGroupResponseDataType to UserGroupDataType
  const convertUserGroupResponseToUserGroupData = (
    responseGroups: UserGroupResponseDataType[]
  ): UserGroupDataType[] => {
    return responseGroups.map(group => ({
      id: group.id,
      name: group.name,
      user_ids: group.user_ids || [],
      signal_ids: group.signal_ids || [],
      collaborator_map: group.collaborator_map || {},
    }));
  };

  // Fetch user groups when the component mounts
  useEffect(() => {
    let mounted = true;

    const fetchUserGroups = async () => {
      try {
        const groups = await listUserGroups();
        if (mounted) {
          // Convert API response to the expected type
          const convertedGroups = convertUserGroupResponseToUserGroupData(groups);
          setUserGroups(convertedGroups);
        }
      } catch (error) {
        console.error('Error fetching user groups:', error);
        // Don't set an error state here - just log the error
        // The component can still function without user groups
      }
    };

    fetchUserGroups();

    return () => {
      mounted = false;
    };
  }, []);

  // Calculate pagination
  const startIndex = (paginationValue - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedSignals = signals.slice(startIndex, endIndex);
  const totalPages = signals.length ? Math.ceil(signals.length / pageSize) : 0;

  const onShowSizeChange: PaginationProps['onShowSizeChange'] = (
    _current,
    size,
  ) => {
    setPageSize(size);
  };

  // If there are no signals and we're not loading, show empty state
  if (!loading && (!signals || signals.length === 0)) {
    return (
      <div>
        {title && (
          <h3 className="undp-typography margin-top-00 margin-bottom-05">{title}</h3>
        )}
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
      </div>
    );
  }

  return (
    <div>
      {title && (
        <h3 className="undp-typography margin-top-00 margin-bottom-05">{title}</h3>
      )}

      {loading ? (
        <div className="undp-loader-container">
          <div className="undp-loader" />
        </div>
      ) : (
        <>
          {showViewToggle && (
            <ViewToggleContainer>
              <Space.Compact>
                <Button
                  type={viewMode === 'grid' ? 'primary' : 'default'}
                  icon={<AppstoreOutlined />}
                  onClick={() => setViewMode('grid')}
                />
                <Button
                  type={viewMode === 'horizontal' ? 'primary' : 'default'}
                  icon={<BarsOutlined />}
                  onClick={() => setViewMode('horizontal')}
                />
              </Space.Compact>
            </ViewToggleContainer>
          )}

          {viewMode === 'grid' ? (
            <SignalGridView
              signals={paginatedSignals}
              onRemove={onRemove}
              onAdd={onAdd}
              emptyStateMessage={emptyStateMessage}
              showRemoveButton={showRemoveButton}
              loading={loading}
              userGroups={userGroups}
            />
          ) : (
            <SignalHorizontalView
              signals={paginatedSignals}
              onRemove={onRemove}
              onAdd={onAdd}
              emptyStateMessage={emptyStateMessage}
              showRemoveButton={showRemoveButton}
              loading={loading}
              userGroups={userGroups}
            />
          )}

          {showPagination && signals.length > 0 && (
            <div className="flex-div flex-hor-align-center margin-top-07">
              <Pagination
                className="undp-pagination"
                onChange={(e) => {
                  setPaginationValue(e);
                }}
                defaultCurrent={1}
                current={paginationValue}
                total={totalPages * pageSize}
                pageSize={pageSize}
                showSizeChanger
                onShowSizeChange={onShowSizeChange}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};
