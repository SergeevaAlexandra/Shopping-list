import z from 'zod'
import { ItemListSchema, ItemSchema } from '../item/schemas'

export const ShoppingListSchema = z.object({
  name: z.string(),
  id: z.string().uuid(),
})

export const ShoppingListExtendedSchema = z.object({
  name: z.string(),
  id: z.string().uuid(),
  items: z.array(ItemListSchema),
})

export const ShoppingListsSchema = z.array(ShoppingListSchema)

export const CreateShoppingListSchema = z.object({
  name: z.string(),
})

export const CreateShoppingListResponseSchema = z.object({
  name: z.string(),
  id: z.string().uuid(),
})

export const UpdateShoppingListSchema = z.object({
  id: z.string().uuid(),
  name: z.string().optional(),
  items: z.array(ItemSchema).optional(),
})

export const UpdateShoppingListItemsSchema = z.object({
  list: z.string().uuid(),
  items: z.array(z.string().uuid()),
})
