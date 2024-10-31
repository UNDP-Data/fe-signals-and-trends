export type StatusList = 'New' | 'Approved' | 'Archived' | 'Draft';

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
  score?: string;
  connected_trends: number[];
  created_for?: string;
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
  accessToken?: string;
  isAcceleratorLab?: boolean;
  userID?: number;
  expiresOn?: Date;
  notificationText?: string;
  choices?: ChoicesDataType;
  cardsToPrint: CardsToPrintDataType[];
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
  updateAccessToken: (_d?: string) => void;
  updateUnit: (_d?: string) => void;
  updateUserID: (_d?: number) => void;
  updateIsAcceleratorLab: (_d?: boolean) => void;
  updateRole: (_d?: 'Admin' | 'Curator' | 'User') => void;
  updateExpiresOn: (_d: Date) => void;
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
}

export interface ObjForPrintingDataType {
  type: 'trend' | 'signal';
  mode: 'card' | 'detail';
  data: SignalDataType | TrendDataType;
}

export interface BaseSignalsParams {
  page?: number;
  per_page?: number;
  order_by?: string;
  direction?: 'desc' | 'asc';
  ids?: number[];
  statuses?: ('Draft' | 'New' | 'Approved' | 'Archived')[];
  created_by?: string;
  created_for?: string;
  steep_primary?: string;
  steep_secondary?: string[];
  signature_primary?: string;
  signature_secondary?: string[];
  sdgs?: string[];
  query?: string;
  location?: string;
  bureau?: string;
  score?: string;
  unit?: string;
}

export interface SignalsSearchResponse {
  current_page: number;
  per_page: number;
  total_pages: number;
  total_count: number;
  data: SignalDataType[];
}

export interface ReadMySignalsParams {
  status: 'Draft' | 'New' | 'Approved' | 'Archived';
}

export interface CreateSignalParams {
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
  score?: string;
  created_for?: string;
  status: string;
  connected_trends: number[];
}

export interface UpdateSignalParams {
  attachment?: string;
  description?: string;
  headline?: string;
  keywords?: string[];
  location?: string;
  relevance?: string;
  sdgs?: string[];
  signature_primary?: string;
  signature_secondary?: string[];
  steep?: string;
  url?: string;
  connected_trends?: number[];
  status?: string;
  modified_by?: string;
  steep_primary?: string;
  steep_secondary?: string[];
  assigned_to?: string;
  score?: string;
}

export interface BaseTrendsParams {
  page?: number;
  per_page?: number;
  order_by?: string;
  direction?: 'asc' | 'desc';
  statuses?: string[];
  ids?: number[];
  created_by?: string;
  created_for?: string;
  steep_primary?: string;
  steep_secondary?: string[];
  signature_primary?: string;
  signature_secondary?: string[];
  sdgs?: string[];
  query?: string;
  assigned_to?: string;
  time_horizon?: string;
  impact_rating?: string;
}

export interface TrendSearchResponse {
  per_page: number;
  current_page: number;
  total_pages: number;
  total_count: number;
  data: TrendDataType[];
}

export interface CreateTrendParams {
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
  connected_signals?: number[];
}

export interface UpdateTrendParams {
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
  connected_signals?: number[];
}

export type AllowedRoles = 'Admin' | 'Curator' | 'User' | 'Visitor';

export interface SearchUsersParams {
  page?: number;
  per_page?: number;
  order_by?: string;
  direction?: 'desc' | 'asc';
  roles?: AllowedRoles[];
  query?: string;
}

export interface UserSearchResponse {
  per_page: number;
  current_page: number;
  total_pages: number;
  total_count: number;
  data: UserDataType[];
}

export interface CurrentUserResponse {
  acclab: boolean;
  email: string;
  id: number;
  name: string;
  role: 'Admin' | 'Curator' | 'User' | 'Visitor';
  unit: string;
}

export interface ReadUserParams {
  uid: number;
}

export interface UserDataTypeResponse {
  acclab: boolean;
  email: string;
  id: number;
  name: string;
  role: string;
  unit: string;
}

export interface UpdateUserParams {
  acclab?: boolean;
  email?: string;
  name?: string;
  role?: 'Admin' | 'Curator' | 'User' | 'Visitor';
  id?: number;
  unit?: string;
}

export interface UpdateUserResponse {
  acclab: boolean;
  email: string;
  name: string;
  role: string;
  unit: string;
}
