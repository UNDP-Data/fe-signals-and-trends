import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Context from '../Context/Context';
import { triggerDigestEmail } from '../API/signalsCall';
import { searchSignals } from '../API/signalsCall';
import { Button, Alert, Typography, Card, Select, InputNumber, message } from 'antd';

const { Option } = Select;

export default function DigestPage() {
  const { isAdmin, userName } = useContext(Context);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [recipients, setRecipients] = useState<string[]>([userName || '']);
  const [days, setDays] = useState(7);
  const [previewCount, setPreviewCount] = useState(0);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Redirect if not admin
  if (!isAdmin) {
    navigate('/');
    return null;
  }

  const handlePreview = async () => {
    setPreviewLoading(true);
    try {
      const result = await searchSignals({
        statuses: ['New'],
        per_page: 100,
        order_by: 'created_at',
        direction: 'desc'
      });
      setPreviewCount(result.total_count);
    } catch (error) {
      message.error('Failed to fetch preview count');
      console.error(error);
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleSendDigest = async () => {
    if (!recipients.length || recipients.every(r => !r)) {
      message.error('Please add at least one recipient');
      return;
    }

    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const res = await triggerDigestEmail({
        recipients: recipients.filter(r => r), // Filter out empty strings
        days,
        status: ['New'],
        test: true
      });
      
      setResult(JSON.stringify(res, null, 2));
      message.success('Test digest email sent successfully!');
      console.log('Digest result:', res);
    } catch (err: any) {
      setError(err?.message || 'Unknown error');
      message.error('Failed to send digest email');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="undp-container" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <Typography.Title level={2}>Test Digest Email</Typography.Title>
      
      <Card className="undp-card" style={{ marginTop: '2rem' }}>
        <Typography.Title level={4} style={{ marginBottom: '1rem' }}>About Digest Emails</Typography.Title>
        <Typography.Paragraph>
          This tool allows administrators to send test digest emails containing signals that need review. 
          The email will include all signals with "New" status from the specified time period.
        </Typography.Paragraph>
        
        <div style={{ marginTop: '2rem' }}>
          <Typography.Title level={5}>Configuration</Typography.Title>
          
          <div style={{ marginTop: '1rem' }}>
            <label className="undp-form-label">Recipients</label>
            <Select
              mode="tags"
              style={{ width: '100%' }}
              placeholder="Enter email addresses"
              value={recipients}
              onChange={setRecipients}
              className="undp-select"
            >
              {recipients.map(email => (
                <Option key={email} value={email}>{email}</Option>
              ))}
            </Select>
          </div>

          <div style={{ marginTop: '1rem' }}>
            <label className="undp-form-label">Days to Include</label>
            <InputNumber
              min={1}
              max={30}
              value={days}
              onChange={(value) => setDays(value || 7)}
              style={{ width: '100%' }}
              className="undp-input"
            />
          </div>

          <div style={{ marginTop: '2rem' }}>
            <Button 
              onClick={handlePreview}
              loading={previewLoading}
              style={{ marginRight: '1rem' }}
            >
              Preview Signal Count
            </Button>
            {previewCount > 0 && (
              <span className="undp-typography">
                Found {previewCount} signals needing review
              </span>
            )}
          </div>
        </div>

        <div style={{ marginTop: '3rem', textAlign: 'center' }}>
          <Button
            type="primary"
            size="large"
            loading={loading}
            onClick={handleSendDigest}
            className="undp-button button-primary"
            style={{ 
              padding: '1rem 3rem',
              fontSize: '1.2rem',
              height: 'auto'
            }}
          >
            Send Test Digest Email
          </Button>
        </div>

        {result && (
          <Alert 
            message="Success" 
            description={
              <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                {result}
              </pre>
            } 
            type="success" 
            showIcon 
            style={{ marginTop: '2rem' }} 
          />
        )}
        
        {error && (
          <Alert 
            message="Error" 
            description={error} 
            type="error" 
            showIcon 
            style={{ marginTop: '2rem' }} 
          />
        )}

        <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
          <Typography.Paragraph className="small-font" style={{ margin: 0 }}>
            <strong>Note:</strong> This will send a test email to the specified recipients. 
            The email will be marked as a test and will include signals from the last {days} days 
            that have "New" status.
          </Typography.Paragraph>
        </div>
      </Card>
    </div>
  );
} 