import { indexRoute, rootRoute } from './index-route'
import { ShoppingListsPageRoute } from '@/pages/shopping-lists-page/route'
import { LoginPageRoute } from '@/pages/login-page/route'
import { RegisterPageRoute } from '@/pages/register-page/route'
import { ItemsPageRoute } from '@/pages/items-page/route'
import { ShoppingListPageRoute } from '@/pages/shopping-list-page/route'

export const routeTree = rootRoute.addChildren([
  indexRoute,
  LoginPageRoute,
  RegisterPageRoute,
  ShoppingListsPageRoute,
  ItemsPageRoute,
  ShoppingListPageRoute,
])
