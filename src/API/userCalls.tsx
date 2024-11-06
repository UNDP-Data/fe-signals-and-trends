/* eslint-disable @typescript-eslint/naming-convention */
import { isAxiosError } from 'axios';
import { axiosInstance } from './apiConfig';
import {
  AllowedRolesDataType,
  CurrentUserResponseDataType,
  UserDataType,
} from '../Types';

interface UpdateUserResponseDataType {
  acclab: boolean;
  email: string;
  name: string;
  role: string;
  unit: string;
}

export interface UpdateUserParamsDataType {
  acclab?: boolean;
  email?: string;
  name?: string;
  role?: AllowedRolesDataType;
  id?: number;
  unit?: string;
}

export interface UserDataTypeResponseDataType {
  acclab: boolean;
  email: string;
  id: number;
  name: string;
  role: string;
  unit: string;
}

export interface ReadUserParamsDataType {
  uid: number;
}

export interface UserSearchResponseDataType {
  per_page: number;
  current_page: number;
  total_pages: number;
  total_count: number;
  data: UserDataType[];
}

export interface SearchUsersParamsDataType {
  page?: number;
  per_page?: number;
  order_by?: string;
  direction?: 'desc' | 'asc';
  roles?: AllowedRolesDataType[];
  query?: string;
}

export function readCurrentUser() {
  return axiosInstance
    .get<CurrentUserResponseDataType>('/users/me')
    .then(response => response.data)
    .catch(error => {
      if (isAxiosError(error)) {
        throw new Error(
          `Unable to retrieve current user information at the moment, try again later. ${
            error.response?.data?.message || error.message
          } `,
        );
      } else {
        throw new Error(`An unknown error occurred. ${error.message}`);
      }
    });
}

export function searchUsers(params: SearchUsersParamsDataType = {}) {
  const {
    page = 1,
    per_page = 10,
    order_by = 'created_at',
    direction = 'desc',
    roles = ['Visitor', 'Curator', 'Admin'],
    query,
  } = params;

  const queryParams: Record<string, unknown> = {
    page,
    per_page,
    order_by,
    direction,
    roles,
  };

  if (query) queryParams.query = query;

  return axiosInstance
    .get<UserSearchResponseDataType>('/users/search', { params: queryParams })
    .then(response => response.data)
    .catch(error => {
      if (isAxiosError(error)) {
        throw new Error(
          `Unable to search users at the moment, try again later. ${
            error.response?.data?.message || error.message
          } `,
        );
      } else {
        throw new Error(`An unknown error occurred. ${error.message}`);
      }
    });
}

export function readUser(params: ReadUserParamsDataType) {
  const { uid } = params;

  return axiosInstance
    .get<UserDataTypeResponseDataType>(`/users/${uid}`)
    .then(response => response.data)
    .catch(error => {
      if (isAxiosError(error)) {
        throw new Error(
          `Unable to retrieve the user at the moment, try again later. ${
            error.response?.data?.message || error.message
          } `,
        );
      } else {
        throw new Error(`An unknown error occurred. ${error.message}`);
      }
    });
}

export function updateUser(uid: number, params: UpdateUserParamsDataType) {
  return axiosInstance
    .put<UpdateUserResponseDataType>(`/users/${uid}`, params)
    .then(response => response.data)
    .catch(error => {
      if (isAxiosError(error)) {
        throw new Error(
          `Unable to update user at the moment, try again later. ${
            error.response?.data?.message || error.message
          } `,
        );
      } else {
        throw new Error(`An unknown error occurred. ${error.message}`);
      }
    });
}
