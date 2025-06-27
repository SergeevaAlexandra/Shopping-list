import { Link, useMatchRoute } from '@tanstack/react-router'
import { Home, ShoppingBasket, User } from 'lucide-react'
import { Logo } from './Logo'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/shared/hooks/use-auth'

export function MainMenu() {
  const matchRoute = useMatchRoute()

  const auth = useAuth()

  function handleLogout() {
    auth.logout()
  }

  return (
    <div className="flex justify-between items-center p-4 bg-gray-100 dark:bg-gray-800">
      <Logo />

      <nav className="flex justify-center items-center   gap-1">
        <Button
          variant={
            matchRoute({ to: '/shopping-lists', fuzzy: true })
              ? 'default'
              : 'ghost'
          }
          asChild
          className={cn('gap-2')}
        >
          <Link to="/shopping-lists">
            <Home className="h-4 w-4" />
            <span>Списки</span>
          </Link>
        </Button>

        <Button
          variant={matchRoute({ to: '/items' }) ? 'default' : 'ghost'}
          asChild
          className={cn('gap-2')}
        >
          <Link to="/items">
            <ShoppingBasket className="h-4 w-4" />
            <span>Товары</span>
          </Link>
        </Button>
      </nav>

      <Button
        variant="outline"
        className={cn('gap-2')}
        onClick={() => {
          handleLogout()
        }}
      >
        <span>Выйти</span>
      </Button>
    </div>
  )
}
