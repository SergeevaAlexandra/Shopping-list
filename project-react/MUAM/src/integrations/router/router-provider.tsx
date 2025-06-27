import { Link, RouterProvider, createRouter } from '@tanstack/react-router'
import type { ShoppingListModel } from '@/entities/shopping-list/types'
import { routeTree } from '@/app/routes/routes'

const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
  defaultNotFoundComponent: () => {
    return (
      <div>
        <p>Not found!</p>
        <Link to="/">Go home</Link>
      </div>
    )
  },
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
  interface HistoryState {
    shoppingList?: ShoppingListModel
  }
}

export function Provider({ children }: { children: React.ReactNode }) {
  return <RouterProvider router={router} />
}
