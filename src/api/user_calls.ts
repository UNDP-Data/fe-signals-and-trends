/* eslint-disable @typescript-eslint/naming-convention */
import { isAxiosError } from 'axios';
import { axiosInstance } from './api_config';
import {
  CurrentUserResponse,
  ReadUserParams,
  SearchUsersParams,
  UpdateUserParams,
  UpdateUserResponse,
  UserDataTypeResponse,
  UserSearchResponse,
} from '../Types';

export function readCurrentUser() {
  return axiosInstance
    .get<CurrentUserResponse>('/users/me')
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

export function searchUsers(params: SearchUsersParams = {}) {
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
    .get<UserSearchResponse>('/users/search', { params: queryParams })
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

export function readUser(params: ReadUserParams) {
  const { uid } = params;

  return axiosInstance
    .get<UserDataTypeResponse>(`/users/${uid}`)
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

export function updateUser(uid: number, params: UpdateUserParams) {
  return axiosInstance
    .put<UpdateUserResponse>(`/users/${uid}`, params)
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
