import type { z } from 'zod'
import type {
  CreateItemSchema,
  ItemSchema,
  ItemsSchema,
  UpdateItemCategorySchema,
  UpdateItemListSchema,
  UpdateItemSchema,
} from './schemas'

export type ItemModel = z.infer<typeof ItemSchema>
export type GetItemResponse = z.infer<typeof ItemSchema>
export type GetAllItemsResponse = z.infer<typeof ItemsSchema>

export type CreateItemForm = z.infer<typeof CreateItemSchema>
export type UpdateItemCategoryForm = z.infer<typeof UpdateItemCategorySchema>
export type CreateItemRequest = z.infer<typeof CreateItemSchema>
export type UpdateItemRequest = z.infer<typeof UpdateItemSchema>

export type UpdateItemList = z.infer<typeof UpdateItemListSchema>
