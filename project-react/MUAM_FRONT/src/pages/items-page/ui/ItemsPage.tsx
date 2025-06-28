import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, MoreVertical, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import type { CreateItemForm, ItemModel } from '@/entities/item/types'
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

export function ItemsPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<string | null>(null)
  const [editingItem, setEditingItem] = useState<ItemModel | null>(null)

  const initialValues = {
    name: 'Товар',
    category: 'Категория',
  }

  const form = useForm<CreateItemForm>({
    resolver: zodResolver(CreateItemSchema),
    defaultValues: initialValues,
  })

  const {
    create: createMutation,
    update: updateMutation,
    delete: deleteMutation,
    Items,
  } = useItem()

  const items = Items.data

  const onSubmit = (data: CreateItemForm) => {
    if (editingItem) {
      try {
        updateMutation.mutate({ ...editingItem, ...data })
        setIsCreateDialogOpen(false)
        form.reset(initialValues)
        setEditingItem(null)
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

  const handleEdit = (item: ItemModel) => {
    setEditingItem(item)
    form.reset({ name: item.name, category: item.category.name })
    setIsCreateDialogOpen(true)
  }

  const handleDeleteClick = (uuid: string) => {
    setItemToDelete(uuid)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (itemToDelete) {
      deleteMutation.mutate(itemToDelete)
      setIsDeleteDialogOpen(false)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Товары</h1>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Создать новый товар
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
            {items.length === 0 && (
              <TableRow>
                <TableCell colSpan={2} className="text-center py-8">
                  В базе нет товаров, добавьте новые
                </TableCell>
              </TableRow>
            )}

            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="p-3">{item.name}</TableCell>
                <TableCell>{item.category.name}</TableCell>
                <TableCell className="w-[50px]">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(item)}>
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

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
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
                setIsCreateDialogOpen(false)
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
