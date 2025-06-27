import type { z } from 'zod'
import type {
  CreateShoppingListResponseSchema,
  CreateShoppingListSchema,
  ShoppingListExtendedSchema,
  ShoppingListSchema,
  ShoppingListsSchema,
  UpdateShoppingListItemsSchema,
  UpdateShoppingListSchema,
} from './schemas'

export type ShoppingListModel = z.infer<typeof ShoppingListSchema>
export type ShoppingListUpdateModel = z.infer<typeof UpdateShoppingListSchema>
export type GetShoppingListResponse = z.infer<typeof ShoppingListExtendedSchema>
export type GetAllShoppingListsResponse = z.infer<typeof ShoppingListsSchema>

export type CreateShoppingListForm = z.infer<typeof CreateShoppingListSchema>
export type CreateShoppingListRequest = z.infer<typeof CreateShoppingListSchema>
export type CreateShoppingListResponse = z.infer<typeof CreateShoppingListResponseSchema>


export type UpdateShoppingList = z.infer<typeof UpdateShoppingListSchema>
export type UpdateShoppingListRequest = z.infer<typeof UpdateShoppingListSchema>
export type UpdateShoppingListResponse = z.infer<typeof UpdateShoppingListSchema>


export type UpdateShoppingListItems = z.infer<typeof UpdateShoppingListItemsSchema>
