import { createRoute } from '@tanstack/react-router'
import { ItemsPage } from './ui/ItemsPage'
import { rootRoute } from '@/app/routes/index-route'

export const ItemsPageRoute = createRoute({
  path: '/items',
  component: ItemsPage,
  getParentRoute: () => rootRoute,
})
