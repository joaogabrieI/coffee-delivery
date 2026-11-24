import 'styled-components'
import type { AppTheme } from './themes'

// Tipa `props.theme` em todos os styled-components.
declare module 'styled-components' {
  export interface DefaultTheme extends AppTheme {}
}
