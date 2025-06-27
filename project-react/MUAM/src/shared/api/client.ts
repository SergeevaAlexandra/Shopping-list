/* eslint-disable @typescript-eslint/naming-convention */
import axios from 'axios'
import type { ZodSchema } from 'zod'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/'

export class ApiClient {
  private instance: AxiosInstance

  constructor() {
    this.instance = axios.create({
      baseURL: BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    this.instance.interceptors.request.use((config) => {
      const token = localStorage.getItem('accessToken')

      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    })

    this.instance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true

          try {
            const refreshToken = localStorage.getItem('refreshToken')
            if (!refreshToken) throw new Error('No refresh token')

            const response = await axios.post(`${BASE_URL}user/refresh/`, {
              refresh: refreshToken,
            })
            const { access } = response.data

            localStorage.setItem('accessToken', access)
            originalRequest.headers.Authorization = `Bearer ${access}`
            return this.instance(originalRequest)
          } catch (refreshError) {
            localStorage.removeItem('accessToken')
            localStorage.removeItem('refreshToken')
            window.location.href = '/login'
            return Promise.reject(refreshError)
          }
        }

        return Promise.reject(error)
      },
    )
  }

  private request<T, D = unknown>(
    schema: ZodSchema<T>,
    config: AxiosRequestConfig<D>,
  ): Promise<T> {
    return this.instance
      .request(config)
      .then((response) => {
        return schema.parse(response.data)
      })
      .catch((error) => {
        throw new Error(error)
      })
  }

  public async get<T, D = unknown>(
    url: string,
    schema: ZodSchema<T>,
    config?: AxiosRequestConfig<D>,
  ): Promise<T> {
    return this.request(schema, {
      method: 'GET',
      url,
      ...config,
    })
  }

  public async post<T, D = unknown>(
    url: string,
    schema: ZodSchema<T>,
    data?: D,
    config?: AxiosRequestConfig<D>,
  ): Promise<T> {
    return this.request(schema, {
      method: 'POST',
      url,
      data,
      ...config,
    })
  }

  public async put<T, D = unknown>(
    url: string,
    schema: ZodSchema<T>,
    data?: D,
    config?: AxiosRequestConfig<D>,
  ): Promise<T> {
    return this.request(schema, {
      method: 'PUT',
      url,
      data,
      ...config,
    })
  }

  public async patch<T, D = unknown>(
    url: string,
    schema: ZodSchema<T>,
    data?: D,
    config?: AxiosRequestConfig<D>,
  ): Promise<T> {
    return this.request(schema, {
      method: 'PATCH',
      url,
      data,
      ...config,
    })
  }

  public async delete<T>(
    url: string,
    schema: ZodSchema<T>,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    return this.request(schema, {
      method: 'DELETE',
      url,
      ...config,
    })
  }
}

export const apiClient = new ApiClient()
