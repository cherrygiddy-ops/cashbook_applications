
import axios, { type AxiosRequestConfig } from "axios";
import { useAuthStore } from "@/Store/AuthStore";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Automatically attach the JWT to authenticated requests.
axiosInstance.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

class APICLIENT<TRequest, TResponse> {
  endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  // Get all records.
  getAll = (config?: AxiosRequestConfig) => {
    return axiosInstance
      .get<TResponse[]>(this.endpoint, config)
      .then((res) => res.data);
  };

  // Get one record by ID.
  get = (id: number | string) => {
    return axiosInstance
      .get<TResponse>(`${this.endpoint}/${id}`)
      .then((res) => res.data);
  };

  // Create a record.
  create = (entity: TRequest) => {
    return axiosInstance
      .post<TResponse>(this.endpoint, entity)
      .then((res) => res.data);
  };

  // Update a record.
  update = (id: number | string, entity: TRequest) => {
    return axiosInstance
      .put<TResponse>(`${this.endpoint}/${id}`, entity)
      .then((res) => res.data);
  };

  // Delete a record.
  delete = (id: number | string) => {
    return axiosInstance
      .delete(`${this.endpoint}/${id}`)
      .then((res) => res.data);
  };

  // Login: POST /auth/login
  login = (entity: TRequest) => {
    return axiosInstance
      .post<TResponse>(`${this.endpoint}/login`, entity)
      .then((res) => res.data);
  };

  // Signup: POST /auth
  signUp = (entity: TRequest) => {
    return axiosInstance
      .post<TResponse>(this.endpoint, entity)
      .then((res) => res.data);
  };
}

export default APICLIENT;
