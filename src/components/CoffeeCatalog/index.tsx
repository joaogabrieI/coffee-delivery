import type { Coffee } from '../../types/coffee'
import { CoffeeCard } from '../CoffeeCard'
import { CatalogSection, Grid } from './styles'

interface CoffeeCatalogProps {
  coffees: Coffee[]
}

export function CoffeeCatalog({ coffees }: CoffeeCatalogProps) {
  return (
    <CatalogSection aria-labelledby="catalog-title">
      <h2 id="catalog-title">Nossos cafés</h2>
      <Grid>
        {coffees.map((coffee) => (
          <li key={coffee.id}>
            <CoffeeCard coffee={coffee} />
          </li>
        ))}
      </Grid>
    </CatalogSection>
  )
}
