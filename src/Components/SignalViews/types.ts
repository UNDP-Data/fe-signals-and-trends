import type { SignalDataType, UserGroupDataType } from '../../Types';

export interface SignalViewProps {
  signals: SignalDataType[];
  onRemove?: (signal: SignalDataType) => Promise<void>;
  onAdd?: () => void;
  emptyStateMessage?: string;
  showRemoveButton?: boolean;
  loading?: boolean;
  userGroups?: UserGroupDataType[];
}