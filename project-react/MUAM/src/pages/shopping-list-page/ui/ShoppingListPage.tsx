import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { useParams } from '@tanstack/react-router'
import { Loader2, MoreVertical, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import type {
  CreateItemForm,
  ItemModel,
  UpdateItemRequest,
} from '@/entities/item/types'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { CreateItemSchema } from '@/entities/item/schemas'
import { useItem } from '@/shared/hooks/use-item'
import { useShoppingList } from '@/shared/hooks/use-shopping-list'

export function ShoppingListPage() {
  const initialValues = {
    name: 'Товар',
    category: 'Категория',
  }

  const [isAddItemsDialogOpen, setIsAddItemsDialogOpen] = useState(false)
  const [isEditItemDialogOpen, setIsEditItemDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<string | null>(null)
  const [editingItem, setEditingItem] = useState<ItemModel | null>(null)

  const { id: shoppingListId } = useParams({
    from: '/shopping-list/$id',
  })

  const form = useForm<CreateItemForm>({
    resolver: zodResolver(CreateItemSchema),
    defaultValues: initialValues,
  })

  const queryClient = useQueryClient()

  const {
    addItems: shoppingListAddItem,
    deleteItem: shoppingListDeleteItem,
    getShoppingList,
  } = useShoppingList()

  const {
    Items: { data: allItems },
    update: updateMutation,
  } = useItem()

  const { data: shoppingList } = getShoppingList(shoppingListId)

  const handleDeleteClick = (uuid: string) => {
    setItemToDelete(uuid)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (itemToDelete) {
      shoppingListDeleteItem.mutate(itemToDelete, {
        onSuccess() {
          queryClient.refetchQueries({ queryKey: ['List', shoppingList?.id] })
        },
      })
      setIsDeleteDialogOpen(false)
      setItemToDelete(null)
    }
  }

  const handleRowClick = (item: ItemModel) => {
    const listItem = {
      list: shoppingList!.id,
      items: [item.id],
    }

    shoppingListAddItem.mutate(listItem)
  }

  const handleEdit = (item: ItemModel) => {
    setEditingItem(item)
    form.reset({ category: item.category.name, name: item.name })
    setIsEditItemDialogOpen(true)
  }

  const onSubmit = (data: CreateItemForm) => {
    try {
      const newItem = {
        ...editingItem,
        ...data,
      } as unknown as UpdateItemRequest

      updateMutation.mutate(newItem, {
        onSuccess() {
          queryClient.refetchQueries({ queryKey: ['List', shoppingList?.id] })
        },
      })
      
      setIsEditItemDialogOpen(false)
      form.reset(initialValues)
      setEditingItem(null)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{shoppingList?.name}</h1>
        <Button onClick={() => setIsAddItemsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Добавить товар
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell className="p-3">
                <span className="font-bold ">Название</span>
              </TableCell>
              <TableCell>
                {' '}
                <span className="font-bold">Категория</span>
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {shoppingList?.items.length === 0 && (
              <TableRow>
                <TableCell colSpan={2} className="text-center py-8">
                  В списке товаров, добавьте новые
                </TableCell>
              </TableRow>
            )}

            {shoppingList?.items.map((item) => (
              <TableRow key={item.id} className="cursor-pointer">
                <TableCell className="p-3">{item.item.name}</TableCell>
                <TableCell>{item.item.category.name}</TableCell>
                <TableCell className="w-[50px]">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(item.item)}>
                        Обновить
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => handleDeleteClick(item.id)}
                      >
                        Удалить
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog
        open={isAddItemsDialogOpen}
        onOpenChange={setIsAddItemsDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Товары</DialogTitle>
          </DialogHeader>

          <Table>
            <TableHeader>
              <TableRow>
                <TableCell className="p-3">
                  <span className="font-bold ">Название</span>
                </TableCell>
                <TableCell>
                  {' '}
                  <span className="font-bold">Категория</span>
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allItems.length === 0 && (
                <TableRow>
                  <TableCell colSpan={2} className="text-center py-8">
                    В базе нет товаров, добавьте новые
                  </TableCell>
                </TableRow>
              )}

              {allItems.map((item) => (
                <TableRow
                  key={item.id}
                  className="cursor-pointer"
                  onClick={() => handleRowClick(item)}
                >
                  <TableCell className="p-3">{item.name}</TableCell>
                  <TableCell>{item.category.name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Подтверждение удаления</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Вы уверены что хотите удалить данный товар</p>
            <p className="text-sm text-muted-foreground">
              это действие нельзя отменить
            </p>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Отменить</Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={shoppingListDeleteItem.isPending}
              className="text-gray-50"
            >
              {shoppingListDeleteItem.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Удаляем...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Удалить
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isEditItemDialogOpen}
        onOpenChange={setIsEditItemDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {!editingItem ? 'Новый товар' : editingItem.name}
            </DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form
              id="create-item-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Название</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Введите название  товара"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Категория</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Введите название категории"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditItemDialogOpen(false)
                setEditingItem(null)
                form.reset()
              }}
            >
              Отмена
            </Button>

            <Button
              type="submit"
              form="create-item-form"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting
                ? 'Сохраняем...'
                : editingItem
                  ? 'Сохранить изменения'
                  : 'Создать'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
