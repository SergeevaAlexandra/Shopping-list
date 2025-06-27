import z from 'zod'
import { LoginResponseSchema, RegisterResponseSchema, UserResponseSchema } from '../model/schemas'
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
} from '../model/types'
import { apiClient } from '@/shared/api/client'

export const authService = {
  async login(credentials: LoginRequest) {
    return apiClient.post<LoginResponse>(
      'user/login/',
      LoginResponseSchema,
      credentials,
    )
  },

  async register(userData: RegisterRequest) {
    return apiClient.post('user/register/', RegisterResponseSchema, userData)
  },

  async logout() {
    const refresh = localStorage.getItem('refreshToken')

    if (refresh)
      return apiClient.post('user/logout/', z.object({}), { refresh })
  },

  async getCurrentUser() {
    return apiClient.get('user/me/', UserResponseSchema)
  },
}
