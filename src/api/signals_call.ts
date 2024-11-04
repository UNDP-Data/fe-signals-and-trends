/* eslint-disable @typescript-eslint/naming-convention */
import { isAxiosError } from 'axios';
import { axiosInstance } from './api_config';
import {
  BaseSignalsParams,
  CreateSignalParams,
  ReadMySignalsParams,
  SignalsSearchResponse,
  SignalDataType,
  UpdateSignalParams,
} from '../Types';

export function searchSignals(params: BaseSignalsParams = {}) {
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
    .get<SignalsSearchResponse>('/signals/search', { params: queryParams })
    .then(response => response.data)
    .catch(error => {
      if (isAxiosError(error)) {
        throw new Error(
          `Unable to search signals at the moment, try again later. ${
            error.response?.data?.message || error.message
          } `,
        );
      } else {
        throw new Error(`An unknown error occurred. ${error.message}`);
      }
    });
}

export function exportSignals(params: BaseSignalsParams = {}) {
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
    .get<string>('/signals/export', {
      params: queryParams,
      responseType: 'blob',
    })
    .then(response => response.data)
    .catch(error => {
      if (isAxiosError(error)) {
        throw new Error(
          `Unable to export signals at the moment, try again later. ${
            error.response?.data?.message || error.message
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
          `Unable to generate signal at the moment, try again later. ${
            error.response?.data?.message || error.message
          } `,
        );
      } else {
        throw new Error(`An unknown error occurred. ${error.message}`);
      }
    });
}

export function readSignal(uid: number) {
  return axiosInstance
    .get<SignalDataType>(`/signals/${uid}`)
    .then(response => response.data)
    .catch(error => {
      if (isAxiosError(error)) {
        throw new Error(
          `Unable to retrieve the signal at the moment, try again later. ${
            error.response?.data?.message || error.message
          } `,
        );
      } else {
        throw new Error(`An unknown error occurred. ${error.message}`);
      }
    });
}

export function readMySignals(params: ReadMySignalsParams) {
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
          `Unable to retrieve your signals at the moment, try again later. ${
            error.response?.data?.message || error.message
          } `,
        );
      } else {
        throw new Error(`An unknown error occurred. ${error.message}`);
      }
    });
}

export function createSignal(params: CreateSignalParams) {
  return axiosInstance
    .post<SignalDataType>('/signals', params)
    .then(response => response.data)
    .catch(error => {
      if (isAxiosError(error)) {
        throw new Error(
          `Unable to create signal at the moment, try again later. ${
            error.response?.data?.message || error.message
          } `,
        );
      } else {
        throw new Error(`An unknown error occurred. ${error.message}`);
      }
    });
}

export function updateSignal(uid: number, params: UpdateSignalParams) {
  return axiosInstance
    .put<SignalDataType>(`/signals/${uid}`, params)
    .then(response => response.data)
    .catch(error => {
      if (isAxiosError(error)) {
        throw new Error(
          `Unable to update signal at the moment, try again later. ${
            error.response?.data?.message || error.message
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
          `Unable to delete the signal at the moment, try again later. ${
            error.response?.data?.message || error.message
          } `,
        );
      } else {
        throw new Error(`An unknown error occurred. ${error.message}`);
      }
    });
}
