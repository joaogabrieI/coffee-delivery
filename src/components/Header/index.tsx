import { Link } from 'react-router-dom'
import { CartBadge } from '../CartBadge'
import { Logo } from '../Logo'
import { ThemeToggle } from '../ThemeToggle'
import { Actions, HeaderBar, HeaderContent } from './styles'

export function Header() {
  return (
    <HeaderBar>
      <HeaderContent>
        <Link to="/">
          <Logo />
          <span className="sr-only"> — página inicial</span>
        </Link>

        <Actions>
          <ThemeToggle />
          <CartBadge />
        </Actions>
      </HeaderContent>
    </HeaderBar>
  )
}
