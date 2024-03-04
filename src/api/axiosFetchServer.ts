import axios, { InternalAxiosRequestConfig } from "axios";
import { Cookies } from "react-cookie";

export const axiosFetchServer = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
});

const cookie = new Cookies();

// APIの前処理
axiosFetchServer.interceptors.request.use(async (config) => {
  const token = cookie.get("token");

  return {
    ...config,
    headers: {
      "Content-Type": "application/json",
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
