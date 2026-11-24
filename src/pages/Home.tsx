import { CoffeeCatalog } from '../components/CoffeeCatalog'
import { Hero } from '../components/Hero'
import { coffees } from '../data/coffees'

export function Home() {
  return (
    <>
      <Hero />
      <CoffeeCatalog coffees={coffees} />
    </>
  )
}
