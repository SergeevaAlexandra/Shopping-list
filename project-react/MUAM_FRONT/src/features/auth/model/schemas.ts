import z from 'zod'

export const LoginSchema = z.object({
  username: z.string().nonempty('Введите имя'),
  password: z.string().nonempty('Введите пароль'),
})

export const LoginResponseSchema = z.object({
  refresh: z.string(),
  access: z.string(),
})

export const RegisterResponseSchema = z.object({
  username: z.string(),
})

export const RegisterSchema = z
  .object({
    username: z.string().nonempty('Пожалуйста, введите имя'),
    password: z.string().min(8, 'Пароль должен быть не менее 8 символов'),
    confirm_password: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: 'Пароли не совпадают',
    path: ['confirm_password'],
  })

export const UserResponseSchema = z.object({
  username: z.string(),
})
