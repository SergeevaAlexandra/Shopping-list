import z from 'zod'

export const UserModel = z.object({
  name: z.string(),
  login: z.string(),
  uuid: z.string().uuid(),
})
