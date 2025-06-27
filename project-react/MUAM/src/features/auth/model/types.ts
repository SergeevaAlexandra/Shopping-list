import type {
  LoginResponseSchema,
  LoginSchema,
  RegisterResponseSchema,
  RegisterSchema,
  UserResponseSchema,
} from '@/features/auth/model/schemas'
import type z from 'zod'

export type LoginRequest = z.infer<typeof LoginSchema>
export type LoginFormSchema = z.infer<typeof LoginSchema>
export type LoginResponse = z.infer<typeof LoginResponseSchema>

export type RegisterFormSchema = z.infer<typeof RegisterSchema>
export type RegisterRequest = z.infer<typeof RegisterSchema>
export type RegisterResponse = z.infer<typeof RegisterResponseSchema>

export type UserResponse = z.infer<typeof UserResponseSchema>
