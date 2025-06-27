import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { Loader2, MoreVertical, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import type {
  CreateShoppingListForm,
  ShoppingListModel,
} from '@/entities/shopping-list/types'
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
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { CreateShoppingListSchema } from '@/entities/shopping-list/schemas'
import { useShoppingList } from '@/shared/hooks/use-shopping-list'

export function ShoppingListsPage() {
  const initialValues = {
    name: 'Новый список',
  }

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [listToDelete, setListToDelete] = useState<string | null>(null)
  const [editingList, setEditingList] = useState<ShoppingListModel | null>(null)

  const form = useForm<CreateShoppingListForm>({
    resolver: zodResolver(CreateShoppingListSchema),
    defaultValues: initialValues,
  })

  const {
    create: createMutation,
    update: updateMutation,
    delete: deleteMutation,
    shoppingListsQuery,
  } = useShoppingList()

  const navigate = useNavigate()

  const shoppingLists = shoppingListsQuery.data

  const onSubmit = (
    data: ShoppingListModel | Omit<ShoppingListModel, 'id'>,
  ) => {
    if (editingList) {
      try {
        updateMutation.mutate({ ...editingList, ...data })
        setIsCreateDialogOpen(false)
        form.reset(initialValues)
        setEditingList(null)
      } catch (error) {
        console.error(error)
      }
    } else {
      try {
        createMutation.mutate(data)
        setIsCreateDialogOpen(false)
        form.reset(initialValues)
      } catch (error) {
        console.error(error)
      }
    }
  }

  const handleEdit = (list: ShoppingListModel) => {
    setEditingList(list)
    form.reset(list)
    setIsCreateDialogOpen(true)
  }

  const handleDeleteClick = (id: string) => {
    setListToDelete(id)
    setIsDeleteDialogOpen(true)
  }

  const handleRowClick = (list: ShoppingListModel, e: React.MouseEvent) => {
    const isMenuInteraction = (e.target as HTMLElement).closest(
      '[role="menu"], [role="menuitem"], [data-radix-collection-item]',
    )

    if (!isMenuInteraction) {
      navigate({
        to: '/shopping-list/$id',
        params: { id: list.id },
      })
    }
  }

  const confirmDelete = () => {
    if (listToDelete) {
      deleteMutation.mutate(listToDelete)
      setIsDeleteDialogOpen(false)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Мои списки</h1>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Создать новый список
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableBody>
            {shoppingLists.length === 0 && (
              <TableRow>
                <TableCell colSpan={2} className="text-center py-8">
                  Пока у вас нет списков, создайте новый
                </TableCell>
              </TableRow>
            )}

            {shoppingLists.map((list) => (
              <TableRow
                key={list.id}
                onClick={(e) => handleRowClick(list, e)}
                className="cursor-pointer"
              >
                <TableCell className="p-3">{list.name}</TableCell>
                <TableCell className="w-[50px]">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(list)}>
                        Переименовать
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => handleDeleteClick(list.id)}
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

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {!editingList ? 'Новый список' : editingList.name}
            </DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form
              id="create-shopping-list-form"
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
                        placeholder="Введите название  списка"
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
                setIsCreateDialogOpen(false)
                setEditingList(null)
                form.reset()
              }}
            >
              Отмена
            </Button>

            <Button
              type="submit"
              form="create-shopping-list-form"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting
                ? 'Сохраняем...'
                : editingList
                  ? 'Сохранить изменения'
                  : 'Создать'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Подтверждение удаления</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Вы уверены что хотите удалить данный список покупок</p>
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
              disabled={deleteMutation.isPending}
              className="text-gray-50"
            >
              {deleteMutation.isPending ? (
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
    </div>
  )
}
