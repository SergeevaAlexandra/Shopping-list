import { z } from 'zod'
import { apiClient } from './client'
import type {
  CreateShoppingListRequest,
  GetAllShoppingListsResponse,
  GetShoppingListResponse,
  UpdateShoppingListItems,
  UpdateShoppingListRequest,
} from '@/entities/shopping-list/types'
import type { UpdateItemList } from '@/entities/item/types'
import {
  CreateShoppingListResponseSchema,
  ShoppingListExtendedSchema,
  ShoppingListsSchema,
} from '@/entities/shopping-list/schemas'

export const shoppingListService = {
  async getAllShoppingLists() {
    return apiClient.get<GetAllShoppingListsResponse>(
      'shopping-lists',
      ShoppingListsSchema,
    )
  },

  async getShoppingList(uuid: string) {
    return apiClient.get<GetShoppingListResponse>(
      `shopping-list/${uuid}/`,
      ShoppingListExtendedSchema,
    )
  },

  async createShoppingList(data: CreateShoppingListRequest) {
    return apiClient.post(
      'shopping-list/',
      CreateShoppingListResponseSchema,
      data,
    )
  },

  async updateShoppingList(data: UpdateShoppingListRequest) {
    return apiClient.patch(
      `shopping-list/${data.id}/update/`,
      z.object({}),
      data,
    )
  },

  async deleteShoppingList(uuid: string) {
    return apiClient.delete(`shopping-list/${uuid}/delete/`, z.string())
  },

  async addItemToShoppingList(data: UpdateShoppingListItems) {
    return apiClient.post(`list-item/`, z.object({}), data)
  },

  async deleteItemFromShoppingList(data: string) {
    return apiClient.delete(`list-item/${data}/delete/`, z.string())
  },

  async updateItemFromShoppingList(itemList: UpdateItemList) {
    const { id, ...data } = itemList
    return apiClient.patch(`list-item/${id}/update/`, z.string(), data)
  },
}
