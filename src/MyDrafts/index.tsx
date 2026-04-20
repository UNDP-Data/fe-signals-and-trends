import { useContext, useState } from 'react';
import { Pagination, Modal, message } from 'antd';
import type { PaginationProps } from 'antd';
import sortBy from 'lodash.sortby';
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
} from '@azure/msal-react';
import { SignInButton } from '../Components/SignInButton';
import Context from '../Context/Context';
import { searchSignals, deleteSignal } from '../API';
import { SignalCard } from '../Components/SignalCard';
import type { SignalDataType } from '../Types';
import type { MenuProps } from 'antd';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function MyDrafts() {
  const { userName } = useContext(Context);
  const [paginationValue, setPaginationValue] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [signalToDelete, setSignalToDelete] = useState<SignalDataType | null>(null);
  const [messageApi, contextHolder] = message.useMessage();
  
  const queryClient = useQueryClient();
  // Query for fetching draft signals
  const { 
    data: signalsData,
    isLoading, 
    isError,
    error: queryError
  } = useQuery({
    queryKey: ['draftSignals', userName, paginationValue, pageSize],
    queryFn: () => searchSignals({
      page: paginationValue,
      per_page: pageSize,
      statuses: ['Draft'],
      created_by: userName,
    }),
    select: (response) => ({
      signals: sortBy(response.data, d => Date.parse(d.created_at)).reverse(),
      totalPages: response.total_pages,
      totalCount: response.total_count
    }),
    enabled: !!userName,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  // Mutation for deleting signals
  const deleteMutation = useMutation({
    mutationFn: (signalId: number) => deleteSignal(signalId),
    onSuccess: () => {
      messageApi.success('Signal deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['draftSignals'] });
    },
    onError: (error) => {
      messageApi.error('Failed to delete signal');
      console.error('Delete signal error:', error);
    }
  });

  const onShowSizeChange: PaginationProps['onShowSizeChange'] = (
    _current,
    size,
  ) => {
    setPageSize(size);
  };

  const handleDeleteSignal = (signal: SignalDataType) => {
    setSignalToDelete(signal);
    setIsDeleteModalVisible(true);
  };

  const confirmDelete = () => {
    if (!signalToDelete) return;
    
    messageApi.loading('Deleting signal...');
    deleteMutation.mutate(signalToDelete.id, {
      onSettled: () => {
        setIsDeleteModalVisible(false);
        setSignalToDelete(null);
      }
    });
  };

  const cancelDelete = () => {
    setIsDeleteModalVisible(false);
    setSignalToDelete(null);
  };

  return (
      <AuthenticatedTemplate>
        {contextHolder}
        {isLoading ? (
          <div className='undp-loader-container'>
            <div className='undp-loader' />
          </div>
        ) : isError ? (
          <p
            className='margin-top-00 margin-bottom-00'
            style={{ color: 'var(--dark-red)' }}
          >
            {queryError instanceof Error ? queryError.message : 'An error occurred'}
          </p>
        ) : (
          <div>
            <h3 className='undp-typography margin-top-05'>My Drafts</h3>
            <div className='flex-div flex-wrap listing'>
              {signalsData?.signals && signalsData.signals.length > 0 ? (
                signalsData.signals.map((d: SignalDataType, i: number) => {
                  // Create delete option for drafts
                  const deleteMenuItem: MenuProps['items'] = [
                    {
                      key: 'delete',
                      label: 'Delete Signal',
                      onClick: () => handleDeleteSignal(d),
                    }
                  ];
                  
                  return (
                    <SignalCard 
                      data={d} 
                      key={d.id ?? i} 
                      isDraft={d.status === 'Draft'} 
                      optionsDropdownItems={deleteMenuItem}
                    />
                  );
                })
              ) : (
                <h5
                  className='undp-typography bold'
                  style={{
                    backgroundColor: 'var(--gray-200)',
                    textAlign: 'center',
                    padding: 'var(--spacing-07)',
                    width: 'calc(100% - 4rem)',
                    border: '1px solid var(--gray-400)',
                  }}
                >
                  No signals available matching your criteria
                </h5>
              )}
            </div>
            <div className='flex-div flex-hor-align-center margin-top-07 undp-pagination-shell'>
              <Pagination
                className='undp-pagination'
                onChange={e => {
                  setPaginationValue(e);
                }}
                defaultCurrent={1}
                current={paginationValue}
                total={(signalsData?.totalPages || 0) * pageSize}
                pageSize={pageSize}
                showSizeChanger
                onShowSizeChange={onShowSizeChange}
              />
            </div>
            
            {/* Confirmation Modal */}
            <Modal
              title="Delete Signal"
              open={isDeleteModalVisible}
              onOk={confirmDelete}
              onCancel={cancelDelete}
              okText="Delete"
              cancelText="Cancel"
              confirmLoading={deleteMutation.isPending}
              okButtonProps={{ 
                danger: true,
                style: { background: 'var(--dark-red)', borderColor: 'var(--dark-red)' } 
              }}
            >
              <p>Are you sure you want to delete this signal?</p>
              {signalToDelete && (
                <p>
                  <strong>Signal:</strong> {signalToDelete.headline} (ID: {signalToDelete.id})
                </p>
              )}
              <p>This action cannot be undone.</p>
            </Modal>
          </div>
        )}
      </AuthenticatedTemplate>
  )
}
