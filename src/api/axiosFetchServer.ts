import axios, { InternalAxiosRequestConfig } from 'axios';
import { Cookies } from 'react-cookie';

const cookie = new Cookies();
const token = cookie.get('token');

export const axiosFetchServer = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
});

// APIの前処理
axiosFetchServer.interceptors.request.use(async (config) => {
  return {
    ...config,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  } as InternalAxiosRequestConfig<any>;
});

axiosFetchServer.interceptors.response.use(
  (response) => {
    return response;
  },
  (err) => {
    throw err.response;
  }
);
