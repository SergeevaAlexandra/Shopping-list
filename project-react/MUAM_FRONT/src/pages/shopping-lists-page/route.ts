import { createRoute } from '@tanstack/react-router'
import { ShoppingListsPage } from './ui/ShoppingListsPage'
import { rootRoute } from '@/app/routes/index-route'

export const ShoppingListsPageRoute = createRoute({
  path: '/shopping-lists',
  component: ShoppingListsPage,
  getParentRoute: () => rootRoute,
})
