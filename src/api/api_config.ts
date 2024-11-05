/* eslint-disable no-param-reassign */
import axios from 'axios';
import QueryString from 'qs';
import { API_BASEURL } from '../Constants';
import {
  refreshHandler,
  signOutClickHandler,
} from '../Utils/AuthStatusHandler';

export const axiosInstance = axios.create({
  baseURL: API_BASEURL,
  headers: {
    'Content-Type': 'application/json',
    access_token: localStorage.getItem('token'),
  },
  paramsSerializer: {
    serialize: params => {
      return QueryString.stringify(params, { arrayFormat: 'repeat' });
    },
  },
  timeout: 60000,
});

axiosInstance.interceptors.request.use(
  async config => {
    const accessToken = localStorage.getItem('token');
    const accessTokenExp = localStorage.getItem('tokenExp');

    if (!accessToken || Number(accessTokenExp) < Date.now() / 1000) {
      try {
        const [newAccessToken, newAccessTokenExp] = await refreshHandler();

        if (newAccessToken && newAccessTokenExp) {
          config.headers.access_token = newAccessToken;
          localStorage.setItem('token', String(newAccessToken));
          localStorage.setItem('tokenExp', String(newAccessTokenExp));
        } else {
          throw new Error('Failed to refresh access token');
        }
      } catch (error) {
        localStorage.clear();
        await signOutClickHandler();
        throw error;
      }
    } else {
      config.headers.access_token = accessToken;
    }

    return config;
  },
  error => {
    return Promise.reject(error);
  },
);
