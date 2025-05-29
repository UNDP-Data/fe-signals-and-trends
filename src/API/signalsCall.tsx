/* eslint-disable @typescript-eslint/naming-convention */
import { isAxiosError } from 'axios';
import {
  AutoTaggingNewsDataType,
  SignalDataType,
  StatusDataType,
} from '../Types';
import { axiosInstance } from './apiConfig';
import logger from '../logger';


interface BaseSignalsParamsDataType {
  page?: number;
  per_page?: number;
  order_by?: string;
  direction?: 'desc' | 'asc';
  ids?: number[];
  statuses?: StatusDataType[];
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

interface SignalsSearchResponseDataType {
  current_page: number;
  per_page: number;
  total_pages: number;
  total_count: number;
  data: SignalDataType[];
}

export interface ReadMySignalsParamsDataType {
  status: StatusDataType;
}

export interface CreateSignalParamsDataType {
  headline: string | null;
  description: string | null;
  attachment?: string | null;
  steep_primary: string | null;
  steep_secondary?: string[] | null;
  signature_primary: string | null;
  signature_secondary?: string[] | null;
  sdgs: string[] | null;
  created_unit: string | null;
  url: string | null;
  relevance: string | null;
  keywords: string[] | null;
  location: string | null;
  secondary_location?: string[] | null;
  score?: string | null;
  created_for?: string | null;
  status: string | null;
  connected_trends: number[] | null;
  user_group_ids?: number[] | null;
  private?: boolean;
}

interface UpdateSignalParamsDataType {
  id: number;
  attachment?: string | null;
  description: string | null;
  headline: string | null;
  keywords: string[] | null;
  location?: string | null;
  secondary_location?: string[] | null;
  relevance?: string | null;
  sdgs: string[] | null;
  signature_primary?: string | null;
  signature_secondary?: string[] | null;
  steep?: string | null;
  url?: string | null;
  connected_trends?: number[] | null;
  user_group_ids?: number[] | null;
  status?: string | null;
  modified_by?: string | null;
  steep_primary: string | null;
  steep_secondary?: string[] | null;
  assigned_to?: string | null;
  created_for?: string | null;
  created_by: string | null;
  created_unit?: string | null;
  score?: string | null;
  private?: boolean;
}

interface makeSignalFavoriteDataType {
  status: string | null;
}

export interface GetFavoriteSignalsParamsDataType {
  page?: number;
  per_page?: number;
}

export interface DigestRequestParams {
  recipients: string[];
  days?: number;
  status?: string[];
  limit?: number;
  test?: boolean;
}

export function searchSignals(params: BaseSignalsParamsDataType = {}) {
  const {
    page = 1,
    per_page = 10,
    order_by = 'created_at',
    direction = 'desc',
    statuses = ['Approved'],
    ids,
    created_by,
    created_for,
    steep_primary,
    steep_secondary,
    signature_primary,
    signature_secondary,
    sdgs,
    query,
    location,
    bureau,
    score,
    unit,
  } = params;

  const queryParams: Record<string, unknown> = {
    page,
    per_page,
    order_by,
    direction,
    statuses,
  };

  if (ids) queryParams.ids = ids;
  if (created_by) queryParams.created_by = created_by;
  if (created_for) queryParams.created_for = created_for;
  if (steep_primary) queryParams.steep_primary = steep_primary;
  if (steep_secondary) queryParams.steep_secondary = steep_secondary;
  if (signature_primary) queryParams.signature_primary = signature_primary;
  if (signature_secondary)
    queryParams.signature_secondary = signature_secondary;
  if (sdgs) queryParams.sdgs = sdgs;
  if (query) queryParams.query = query;
  if (location) queryParams.location = location;
  if (bureau) queryParams.bureau = bureau;
  if (score) queryParams.score = score;
  if (unit) queryParams.unit = unit;

  return axiosInstance
    .get<SignalsSearchResponseDataType>('/signals/search', {
      params: queryParams,
    })
    .then(response => {
      logger.debug(
        'API Call URL',
        axiosInstance.defaults.baseURL,
        '/signals/search',
        queryParams,
      );
      logger.debug('API Response Data', response.data);
      return response.data;
    })
    .catch(error => {
      if (isAxiosError(error)) {
        throw new Error(
          `Unable to search signals at the moment, try again later. ${error.response?.data?.message || error.message
          } `,
        );
      } else {
        throw new Error(`An unknown error occurred. ${error.message}`);
      }
    });
}

export function exportSignals(params: BaseSignalsParamsDataType = {}, format: 'excel' | 'csv' = 'excel') {
  const {
    page = 1,
    per_page = 10,
    order_by = 'created_at',
    direction = 'desc',
    statuses = ['Approved'],
    ids,
    created_by,
    created_for,
    steep_primary,
    steep_secondary,
    signature_primary,
    signature_secondary,
    sdgs,
    query,
    location,
    bureau,
    score,
    unit,
  } = params;

  const queryParams: Record<string, unknown> = {
    page,
    per_page,
    order_by,
    direction,
    statuses,
    format, // Add format parameter for backend
  };

  if (ids) queryParams.ids = ids;
  if (created_by) queryParams.created_by = created_by;
  if (created_for) queryParams.created_for = created_for;
  if (steep_primary) queryParams.steep_primary = steep_primary;
  if (steep_secondary) queryParams.steep_secondary = steep_secondary;
  if (signature_primary) queryParams.signature_primary = signature_primary;
  if (signature_secondary)
    queryParams.signature_secondary = signature_secondary;
  if (sdgs) queryParams.sdgs = sdgs;
  if (query) queryParams.query = query;
  if (location) queryParams.location = location;
  if (bureau) queryParams.bureau = bureau;
  if (score) queryParams.score = score;
  if (unit) queryParams.unit = unit;

  return axiosInstance
    .get<string>('/signals/export', {
      params: queryParams,
      responseType: 'blob',
    })
    .then(response => response.data)
    .catch(error => {
      if (isAxiosError(error)) {
        throw new Error(
          `Unable to export signals at the moment, try again later. ${error.response?.data?.message || error.message
          } `,
        );
      } else {
        throw new Error(`An unknown error occurred. ${error.message}`);
      }
    });
}

export function generateSignal(params: { url: string }) {
  const { url } = params;

  const queryParams: Record<string, unknown> = {
    url,
  };

  return axiosInstance
    .get<SignalDataType>('/signals/generation', { params: queryParams })
    .then(response => response.data)
    .catch(error => {
      if (isAxiosError(error)) {
        throw new Error(
          `Unable to generate signal at the moment, try again later. ${error.response?.data?.message || error.message
          } `,
        );
      } else {
        throw new Error(`An unknown error occurred. ${error.message}`);
      }
    });
}

export function readSignal(uid: number) {
  return axiosInstance
    .get<SignalDataType>(`/signals/${uid}/with-user-groups`)
    .then(response => response.data)
    .catch(error => {
      if (isAxiosError(error)) {
        throw new Error(
          `Unable to retrieve the signal at the moment, try again later. ${error.response?.data?.message || error.message
          } `,
        );
      } else {
        throw new Error(`An unknown error occurred. ${error.message}`);
      }
    });
}

export function readMySignals(params: ReadMySignalsParamsDataType) {
  const { status } = params;

  const queryParams: Record<string, unknown> = {
    status,
  };

  return axiosInstance
    .get<SignalDataType[]>('/signals/me', { params: queryParams })
    .then(response => response.data)
    .catch(error => {
      if (isAxiosError(error)) {
        throw new Error(
          `Unable to retrieve your signals at the moment, try again later. ${error.response?.data?.message || error.message
          } `,
        );
      } else {
        throw new Error(`An unknown error occurred. ${error.message}`);
      }
    });
}

export function createSignal(params: CreateSignalParamsDataType) {
  return axiosInstance
    .post<SignalDataType>('/signals', params)
    .then(response => response.data)
    .catch(error => {
      if (isAxiosError(error)) {
        throw new Error(
          `Unable to create signal at the moment, try again later. ${error.response?.data?.message || error.message
          } `,
        );
      } else {
        throw new Error(`An unknown error occurred. ${error.message}`);
      }
    });
}

export function makeSignalFavorite(
  signal_id: number,
  params: makeSignalFavoriteDataType,
) {
  return axiosInstance
    .post<makeSignalFavoriteDataType>(`/favourites/${signal_id}`, params)
    .then(response => response.data)
    .catch(error => {
      if (isAxiosError(error)) {
        throw new Error(
          `Unable to make the signal a favorite. ${error.response?.data?.message || error.message
          }`,
        );
      } else {
        // throw new Error(`An unknown error occurred. ${error.message}`);
      }
    });
}

export async function getfavoriteSignals(params: GetFavoriteSignalsParamsDataType = {}) {
  const {
    page = 1,
    per_page = 20,
  } = params;

  const queryParams: Record<string, unknown> = {
    page,
    per_page
  };

  try {
    const response = await axiosInstance.get<SignalDataType[]>('/favourites/', { params: queryParams });
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(
        `Unable to retrieve your favorite signals at the moment, try again later. ${error.response?.data?.message || error.message
        } `,
      );
    } else if (error instanceof Error) {
      throw new Error(`An unknown error occurred. ${error.message}`);
    } else {
      throw new Error('An unexpected error occurred while fetching favorites');
    }
  }
}

export function autoTaggingFetchNewsAPI() {
  return axiosInstance
    .get<AutoTaggingNewsDataType[]>('/signals/autocomplete')
    .then(response => response.data)
    .catch(error => {
      if (isAxiosError(error)) {
        throw new Error('Unable to fetch news article');
      } else {
        throw new Error(`An unknown error occured. ${error.message}`);
      }
    });
}

export function updateSignal(uid: number, params: UpdateSignalParamsDataType) {
  return axiosInstance
    .put<SignalDataType>(`/signals/${uid}`, params)
    .then(response => response.data)
    .catch(error => {
      if (isAxiosError(error)) {
        throw new Error(
          `Unable to update signal at the moment, try again later. ${error.response?.data?.message || error.message
          } `,
        );
      } else {
        throw new Error(`An unknown error occurred. ${error.message}`);
      }
    });
}

export function deleteSignal(uid: number) {
  return axiosInstance
    .delete<SignalDataType>(`/signals/${uid}`)
    .then(response => response.data)
    .catch(error => {
      if (isAxiosError(error)) {
        throw new Error(
          `Unable to delete the signal at the moment, try again later. ${error.response?.data?.message || error.message
          } `,
        );
      } else {
        throw new Error(`An unknown error occurred. ${error.message}`);
      }
    });
}

export async function triggerDigestEmail(params: DigestRequestParams) {
  try {
    const response = await axiosInstance.post<{ message: string }>(
      '/email/digest',
      params
    );
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(
        `Unable to trigger digest email. ${error.response?.data?.detail || error.message}`
      );
    } else if (error instanceof Error) {
      throw new Error(`An unknown error occurred. ${error.message}`);
    } else {
      throw new Error('An unexpected error occurred while triggering digest');
    }
  }
}
