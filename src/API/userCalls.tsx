/* eslint-disable @typescript-eslint/naming-convention */
import { isAxiosError } from 'axios';
import { axiosInstance } from './apiConfig';
import {
  AllowedRolesDataType,
  CurrentUserResponseDataType,
  UserDataType,
  UserGroupDataType,
} from '../Types';
import logger from '../logger';

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

export interface UserGroupResponseDataType {
  id: number;
  name: string;
  signal_ids?: number[];
  user_ids?: number[];
  collaborator_map?: Record<string, number[]>;
  users?: UserDataType[];
}

export function readCurrentUser() {
  const methodName = 'readCurrentUser';
  const url = '/users/me';
  const startTime = performance.now();

  try {
    // Only call logger if it's available
    logger.logApiCall(methodName, url);
  } catch (e) {
    console.warn('Logger error:', e);
  }

  return axiosInstance
    .get<CurrentUserResponseDataType>(url)
    .then(response => {
      const timeMs = Math.round(performance.now() - startTime);
      try {
        logger.logApiResponse(methodName, url, response.data, timeMs);
      } catch (e) {
        console.warn('Logger error:', e);
      }
      return response.data;
    })
    .catch(error => {
      const timeMs = Math.round(performance.now() - startTime);
      try {
        logger.logApiError(methodName, url, error, timeMs);
      } catch (e) {
        console.warn('Logger error:', e);
      }

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
    roles,
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

  const methodName = 'searchUsers';
  const url = '/users/search';
  const startTime = performance.now();

  try {
    logger.logApiCall(methodName, url, queryParams);
  } catch (e) {
    console.warn('Logger error:', e);
  }

  return axiosInstance
    .get<UserSearchResponseDataType>(url, { params: queryParams })
    .then(response => {
      const timeMs = Math.round(performance.now() - startTime);
      try {
        logger.logApiResponse(methodName, url, response.data, timeMs);
      } catch (e) {
        console.warn('Logger error:', e);
      }
      return response.data;
    })
    .catch(error => {
      const timeMs = Math.round(performance.now() - startTime);
      try {
        logger.logApiError(methodName, url, error, timeMs);
      } catch (e) {
        console.warn('Logger error:', e);
      }

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

  const methodName = 'readUser';
  const url = `/users/${uid}`;
  const startTime = performance.now();

  try {
    logger.logApiCall(methodName, url, { uid });
  } catch (e) {
    console.warn('Logger error:', e);
  }

  return axiosInstance
    .get<UserDataTypeResponseDataType>(url)
    .then(response => {
      const timeMs = Math.round(performance.now() - startTime);
      try {
        logger.logApiResponse(methodName, url, response.data, timeMs);
      } catch (e) {
        console.warn('Logger error:', e);
      }
      return response.data;
    })
    .catch(error => {
      const timeMs = Math.round(performance.now() - startTime);
      try {
        logger.logApiError(methodName, url, error, timeMs);
      } catch (e) {
        console.warn('Logger error:', e);
      }

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
  const methodName = 'updateUser';
  const url = `/users/${uid}`;
  const startTime = performance.now();

  try {
    logger.logApiCall(methodName, url, params);
  } catch (e) {
    console.warn('Logger error:', e);
  }

  return axiosInstance
    .put<UpdateUserResponseDataType>(url, params)
    .then(response => {
      const timeMs = Math.round(performance.now() - startTime);
      try {
        logger.logApiResponse(methodName, url, response.data, timeMs);
      } catch (e) {
        console.warn('Logger error:', e);
      }
      return response.data;
    })
    .catch(error => {
      const timeMs = Math.round(performance.now() - startTime);
      try {
        logger.logApiError(methodName, url, error, timeMs);
      } catch (e) {
        console.warn('Logger error:', e);
      }

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

export function listUserGroups() {
  const methodName = 'listUserGroups';
  const url = '/user-groups/me';
  const startTime = performance.now();

  try {
    logger.logApiCall(methodName, url);
  } catch (e) {
    console.warn('Logger error:', e);
  }

  return axiosInstance
    .get<UserGroupResponseDataType[]>(url)
    .then(response => {
      const timeMs = Math.round(performance.now() - startTime);
      try {
        logger.logApiResponse(methodName, url, response.data, timeMs);
      } catch (e) {
        console.warn('Logger error:', e);
      }
      return response.data;
    })
    .catch(error => {
      const timeMs = Math.round(performance.now() - startTime);
      try {
        logger.logApiError(methodName, url, error, timeMs);
      } catch (e) {
        console.warn('Logger error:', e);
      }

      if (isAxiosError(error)) {
        throw new Error(
          `Unable to retrieve user groups at the moment, try again later. ${
            error.response?.data?.message || error.message
          } `,
        );
      }
      throw new Error(`An unknown error occurred. ${error.message}`);
    });
}

export function getUserGroupsWithSignals() {
  const methodName = 'getUserGroupsWithSignals';
  const url = '/user-groups/me/with-signals';
  const startTime = performance.now();

  try {
    logger.logApiCall(methodName, url);
  } catch (e) {
    console.warn('Logger error:', e);
  }

  return axiosInstance
    .get<UserGroupResponseDataType[]>(url)
    .then(response => {
      const timeMs = Math.round(performance.now() - startTime);
      try {
        logger.logApiResponse(methodName, url, response.data, timeMs);
      } catch (e) {
        console.warn('Logger error:', e);
      }
      return response.data;
    })
    .catch(error => {
      const timeMs = Math.round(performance.now() - startTime);
      try {
        logger.logApiError(methodName, url, error, timeMs);
      } catch (e) {
        console.warn('Logger error:', e);
      }

      if (isAxiosError(error)) {
        throw new Error(
          `Unable to retrieve user groups with signals at the moment, try again later. ${
            error.response?.data?.message || error.message
          } `,
        );
      }
      throw new Error(`An unknown error occurred. ${error.message}`);
    });
}

export function createUserGroup(group: { name: string; user_ids?: number[]; users?: string[]; admins?: string[] }) {
  const methodName = 'createUserGroup';
  const url = '/user-groups';
  const startTime = performance.now();

  try {
    logger.logApiCall(methodName, url, group);
  } catch (e) {
    console.warn('Logger error:', e);
  }

  // Create a payload that matches the backend expectation
  const payload = {
    name: group.name,
    user_ids: group.user_ids || [],
  };

  return axiosInstance
    .post<UserGroupResponseDataType>(url, payload)
    .then(response => {
      const timeMs = Math.round(performance.now() - startTime);
      try {
        logger.logApiResponse(methodName, url, response.data, timeMs);
      } catch (e) {
        console.warn('Logger error:', e);
      }
      return response.data;
    })
    .catch(error => {
      const timeMs = Math.round(performance.now() - startTime);
      try {
        logger.logApiError(methodName, url, error, timeMs);
      } catch (e) {
        console.warn('Logger error:', e);
      }

      if (isAxiosError(error)) {
        throw new Error(
          `Unable to create user group at the moment, try again later. ${
            error.response?.data?.message || error.message
          } `,
        );
      }
      throw new Error(`An unknown error occurred. ${error.message}`);
    });
}

export function getUserGroup(groupId: number) {
  const methodName = 'getUserGroup';
  const url = `/user-groups/${groupId}`;
  const startTime = performance.now();

  try {
    logger.logApiCall(methodName, url, { groupId });
  } catch (e) {
    console.warn('Logger error:', e);
  }

  return axiosInstance
    .get<UserGroupDataType>(url)
    .then(response => {
      const timeMs = Math.round(performance.now() - startTime);
      try {
        logger.logApiResponse(methodName, url, response.data, timeMs);
      } catch (e) {
        console.warn('Logger error:', e);
      }
      return response.data;
    })
    .catch(error => {
      const timeMs = Math.round(performance.now() - startTime);
      try {
        logger.logApiError(methodName, url, error, timeMs);
      } catch (e) {
        console.warn('Logger error:', e);
      }

      if (isAxiosError(error)) {
        throw new Error(
          `Unable to retrieve user group at the moment, try again later. ${
            error.response?.data?.message || error.message
          } `,
        );
      }
      throw new Error(`An unknown error occurred. ${error.message}`);
    });
}

export function updateUserGroup(groupId: number, group: UserGroupResponseDataType & { admins?: string[] }) {
  const methodName = 'updateUserGroup';
  const url = `/user-groups/${groupId}`;
  const startTime = performance.now();

  try {
    logger.logApiCall(methodName, url, { groupId, group });
  } catch (e) {
    console.warn('Logger error:', e);
  }

  // Create a payload that includes admin information if provided
  const payload = {
    ...group,
    admin_emails: group.admins || []
  };

  // Remove the admins field as it's not expected by the API
  if ('admins' in payload) {
    delete payload.admins;
  }

  return axiosInstance
    .put<UserGroupResponseDataType>(url, payload)
    .then(response => {
      const timeMs = Math.round(performance.now() - startTime);
      try {
        logger.logApiResponse(methodName, url, response.data, timeMs);
      } catch (e) {
        console.warn('Logger error:', e);
      }
      return response.data;
    })
    .catch(error => {
      const timeMs = Math.round(performance.now() - startTime);
      try {
        logger.logApiError(methodName, url, error, timeMs);
      } catch (e) {
        console.warn('Logger error:', e);
      }

      if (isAxiosError(error)) {
        throw new Error(
          `Unable to update user group at the moment, try again later. ${
            error.response?.data?.message || error.message
          } `,
        );
      }
      throw new Error(`An unknown error occurred. ${error.message}`);
    });
}

export function deleteUserGroup(groupId: number) {
  const methodName = 'deleteUserGroup';
  const url = `/user-groups/${groupId}`;
  const startTime = performance.now();

  try {
    logger.logApiCall(methodName, url, { groupId });
  } catch (e) {
    console.warn('Logger error:', e);
  }

  return axiosInstance
    .delete<boolean>(url)
    .then(response => {
      const timeMs = Math.round(performance.now() - startTime);
      try {
        logger.logApiResponse(methodName, url, response.data, timeMs);
      } catch (e) {
        console.warn('Logger error:', e);
      }
      return response.data;
    })
    .catch(error => {
      const timeMs = Math.round(performance.now() - startTime);
      try {
        logger.logApiError(methodName, url, error, timeMs);
      } catch (e) {
        console.warn('Logger error:', e);
      }

      if (isAxiosError(error)) {
        throw new Error(
          `Unable to delete user group at the moment, try again later. ${
            error.response?.data?.message || error.message
          } `,
        );
      }
      throw new Error(`An unknown error occurred. ${error.message}`);
    });
}

export function addUserToGroup(groupId: number, userIdOrEmail: string) {
  const methodName = 'addUserToGroup';
  const url = `/user-groups/${groupId}/users/${userIdOrEmail}`;
  const startTime = performance.now();

  try {
    logger.logApiCall(methodName, url, { groupId, userIdOrEmail });
  } catch (e) {
    console.warn('Logger error:', e);
  }

  return axiosInstance
    .post<boolean>(url)
    .then(response => {
      const timeMs = Math.round(performance.now() - startTime);
      try {
        logger.logApiResponse(methodName, url, response.data, timeMs);
      } catch (e) {
        console.warn('Logger error:', e);
      }
      return response.data;
    })
    .catch(error => {
      const timeMs = Math.round(performance.now() - startTime);
      try {
        logger.logApiError(methodName, url, error, timeMs);
      } catch (e) {
        console.warn('Logger error:', e);
      }

      if (isAxiosError(error)) {
        throw new Error(
          `Unable to add user to group at the moment, try again later. ${
            error.response?.data?.message || error.message
          } `,
        );
      }
      throw new Error(`An unknown error occurred. ${error.message}`);
    });
}

export function addUserToGroupByEmail(groupId: number, email: string) {
  const methodName = 'addUserToGroupByEmail';
  const url = `/user-groups/${groupId}/users`;
  const startTime = performance.now();

  try {
    logger.logApiCall(methodName, url, { groupId, email });
  } catch (e) {
    console.warn('Logger error:', e);
  }

  return axiosInstance
    .post<boolean>(url, { email })
    .then(response => {
      const timeMs = Math.round(performance.now() - startTime);
      try {
        logger.logApiResponse(methodName, url, response.data, timeMs);
      } catch (e) {
        console.warn('Logger error:', e);
      }
      return response.data;
    })
    .catch(error => {
      const timeMs = Math.round(performance.now() - startTime);
      try {
        logger.logApiError(methodName, url, error, timeMs);
      } catch (e) {
        console.warn('Logger error:', e);
      }

      if (isAxiosError(error)) {
        throw new Error(
          `Unable to add user to group at the moment, try again later. ${
            error.response?.data?.message || error.message
          } `,
        );
      }
      throw new Error(`An unknown error occurred. ${error.message}`);
    });
}

export function removeUserFromGroup(groupId: number, userIdOrEmail: string) {
  const methodName = 'removeUserFromGroup';
  const url = `/user-groups/${groupId}/users/${userIdOrEmail}`;
  const startTime = performance.now();

  try {
    logger.logApiCall(methodName, url, { groupId, userIdOrEmail });
  } catch (e) {
    console.warn('Logger error:', e);
  }

  return axiosInstance
    .delete<boolean>(url)
    .then(response => {
      const timeMs = Math.round(performance.now() - startTime);
      try {
        logger.logApiResponse(methodName, url, response.data, timeMs);
      } catch (e) {
        console.warn('Logger error:', e);
      }
      return response.data;
    })
    .catch(error => {
      const timeMs = Math.round(performance.now() - startTime);
      try {
        logger.logApiError(methodName, url, error, timeMs);
      } catch (e) {
        console.warn('Logger error:', e);
      }

      if (isAxiosError(error)) {
        throw new Error(
          `Unable to remove user from group at the moment, try again later. ${
            error.response?.data?.message || error.message
          } `,
        );
      }
      throw new Error(`An unknown error occurred. ${error.message}`);
    });
}

export function addSignalToUserGroup(signalId: number, groupId: number) {
  const methodName = 'addSignalToUserGroup';
  const url = `/user-groups/${groupId}/signals/${signalId}`;
  const startTime = performance.now();

  try {
    logger.logApiCall(methodName, url, { signalId, groupId });
  } catch (e) {
    console.warn('Logger error:', e);
  }

  return axiosInstance
    .post<boolean>(url)
    .then(response => {
      const timeMs = Math.round(performance.now() - startTime);
      try {
        logger.logApiResponse(methodName, url, response.data, timeMs);
      } catch (e) {
        console.warn('Logger error:', e);
      }
      return response.data;
    })
    .catch(error => {
      const timeMs = Math.round(performance.now() - startTime);
      try {
        logger.logApiError(methodName, url, error, timeMs);
      } catch (e) {
        console.warn('Logger error:', e);
      }

      if (isAxiosError(error)) {
        throw new Error(
          `Unable to add signal to user group at the moment, try again later. ${
            error.response?.data?.message || error.message
          } `,
        );
      }
      throw new Error(`An unknown error occurred. ${error.message}`);
    });
}

export function removeSignalFromUserGroup(signalId: number, groupId: number) {
  const methodName = 'removeSignalFromUserGroup';
  const url = `/user-groups/${groupId}/signals/${signalId}`;
  const startTime = performance.now();

  try {
    logger.logApiCall(methodName, url, { signalId, groupId });
  } catch (e) {
    console.warn('Logger error:', e);
  }

  return axiosInstance
    .delete<boolean>(url)
    .then(response => {
      const timeMs = Math.round(performance.now() - startTime);
      try {
        logger.logApiResponse(methodName, url, response.data, timeMs);
      } catch (e) {
        console.warn('Logger error:', e);
      }
      return response.data;
    })
    .catch(error => {
      const timeMs = Math.round(performance.now() - startTime);
      try {
        logger.logApiError(methodName, url, error, timeMs);
      } catch (e) {
        console.warn('Logger error:', e);
      }

      if (isAxiosError(error)) {
        throw new Error(
          `Unable to remove signal from user group at the moment, try again later. ${
            error.response?.data?.message || error.message
          } `,
        );
      }
      throw new Error(`An unknown error occurred. ${error.message}`);
    });
}

export function addCollaboratorToSignalInGroup(groupId: number, signalId: number, userIdOrEmail: string) {
  const methodName = 'addCollaboratorToSignalInGroup';
  const url = `/user-groups/${groupId}/signals/${signalId}/collaborators/${userIdOrEmail}`;
  const startTime = performance.now();

  try {
    logger.logApiCall(methodName, url, { groupId, signalId, userIdOrEmail });
  } catch (e) {
    console.warn('Logger error:', e);
  }

  return axiosInstance
    .post<boolean>(url)
    .then(response => {
      const timeMs = Math.round(performance.now() - startTime);
      try {
        logger.logApiResponse(methodName, url, response.data, timeMs);
      } catch (e) {
        console.warn('Logger error:', e);
      }
      return response.data;
    })
    .catch(error => {
      const timeMs = Math.round(performance.now() - startTime);
      try {
        logger.logApiError(methodName, url, error, timeMs);
      } catch (e) {
        console.warn('Logger error:', e);
      }

      if (isAxiosError(error)) {
        throw new Error(
          `Unable to add collaborator to signal at the moment, try again later. ${
            error.response?.data?.message || error.message
          } `,
        );
      }
      throw new Error(`An unknown error occurred. ${error.message}`);
    });
}

export function addCollaboratorToSignalByEmail(groupId: number, signalId: number, email: string) {
  const methodName = 'addCollaboratorToSignalByEmail';
  const url = `/user-groups/${groupId}/${signalId}/collaborators`;
  const startTime = performance.now();

  try {
    logger.logApiCall(methodName, url, { groupId, signalId, email });
  } catch (e) {
    console.warn('Logger error:', e);
  }

  return axiosInstance
    .post<boolean>(url, { email })
    .then(response => {
      const timeMs = Math.round(performance.now() - startTime);
      try {
        logger.logApiResponse(methodName, url, response.data, timeMs);
      } catch (e) {
        console.warn('Logger error:', e);
      }
      return response.data;
    })
    .catch(error => {
      const timeMs = Math.round(performance.now() - startTime);
      try {
        logger.logApiError(methodName, url, error, timeMs);
      } catch (e) {
        console.warn('Logger error:', e);
      }

      if (isAxiosError(error)) {
        throw new Error(
          `Unable to add collaborator to signal at the moment, try again later. ${
            error.response?.data?.message || error.message
          } `,
        );
      }
      throw new Error(`An unknown error occurred. ${error.message}`);
    });
}

export function removeCollaboratorFromSignalInGroup(groupId: number, signalId: number, userIdOrEmail: string) {
  const methodName = 'removeCollaboratorFromSignalInGroup';
  const url = `/user-groups/${groupId}/signals/${signalId}/collaborators/${userIdOrEmail}`;
  const startTime = performance.now();

  try {
    logger.logApiCall(methodName, url, { groupId, signalId, userIdOrEmail });
  } catch (e) {
    console.warn('Logger error:', e);
  }

  return axiosInstance
    .delete<boolean>(url)
    .then(response => {
      const timeMs = Math.round(performance.now() - startTime);
      try {
        logger.logApiResponse(methodName, url, response.data, timeMs);
      } catch (e) {
        console.warn('Logger error:', e);
      }
      return response.data;
    })
    .catch(error => {
      const timeMs = Math.round(performance.now() - startTime);
      try {
        logger.logApiError(methodName, url, error, timeMs);
      } catch (e) {
        console.warn('Logger error:', e);
      }

      if (isAxiosError(error)) {
        throw new Error(
          `Unable to remove collaborator from signal at the moment, try again later. ${
            error.response?.data?.message || error.message
          } `,
        );
      }
      throw new Error(`An unknown error occurred. ${error.message}`);
    });
}

export function getAllUserGroups() {
  const methodName = 'getAllUserGroups';
  const url = '/user-groups';
  const startTime = performance.now();

  try {
    logger.logApiCall(methodName, url);
  } catch (e) {
    console.warn('Logger error:', e);
  }

  return axiosInstance
    .get<UserGroupResponseDataType[]>(url)
    .then(response => {
      const timeMs = Math.round(performance.now() - startTime);
      try {
        logger.logApiResponse(methodName, url, response.data, timeMs);
      } catch (e) {
        console.warn('Logger error:', e);
      }
      return response.data;
    })
    .catch(error => {
      const timeMs = Math.round(performance.now() - startTime);
      try {
        logger.logApiError(methodName, url, error, timeMs);
      } catch (e) {
        console.warn('Logger error:', e);
      }

      if (isAxiosError(error)) {
        throw new Error(
          `Unable to retrieve all user groups at the moment, try again later. ${
            error.response?.data?.message || error.message
          } `,
        );
      }
      throw new Error(`An unknown error occurred. ${error.message}`);
    });
}
