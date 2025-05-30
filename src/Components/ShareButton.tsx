import { Tooltip, Button, message } from 'antd';
import { ShareAltOutlined } from '@ant-design/icons';
import React from 'react';

interface ShareButtonProps {
  url?: string; // Optional: allow overriding the URL to share
  tooltip?: string;
  size?: number;
}

export const ShareButton: React.FC<ShareButtonProps> = ({ url, tooltip = 'Share Sprint', size = 22 }) => {
  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(url || window.location.href);
      message.success('Sprint link copied to clipboard!');
    } catch (err) {
      message.error('Failed to copy link');
    }
  };

  return (
    <Tooltip title={tooltip} placement="top">
      <Button
        type="text"
        icon={<ShareAltOutlined style={{ fontSize: size }} />}
        onClick={handleShare}
        style={{ padding: 0, marginLeft: 4, display: 'flex', alignItems: 'center' }}
        aria-label={tooltip}
      />
    </Tooltip>
  );
}; 