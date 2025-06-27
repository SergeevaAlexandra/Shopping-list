import { createRoute } from '@tanstack/react-router'
import { ShoppingListsPageRoute } from '../shopping-lists-page/route'
import { ShoppingListPage } from './ui/ShoppingListPage'
import { rootRoute } from '@/app/routes/index-route'

export const ShoppingListPageRoute = createRoute({
  path: '/shopping-list/$id',
  component: ShoppingListPage,
  getParentRoute: () => rootRoute,
})
