export type StatusDataType =
  | 'New'
  | 'Approved'
  | 'Archived'
  | 'Draft'
  | 'Created'
  | 'Deleted';

export interface SignalDataType {
  id: number;
  status: string;
  created_at: string;
  created_by: string;
  modified_at?: string;
  modified_by?: string;
  headline: string;
  description: string;
  attachment?: string;
  steep_primary: string;
  steep_secondary?: string[];
  signature_primary: string;
  signature_secondary?: string[];
  sdgs: string[];
  created_unit: string;
  url: string;
  relevance: string;
  keywords: string[];
  location: string;
  secondary_location?: string[];
  score?: string;
  connected_trends: number[];
  created_for?: string;
  favorite?: boolean;
}

export interface NewSignalDataType {
  id?: number;
  status: string;
  created_at?: string;
  created_by?: string;
  modified_at?: string;
  modified_by?: string;
  headline?: string;
  description?: string;
  attachment?: string;
  steep_primary?: string;
  steep_secondary?: string[];
  signature_primary?: string;
  signature_secondary?: string[];
  sdgs?: string[];
  created_unit?: string;
  url?: string;
  relevance?: string;
  keywords: string[];
  location?: string;
  secondary_location?: string[];
  score?: string;
  connected_trends?: number[];
  created_for?: string;
}

export interface TrendDataType {
  id: number;
  status: string;
  created_at: string;
  created_by: string;
  created_for?: null;
  modified_at?: string;
  modified_by?: string;
  headline: string;
  description: string;
  attachment?: string;
  steep_primary?: string;
  steep_secondary?: string[];
  signature_primary?: string;
  signature_secondary?: string[];
  sdgs?: string[];
  assigned_to?: string;
  time_horizon: string;
  impact_rating: string;
  impact_description: string;
  connected_signals: number[];
  keywords?: string[];
  location?: string;
  relevance?: string;
}
export interface NewTrendDataType {
  id?: number;
  status: string;
  created_at?: string;
  created_by?: string;
  created_for?: null;
  modified_at?: string;
  modified_by?: string;
  headline?: string;
  description?: string;
  attachment?: string;
  steep_primary?: string;
  steep_secondary?: string[];
  signature_primary?: string;
  signature_secondary?: string[];
  sdgs?: string[];
  assigned_to?: string;
  time_horizon?: string;
  impact_rating?: string;
  impact_description?: string;
  connected_signals: number[];
  keywords?: string[];
  location?: string;
  relevance?: string;
}

export interface UserDataType {
  created_at: string;
  email: string;
  name: string;
  role: 'Admin' | 'Curator' | 'User';
  unit: string;
  id: number;
}

export interface UserGroupDataType {
  id: number;
  name: string;
  users: string[];
}

export interface SignalFiltersDataType {
  horizon?: string;
  impact?: string;
  bureau?: string;
  steep_primary: 'All Primary STEEP+V' | string;
  steep_secondary: 'All Secondary STEEP+V' | string;
  sdg: 'All SDGs' | string;
  signature_primary: 'All Primary Signature Solutions/Enabler' | string;
  signature_secondary: 'All Secondary Signature Solutions/Enabler' | string;
  status: 'All Status' | string;
  score: 'All Scores' | string;
  created_for: 'All Options' | string;
  created_by?: string;
  location: string;
  unit_region: 'All Units' | string;
  search?: string;
}

export interface TrendFiltersDataType {
  horizon: 'All Horizons' | string;
  impact: 'All Ratings' | string;
  steep_primary: 'All Primary STEEP+V' | string;
  steep_secondary: 'All Secondary STEEP+V' | string;
  sdg: 'All SDGs' | string;
  signature_primary: 'All Primary Signature Solutions/Enabler' | string;
  signature_secondary: 'All Secondary Signature Solutions/Enabler' | string;
  created_for: 'All Options' | string;
  assigned_to?: string;
  status: 'All Status' | string;
  search?: string;
}

export interface ChoicesDataType {
  horizon: string[];
  created_for: string[];
  location: string[];
  rating: string[];
  role: string[];
  goal: string[];
  signature: string[];
  steep: string[];
  unit_name: string[];
  unit_region: string[];
  score: string[];
}

export interface CardsToPrintDataType {
  type: 'trend' | 'signal';
  mode: 'card' | 'detail';
  id: string;
}

export interface CtxDataType {
  userName?: string;
  name?: string;
  unit?: string;
  role?: 'Admin' | 'Curator' | 'User';
  isAcceleratorLab?: boolean;
  userID?: number;
  notificationText?: string;
  choices?: ChoicesDataType;
  cardsToPrint: CardsToPrintDataType[];
  userGroups?: UserGroupDataType[];
  trendFilters: TrendFiltersDataType;
  noOfTrendsFiltersActive: number;
  signalFilters: SignalFiltersDataType;
  noOfSignalsFiltersActive: number;
  signalsSortBy: string;
  trendsSortBy: string;
  trendList?: TrendDataType[];
  signalList?: SignalDataType[];
  updateUserName: (_d: string) => void;
  updateName: (_d?: string) => void;
  updateUnit: (_d?: string) => void;
  updateUserID: (_d?: number) => void;
  updateIsAcceleratorLab: (_d?: boolean) => void;
  updateRole: (_d?: 'Admin' | 'Curator' | 'User') => void;
  updateNotificationText: (_d?: string) => void;
  updateChoices: (_d?: ChoicesDataType) => void;
  updateCardsToPrint: (_d: CardsToPrintDataType[]) => void;
  updateTrendFilters: (_d: TrendFiltersDataType) => void;
  updateSignalFilters: (_d: SignalFiltersDataType) => void;
  updateNoOfTrendsFiltersActive: (_d: number) => void;
  updateNoOfSignalsFiltersActive: (_d: number) => void;
  updateSignalsSortBy: (_d: string) => void;
  updateTrendsSortBy: (_d: string) => void;
  updateTrendList: (_d?: TrendDataType[]) => void;
  updateSignalList: (_d?: SignalDataType[]) => void;
  updateUserGroups: (_d?: UserGroupDataType[]) => void;
}

export interface ObjForPrintingDataType {
  type: 'trend' | 'signal';
  mode: 'card' | 'detail';
  data: SignalDataType | TrendDataType;
}

export interface CreateTrendParamsDataType {
  description: string;
  headline: string;
  impact_description: string;
  impact_rating: string;
  time_horizon: string;
  sdgs: string[];
  status: string;
  attachment?: string;
  keywords?: string[];
  location?: string;
  relevance?: string;
  signature_primary?: string;
  signature_secondary?: string[];
  steep?: string;
  modified_by?: string;
  steep_primary?: string;
  steep_secondary?: string[];
  assigned_to?: string;
  created_for?: string;
  connected_signals?: number[];
}

export interface UpdateTrendParamsDataType {
  id: number;
  description: string;
  headline: string;
  impact_description: string;
  impact_rating: string;
  time_horizon: string;
  sdgs?: string[];
  status?: string;
  attachment?: string;
  keywords?: string[];
  location?: string;
  relevance?: string;
  signature_primary?: string;
  signature_secondary?: string[];
  steep?: string;
  modified_by?: string;
  steep_primary?: string;
  steep_secondary?: string[];
  assigned_to?: string;
  created_by?: string;
  created_for?: string;
  connected_signals?: number[];
}

export type AllowedRolesDataType = 'Admin' | 'Curator' | 'User' | 'Visitor';

export interface SearchUsersParamsDataType {
  page?: number;
  per_page?: number;
  order_by?: string;
  direction?: 'desc' | 'asc';
  roles?: AllowedRolesDataType[];
  query?: string;
}

export interface CurrentUserResponseDataType {
  acclab: boolean;
  email: string;
  id: number;
  name: string;
  role: AllowedRolesDataType;
  unit: string;
}

export interface AutoTaggingNewsDataType {
  headline: string;
  url: string;
  description: string;
  relevance: number | null;
  keywords: string[];
  location: string;
  created_unit: string | null;
  score: { sentiment: number };
  connected_trends: string[] | null;
}
