import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { itemsService } from '@/shared/api/item-api'
import { shoppingListService } from '@/shared/api/shopping-list-api'

export const useShoppingList = () => {
  const queryClient = useQueryClient()

  const createListMutation = useMutation({
    mutationFn: shoppingListService.createShoppingList,
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['Shopping-Lists'] })
    },
    onError: (error) => {
      console.error('Error happen', error)
    },
  })

  const updateListMutation = useMutation({
    mutationFn: shoppingListService.updateShoppingList,
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['Shopping-Lists'] })
    },
    onError: (error) => {
      console.error('Error happen', error)
    },
  })

  const deleteListMutation = useMutation({
    mutationFn: shoppingListService.deleteShoppingList,
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['Shopping-Lists'] })
    },
    onError: (error) => {
      console.error('Error happen', error)
    },
  })

  const addItemsMutation = useMutation({
    mutationFn: shoppingListService.addItemToShoppingList,
    onSuccess: (_, request) => {
      queryClient.refetchQueries({ queryKey: ['List', request.list] })
    },
    onError: (error) => {
      console.error('Error happen', error)
    },
  })

  const deleteItemMutation = useMutation({
    mutationFn: shoppingListService.deleteItemFromShoppingList,

    onError: (error) => {
      console.error('Error happen', error)
    },

    meta: {},
  })

  const getShoppingList = (uuid: string) => {
    return useQuery({
      queryKey: ['List', uuid],
      queryFn: async () => {
        const response = await shoppingListService.getShoppingList(uuid)
        return response
      },
      enabled: !!uuid,
    })
  }

  const shoppingListsQuery = useQuery({
    queryKey: ['Shopping-Lists'],
    initialData: [],
    queryFn: async () => {
      const response = await shoppingListService.getAllShoppingLists()

      return response
    },
    enabled: !!localStorage.getItem('accessToken'),
  })

  return {
    create: createListMutation,

    update: updateListMutation,

    delete: deleteListMutation,

    addItems: addItemsMutation,

    deleteItem: deleteItemMutation,

    shoppingListsQuery,

    getShoppingList,
  }
}
