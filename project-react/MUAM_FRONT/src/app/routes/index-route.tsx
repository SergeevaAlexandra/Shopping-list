import {
  Outlet,
  createRootRoute,
  createRoute,
  useMatchRoute,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { ReactQueryDevtools as TanStackQueryLayout } from '@tanstack/react-query-devtools'
import App from '@/App'
import { MainMenu } from '@/widgets/menu/ui/Menu'
import { Toaster } from '@/components/ui/sonner'
import { redirect } from '@tanstack/react-router'

export function RootComponent() {
  const hideNavRoutes = ['/login', '/register']

  const matchRoute = useMatchRoute()

  const matchedHideNavRoutes = !hideNavRoutes.some((route) =>
    matchRoute({ to: route }),
  )

  return (
    <>
      {matchedHideNavRoutes && <MainMenu />}
      <Toaster position="top-right" />
      <Outlet />
      <TanStackRouterDevtools />
      <TanStackQueryLayout></TanStackQueryLayout>
    </>
  )
}

export const rootRoute = createRootRoute({
  component: RootComponent,
})

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: App,
  loader: () => {
    redirect({to: '/shopping-lists',  throw: true, })
  }
})
