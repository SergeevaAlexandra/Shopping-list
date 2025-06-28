import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { itemsService } from '@/shared/api/item-api'

export const useItem = () => {
  const queryClient = useQueryClient()

  const createItemMutation = useMutation({
    mutationFn: itemsService.createItem,
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['Items'] })
    },
    onError: (error) => {
      console.error('Error happen', error)
    },
  })

  const updateItemMutation = useMutation({
    mutationFn: itemsService.updateItem,
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['Items'] })
    },
    onError: (error) => {
      console.error('Error happen', error)
    },
  })

  const deleteItemMutation = useMutation({
    mutationFn: itemsService.deleteItem,
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['Items'] })
    },
    onError: (error) => {
      console.error('Error happen', error)
    },
  })

  const getItem = (uuid: string) => {
    return useQuery({
      queryKey: ['Items', uuid],
      queryFn: async () => {
        const response = await itemsService.getItem(uuid)
        return response
      },
      enabled: !!uuid,
    })
  }

  const ItemsQuery = useQuery({
    queryKey: ['Items'],
    queryFn: async () => {
      const response = await itemsService.getAllItems()
      return response
    },
    initialData: [],
    enabled: !!localStorage.getItem('accessToken'),
  })

  return {
    create: createItemMutation,

    update: updateItemMutation,

    delete: deleteItemMutation,

    Items: ItemsQuery,

    getItem,
  }
}
