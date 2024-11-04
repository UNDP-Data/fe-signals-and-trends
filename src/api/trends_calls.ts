/* eslint-disable @typescript-eslint/naming-convention */
import { isAxiosError } from 'axios';
import { axiosInstance } from './api_config';
import {
  BaseTrendsParams,
  CreateTrendParams,
  TrendDataType,
  TrendSearchResponse,
  UpdateTrendParams,
} from '../Types';

export function searchTrends(params: BaseTrendsParams = {}) {
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
    assigned_to,
    time_horizon,
    impact_rating,
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
  if (assigned_to) queryParams.assigned_to = assigned_to;
  if (time_horizon) queryParams.time_horizon = time_horizon;
  if (impact_rating) queryParams.impact_rating = impact_rating;

  return axiosInstance
    .get<TrendSearchResponse>('/trends/search', { params: queryParams })
    .then(response => response.data)
    .catch(error => {
      if (isAxiosError(error)) {
        throw new Error(
          `Unable to search trends at the moment, try again later. ${
            error.response?.data?.message || error.message
          } `,
        );
      } else {
        throw new Error(`An unknown error occurred. ${error.message}`);
      }
    });
}

export function readTrend(uid: number) {
  return axiosInstance
    .get<TrendDataType>(`/trends/${uid}`)
    .then(response => response.data)
    .catch(error => {
      if (isAxiosError(error)) {
        throw new Error(
          `Unable to retrieve the trend at the moment, try again later. ${
            error.response?.data?.message || error.message
          } `,
        );
      } else {
        throw new Error(`An unknown error occurred. ${error.message}`);
      }
    });
}

export function exportTrends(params: BaseTrendsParams = {}) {
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
    assigned_to,
    time_horizon,
    impact_rating,
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
  if (assigned_to) queryParams.assigned_to = assigned_to;
  if (time_horizon) queryParams.time_horizon = time_horizon;
  if (impact_rating) queryParams.impact_rating = impact_rating;

  return axiosInstance
    .get<string>('/trends/export', {
      params: queryParams,
      responseType: 'blob',
    })
    .then(response => response.data)
    .catch(error => {
      if (isAxiosError(error)) {
        throw new Error(
          `Unable to export trends at the moment, try again later. ${
            error.response?.data?.message || error.message
          } `,
        );
      } else {
        throw new Error(`An unknown error occurred. ${error.message}`);
      }
    });
}

export function createTrend(params: CreateTrendParams) {
  return axiosInstance
    .post<TrendDataType>('/trends', params)
    .then(response => response.data)
    .catch(error => {
      if (isAxiosError(error)) {
        throw new Error(
          `Unable to create trend at the moment, try again later. ${
            error.response?.data?.message || error.message
          } `,
        );
      } else {
        throw new Error(`An unknown error occurred. ${error.message}`);
      }
    });
}

export function updateTrend(uid: number, params: UpdateTrendParams) {
  return axiosInstance
    .put<TrendDataType>(`/trends/${uid}`, params)
    .then(response => response.data)
    .catch(error => {
      if (isAxiosError(error)) {
        throw new Error(
          `Unable to update trend at the moment, try again later. ${
            error.response?.data?.message || error.message
          } `,
        );
      } else {
        throw new Error(`An unknown error occurred. ${error.message}`);
      }
    });
}

export function deleteTrend(uid: number) {
  return axiosInstance
    .delete<TrendDataType>(`/trends/${uid}`)
    .then(response => response.data)
    .catch(error => {
      if (isAxiosError(error)) {
        throw new Error(
          `Unable to delete the trend at the moment, try again later. ${
            error.response?.data?.message || error.message
          } `,
        );
      } else {
        throw new Error(`An unknown error occurred. ${error.message}`);
      }
    });
}
