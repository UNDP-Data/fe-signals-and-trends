import type { SignalDataType, UserGroupDataType } from '../../Types';
import React from 'react';

export interface SignalViewProps {
  signals: SignalDataType[];
  onRemove?: (signal: SignalDataType) => Promise<void>;
  onAdd?: () => void;
  emptyStateMessage?: string;
  showRemoveButton?: boolean;
  loading?: boolean;
  userGroups?: UserGroupDataType[];
  renderCustomCard?: (signal: SignalDataType) => React.ReactNode;
}