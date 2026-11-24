import { Link } from 'react-router-dom'
import { Logo } from '../Logo'
import { ThemeToggle } from '../ThemeToggle'
import { Actions, HeaderBar, HeaderContent } from './styles'

export function Header() {
  return (
    <HeaderBar>
      <HeaderContent>
        <Link to="/" aria-label="Coffee Delivery — página inicial">
          <Logo />
        </Link>

        <Actions>
          <ThemeToggle />
        </Actions>
      </HeaderContent>
    </HeaderBar>
  )
}
