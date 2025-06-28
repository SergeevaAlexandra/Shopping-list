import type z from 'zod'
import type { CategorySchema } from './schema'

export type CategoryModel = z.infer<typeof CategorySchema>
