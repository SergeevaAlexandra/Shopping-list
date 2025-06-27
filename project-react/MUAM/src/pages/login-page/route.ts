import { createRoute } from '@tanstack/react-router'
import LoginPage from './ui/LoginPage'
import { rootRoute } from '@/app/routes/index-route'

export const LoginPageRoute = createRoute({
  path: '/login',
  component: LoginPage,
  getParentRoute: () => rootRoute,
})
