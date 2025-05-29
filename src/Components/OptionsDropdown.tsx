import React from 'react';
import { Dropdown, Button, Tooltip } from 'antd';
import { EllipsisOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import styled from 'styled-components';

const MenuButton = styled.div`
  cursor: pointer;
  padding: 5px;
  border-radius: 4px;
  &:hover {
    background-color: #f0f0f0;
  }
`;

interface OptionsDropdownProps {
  menuItems?: MenuProps['items'];
  hasEditPermission?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  disabledTooltip?: string;
  showEditButton?: boolean;
  showDeleteButton?: boolean;
  customButton?: React.ReactNode;
}

export const OptionsDropdown: React.FC<OptionsDropdownProps> = ({ 
  menuItems, 
  hasEditPermission = true,
  onEdit,
  onDelete,
  disabledTooltip = "You don't have permission to edit this item",
  showEditButton = true,
  showDeleteButton = true,
  customButton
}) => {
  // Generate default menu items if not provided
  const generatedMenuItems: MenuProps['items'] = [];
  
  if (showEditButton) {
    generatedMenuItems.push({
      key: 'edit',
      label: 'Edit',
      icon: <EditOutlined />,
      onClick: onEdit,
      disabled: !hasEditPermission,
      title: !hasEditPermission ? disabledTooltip : undefined
    });
  }
  
  if (showDeleteButton) {
    generatedMenuItems.push({
      key: 'delete',
      label: 'Delete',
      icon: <DeleteOutlined />,
      onClick: onDelete,
      disabled: !hasEditPermission,
      danger: true,
      title: !hasEditPermission ? disabledTooltip : undefined
    });
  }
  
  const items = menuItems || generatedMenuItems;
  
  return (
    <Dropdown menu={{ items }} trigger={['click']}>
      {customButton || (
        <MenuButton onClick={e => e.stopPropagation()}>
          <EllipsisOutlined style={{ fontSize: '24px' }} />
        </MenuButton>
      )}
    </Dropdown>
  );
};
