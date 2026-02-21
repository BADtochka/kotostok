import axios, { type AxiosRequestConfig, type AxiosResponse } from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => console.error("[API ERROR]", error),
);

export const makeRequest = <Response = any>(config: AxiosRequestConfig) =>
  apiClient.request<undefined, AxiosResponse<Response>>(config);
