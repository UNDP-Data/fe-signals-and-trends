import { useState, useEffect, useCallback } from 'react';
import { Input, Button, Table, Empty, Typography, Space, Spin, Modal, Tag, Divider } from 'antd';
import { SearchOutlined, SaveOutlined, DeleteOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { searchSignals } from '../API/signalsCall';
import type { SignalDataType } from '../Types';
import type { TablePaginationConfig } from 'antd/es/table';

const { Text, Title } = Typography;

interface SignalSearchProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (signals: SignalDataType[]) => void;
  selectedSignals?: SignalDataType[];
  title?: string;
  width?: string | number;
  containerStyles?: React.CSSProperties;
  isModal?: boolean;
}

const SearchContainer = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
`;

const SearchInput = styled(Input)`
  flex: 1;
`;

const SignalTable = styled(Table)`
  .selected-row {
    background-color: rgba(0, 110, 181, 0.1);
  }
`;

const EmptyState = styled(Empty)`
  margin: 40px 0;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SelectedCount = styled(Text)`
  font-weight: bold;
`;

const ComponentContainer = styled.div<{ customWidth?: string | number }>`
  width: ${props => props.customWidth || '100%'};
  overflow: hidden;
`;

const SelectedSignalsContainer = styled.div`
  margin-bottom: 16px;
  padding: 12px;
  background-color: #f5f5f5;
  border-radius: 4px;
`;

const SelectedSignalTag = styled(Tag)`
  margin: 4px;
`;

const ActionBar = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 16px;
`;

export const SignalSearch = ({
  visible,
  onClose,
  onSelect,
  selectedSignals = [],
  title = 'Add Signals',
  width,
  containerStyles,
  isModal,
}: SignalSearchProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [signals, setSignals] = useState<SignalDataType[]>([]);
  const [selectedRows, setSelectedRows] = useState<SignalDataType[]>(selectedSignals);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const fetchSignals = useCallback(async (page = 1, query = searchQuery) => {
    try {
      setLoading(true);
      const response = await searchSignals({
        page,
        per_page: pagination.pageSize,
        query: query.trim() || undefined,
        statuses: ['Approved'],
      });
      
      setSignals(response.data || []);
      setPagination({
        ...pagination,
        current: page,
        total: response.total_count || 0,
      });
    } catch (error) {
      console.error('Error searching signals:', error);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, pagination]);

  useEffect(() => {
    if (visible) {
      fetchSignals();
    }
  }, [visible, fetchSignals]);

  const handleSearch = () => {
    fetchSignals(1);
  };

  const handleTableChange = (newPagination: TablePaginationConfig) => {
    fetchSignals(newPagination.current || 1);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSelect = (record: SignalDataType, selected: boolean) => {
    if (selected) {
      setSelectedRows([...selectedRows, record]);
    } else {
      setSelectedRows(selectedRows.filter(signal => signal.id !== record.id));
    }
  };

  const handleSelectAll = (selected: boolean, selectedRows: SignalDataType[]) => {
    if (selected) {
      // Merge with existing selections, avoiding duplicates
      const newSelections = [...selectedRows];
      for (const row of selectedRows) {
        if (!selectedRows.some(s => s.id === row.id)) {
          newSelections.push(row);
        }
      }
      setSelectedRows(newSelections);
    } else {
      // Remove current page items from selection
      const currentPageIds = signals.map(signal => signal.id);
      setSelectedRows(selectedRows.filter(signal => !currentPageIds.includes(signal.id)));
    }
  };

  const handleApply = () => {
    onSelect(selectedRows);
    onClose();
  };

  const handleSave = () => {
    onSelect(selectedRows);
  };

  const handleRemoveSelected = (signalId: number) => {
    setSelectedRows(selectedRows.filter(signal => signal.id !== signalId));
  };

  const columns = [
    {
      title: 'Title',
      dataIndex: 'headline',
      key: 'headline',
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (text: string) => (
        <Text ellipsis={{ tooltip: text }} style={{ maxWidth: 300, display: 'block' }}>
          {text}
        </Text>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
    },
  ];

  const renderContent = () => (
    <>
      {selectedRows.length > 0 && (
        <>
          <ActionBar>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              onClick={handleSave}
            >
              Save Selection
            </Button>
          </ActionBar>
        </>
      )}

      <SearchContainer>
        <SearchInput
          placeholder="Search signals by title, description, or keywords"
          prefix={<SearchOutlined />}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <Button onClick={handleSearch} type="primary">
          Search
        </Button>
      </SearchContainer>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <Spin size="large" />
        </div>
      ) : signals.length === 0 ? (
        <EmptyState description="No signals found" />
      ) : (
        <SignalTable
          rowKey="id"
          columns={columns}
          dataSource={signals}
          pagination={pagination}
          onChange={handleTableChange}
          rowSelection={{
            selectedRowKeys: selectedRows.map(signal => signal.id),
            onSelect: (record, selected) => handleSelect(record as SignalDataType, selected),
            onSelectAll: (selected, selectedRows) => handleSelectAll(selected, selectedRows as SignalDataType[]),
          }}
          rowClassName={(record) =>
            selectedRows.some(signal => signal.id === (record as SignalDataType).id) ? 'selected-row' : ''}
        />
      )}
    </>
  );

  return isModal ? (
    <Modal
      title={title}
      open={visible}
      onCancel={onClose}
      width={width || 800}
      footer={
        <ModalFooter>
          <SelectedCount>
            {selectedRows.length} {selectedRows.length === 1 ? 'signal' : 'signals'} selected
          </SelectedCount>
          <Space>
            <Button onClick={onClose}>Cancel</Button>
            <Button type="primary" onClick={handleApply}>
              Apply
            </Button>
          </Space>
        </ModalFooter>
      }
    >
      {renderContent()}
    </Modal>
  ) : (
    <ComponentContainer
      customWidth={width}
      style={containerStyles}
    >
      {renderContent()}
    </ComponentContainer>
  );
};
