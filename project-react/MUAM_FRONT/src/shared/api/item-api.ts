import { z } from 'zod'
import { apiClient } from './client'
import type {
  CreateItemRequest,
  GetAllItemsResponse,
  GetItemResponse,
  UpdateItemRequest,
} from '@/entities/item/types'
import {
  CreateItemSchema,
  ItemSchema,
  ItemsSchema,
} from '@/entities/item/schemas'

export const itemsService = {
  async getAllItems() {
    return apiClient.get<GetAllItemsResponse>('/items/', ItemsSchema)
  },

  async getItem(id: string) {
    return apiClient.get<GetItemResponse>(`/item/${id}/`, ItemSchema)
  },

  async createItem(data: CreateItemRequest) {
    return apiClient.post('/item/', CreateItemSchema, data)
  },

  async updateItem(data: UpdateItemRequest) {
    return apiClient.patch(`/item/${data.id}/update/`, z.object({}), {
      name: data.name,
      category: data.category,
    })
  },

  async deleteItem(uuid: string) {
    return apiClient.delete(`/item/${uuid}/delete/`, z.string())
  },
}
