import { createRoute } from '@tanstack/react-router'
import RegisterPage from './ui/RegisterPage'
import { rootRoute } from '@/app/routes/index-route'

export const RegisterPageRoute = createRoute({
  path: '/register',
  component: RegisterPage,
  getParentRoute: () => rootRoute,
})
