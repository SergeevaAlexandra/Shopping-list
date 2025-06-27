import z from 'zod'
import { CategorySchema } from '../category/schema'

export const ItemSchema = z.object({
  name: z.string(),
  category: CategorySchema,
  id: z.string().uuid(),
})

export const ItemListSchema = z.object({
  id: z.string().uuid(),
  item: z.object({
    id: z.string().uuid(),
    name: z.string(),

    category: CategorySchema,
  }),
  checked: z.boolean(),
})

export const ItemsSchema = z.array(ItemSchema)

export const CreateItemSchema = z.object({
  name: z.string(),
  category: z.string(),
})

export const UpdateItemCategorySchema = z.object({
  category: z.string(),
})

export const UpdateItemSchema = z.object({
  name: z.string().optional(),
  category: z.string().optional(),
  id: z.string().uuid(),
})
