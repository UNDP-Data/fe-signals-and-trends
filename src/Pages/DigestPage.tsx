import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Context from '../Context/Context';
import { triggerDigestEmail, searchSignals } from '../API/signalsCall';
import { SignalGridView } from '../Components/SignalViews/SignalGridView';
import { SignalHorizontalView } from '../Components/SignalViews/SignalHorizontalView';
import { 
  Button, 
  Alert, 
  Typography, 
  Card, 
  Select, 
  InputNumber, 
  message, 
  Modal,
  Input,
  Radio,
  Spin,
  Tag,
  Space,
  Tooltip,
  Pagination
} from 'antd';
import { 
  MailOutlined, 
  FilterOutlined, 
  SearchOutlined,
  SortAscendingOutlined,
  ClearOutlined
} from '@ant-design/icons';
import { SignalDataType, ChoicesDataType } from '../Types';
import { CREATED_FOR, SIGNAL_ORDER_BY_OPTIONS } from '../Constants';
import { getChoices } from '../API/choicesCalls';

const { Option } = Select;
const { Search } = Input;

interface SignalFiltersType {
  steep_primary?: string;
  steep_secondary?: string[];
  signature_primary?: string;
  signature_secondary?: string[];
  sdgs?: string[];
  location?: string;
  unit?: string;
  created_for?: string;
}

export default function DigestPage() {
  const { isAdmin, userName } = useContext(Context);
  const navigate = useNavigate();
  
  // Email digest modal state
  const [emailModalVisible, setEmailModalVisible] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [recipients, setRecipients] = useState<string[]>([userName || '']);
  const [days, setDays] = useState(7);
  const [emailResult, setEmailResult] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  
  // Signals grid state
  const [signals, setSignals] = useState<SignalDataType[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
  
  // Filter state
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [filters, setFilters] = useState<SignalFiltersType>({});
  const [tempFilters, setTempFilters] = useState<SignalFiltersType>({});
  const [choices, setChoices] = useState<ChoicesDataType | null>(null);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
    }
  }, [isAdmin, navigate]);

  // Load choices for filters
  useEffect(() => {
    if (!isAdmin) {
      return;
    }

    getChoices()
      .then(data => setChoices(data))
      .catch(error => {
        console.error('Failed to load choices:', error);
        message.error('Failed to load filter options');
      });
  }, []);

  // Load signals
  const loadSignals = async (page = 1) => {
    setLoading(true);
    try {
      const result = await searchSignals({
        statuses: ['New'], // Draft signals
        page,
        per_page: 20,
        order_by: sortBy,
        direction: 'desc',
        query: searchQuery,
        ...filters
      });
      setSignals(result.data);
      setTotalCount(result.total_count);
      setCurrentPage(result.current_page);
    } catch (error) {
      message.error('Failed to load signals');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAdmin) {
      return;
    }

    loadSignals(1);
  }, [filters, isAdmin, searchQuery, sortBy]);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleApplyFilters = () => {
    setFilters(tempFilters);
    setFilterModalVisible(false);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters({});
    setTempFilters({});
    setCurrentPage(1);
  };

  const getActiveFiltersCount = () => {
    return Object.values(filters).filter(value => 
      value && (Array.isArray(value) ? value.length > 0 : true)
    ).length;
  };

  const renderActiveFilters = () => {
    const activeFilters = [];
    
    if (filters.steep_primary) {
      activeFilters.push(
        <Tag key="steep_primary" closable onClose={() => setFilters({...filters, steep_primary: undefined})}>
          Primary STEEP+V: {filters.steep_primary}
        </Tag>
      );
    }
    
    if (filters.signature_primary) {
      activeFilters.push(
        <Tag key="signature_primary" closable onClose={() => setFilters({...filters, signature_primary: undefined})}>
          Primary Signature: {filters.signature_primary}
        </Tag>
      );
    }
    
    if (filters.location) {
      activeFilters.push(
        <Tag key="location" closable onClose={() => setFilters({...filters, location: undefined})}>
          Location: {filters.location}
        </Tag>
      );
    }
    
    return activeFilters;
  };

  // Email digest functions
  const handleSendDigest = async () => {
    if (!recipients.length || recipients.every(r => !r)) {
      message.error('Please add at least one recipient');
      return;
    }

    setEmailLoading(true);
    setEmailResult(null);
    setEmailError(null);
    try {
      const res = await triggerDigestEmail({
        recipients: recipients.filter(r => r),
        days,
        status: ['New'],
        test: true
      });
      
      setEmailResult(JSON.stringify(res, null, 2));
      message.success('Test digest email sent successfully!');
    } catch (err: any) {
      setEmailError(err?.message || 'Unknown error');
      message.error('Failed to send digest email');
      console.error(err);
    } finally {
      setEmailLoading(false);
    }
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="undp-container" style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography.Title level={2}>Curator Digest</Typography.Title>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Typography.Text type="secondary">
            {totalCount} draft signals pending curator review
          </Typography.Text>
          {/* <Button 
            type="primary"
            icon={<MailOutlined />}
            onClick={() => setEmailModalVisible(true)}
          >
            Send Digest
          </Button> */}
        </div>
      </div>

      {/* Controls Bar */}
      <Card className="undp-card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <Search
            placeholder="Search signals..."
            allowClear
            enterButton
            style={{ maxWidth: 300 }}
            onSearch={handleSearch}
            prefix={<SearchOutlined />}
          />
          
          <Select
            value={sortBy}
            onChange={setSortBy}
            style={{ width: 200 }}
            suffixIcon={<SortAscendingOutlined />}
          >
            {SIGNAL_ORDER_BY_OPTIONS.map(option => (
              <Option key={option.key} value={option.key}>{option.value}</Option>
            ))}
          </Select>
          
          <Button 
            icon={<FilterOutlined />}
            onClick={() => setFilterModalVisible(true)}
          >
            Filters {getActiveFiltersCount() > 0 && `(${getActiveFiltersCount()})`}
          </Button>
          
          {getActiveFiltersCount() > 0 && (
            <Button 
              type="link" 
              icon={<ClearOutlined />}
              onClick={handleClearFilters}
            >
              Clear all
            </Button>
          )}
          
          <Radio.Group 
            value={viewType} 
            onChange={e => setViewType(e.target.value)}
            style={{ marginLeft: 'auto' }}
          >
            <Radio.Button value="grid">Card View</Radio.Button>
            <Radio.Button value="list">List View</Radio.Button>
          </Radio.Group>
        </div>
        
        {renderActiveFilters().length > 0 && (
          <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {renderActiveFilters()}
          </div>
        )}
      </Card>

      {/* Signals View */}
      <Spin spinning={loading}>
        {viewType === 'grid' ? (
          <SignalGridView
            signals={signals}
            showRemoveButton={false}
            emptyStateMessage="No draft signals found"
            loading={loading}
          />
        ) : (
          <SignalHorizontalView
            signals={signals}
            showRemoveButton={false}
            emptyStateMessage="No draft signals found"
            loading={loading}
          />
        )}
      </Spin>
      
      {/* Pagination */}
      {totalCount > 0 && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
          <Pagination
            current={currentPage}
            total={totalCount}
            pageSize={20}
            onChange={(page) => loadSignals(page)}
            showTotal={(total) => `Total ${total} signals`}
          />
        </div>
      )}

      {/* Filter Modal */}
      <Modal
        title="Filter Signals"
        open={filterModalVisible}
        onOk={handleApplyFilters}
        onCancel={() => {
          setFilterModalVisible(false);
          setTempFilters(filters);
        }}
        width={600}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <Typography.Text className="undp-form-label">Primary STEEP+V</Typography.Text>
            <Select
              aria-label="Primary STEEP+V"
              value={tempFilters.steep_primary}
              onChange={value => setTempFilters({...tempFilters, steep_primary: value})}
              style={{ width: '100%' }}
              allowClear
              placeholder="Select primary STEEP+V"
            >
              {choices?.steep?.map(item => (
                <Option key={item} value={item}>{item}</Option>
              ))}
            </Select>
          </div>
          
          <div>
            <Typography.Text className="undp-form-label">Primary Signature Solution/Enabler</Typography.Text>
            <Select
              aria-label="Primary Signature Solution or Enabler"
              value={tempFilters.signature_primary}
              onChange={value => setTempFilters({...tempFilters, signature_primary: value})}
              style={{ width: '100%' }}
              allowClear
              placeholder="Select primary signature"
            >
              {choices?.signature?.map(item => (
                <Option key={item} value={item}>{item}</Option>
              ))}
            </Select>
          </div>
          
          <div>
            <Typography.Text className="undp-form-label">Location</Typography.Text>
            <Select
              aria-label="Location"
              value={tempFilters.location}
              onChange={value => setTempFilters({...tempFilters, location: value})}
              style={{ width: '100%' }}
              allowClear
              placeholder="Select location"
            >
              {choices?.location?.map(item => (
                <Option key={item} value={item}>{item}</Option>
              ))}
            </Select>
          </div>
          
          <div>
            <Typography.Text className="undp-form-label">SDGs</Typography.Text>
            <Select
              aria-label="SDGs"
              mode="multiple"
              value={tempFilters.sdgs}
              onChange={value => setTempFilters({...tempFilters, sdgs: value})}
              style={{ width: '100%' }}
              placeholder="Select SDGs"
            >
              {choices?.goal?.map(item => (
                <Option key={item} value={item}>{item}</Option>
              ))}
            </Select>
          </div>
        </div>
      </Modal>

      {/* Email Digest Modal */}
      <Modal
        title="Send Digest Email"
        open={emailModalVisible}
        onOk={handleSendDigest}
        onCancel={() => {
          setEmailModalVisible(false);
          setEmailResult(null);
          setEmailError(null);
        }}
        confirmLoading={emailLoading}
        width={600}
      >
        <div style={{ marginBottom: '1rem' }}>
          <Alert
            message="Email Digest"
            description={`This will send an email containing ${totalCount} signals with "New" status from the last ${days} days.`}
            type="info"
            showIcon
          />
        </div>
        
        <div style={{ marginTop: '1.5rem' }}>
          <Typography.Text className="undp-form-label">Recipients</Typography.Text>
          <Select
            aria-label="Recipients"
            mode="tags"
            style={{ width: '100%' }}
            placeholder="Enter email addresses"
            value={recipients}
            onChange={setRecipients}
          >
            {recipients.map(email => (
              <Option key={email} value={email}>{email}</Option>
            ))}
          </Select>
        </div>

        <div style={{ marginTop: '1rem' }}>
          <Typography.Text className="undp-form-label">Days to Include</Typography.Text>
          <InputNumber
            aria-label="Days to Include"
            min={1}
            max={30}
            value={days}
            onChange={(value) => setDays(value || 7)}
            style={{ width: '100%' }}
          />
        </div>

        {emailResult && (
          <Alert 
            message="Success" 
            description={
              <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                {emailResult}
              </pre>
            } 
            type="success" 
            showIcon 
            style={{ marginTop: '1.5rem' }} 
          />
        )}
        
        {emailError && (
          <Alert 
            message="Error" 
            description={emailError} 
            type="error" 
            showIcon 
            style={{ marginTop: '1.5rem' }} 
          />
        )}
      </Modal>

    </div>
  );
}
