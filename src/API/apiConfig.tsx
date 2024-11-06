/* eslint-disable no-param-reassign */
import axios from 'axios';
import QueryString from 'qs';
import { API_BASEURL } from '../Constants';
import { refreshHandler } from '../Utils/AuthStatusHandler';
import { getLocalStorage, setLocalStorage } from '../Utils/UpdateLocalStrage';

export const axiosInstance = axios.create({
  baseURL: API_BASEURL,
  headers: {
    'Content-Type': 'application/json',
    access_token: getLocalStorage().token,
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
    const { token, tokenExp } = getLocalStorage();
    if (!token || !tokenExp || new Date(tokenExp as string) < new Date()) {
      const [newAccessToken, newAccessTokenExp] = await refreshHandler();
      if (newAccessToken && newAccessTokenExp) {
        config.headers.access_token = newAccessToken;
        setLocalStorage('token', String(newAccessToken));
        setLocalStorage('tokenExp', String(newAccessTokenExp));
      }
    } else {
      config.headers.access_token = token;
    }

    return config;
  },
  error => {
    return Promise.reject(error);
  },
);
