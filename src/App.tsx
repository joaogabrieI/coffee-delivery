import { Route, Routes } from 'react-router-dom'
import { PageLayout } from './components/PageLayout'
import { Checkout } from './pages/Checkout'
import { Home } from './pages/Home'
import { NotFound } from './pages/NotFound'
import { Success } from './pages/Success'

/** Apenas o mapa de rotas (RF-07). Nenhuma regra de negócio aqui. */
export function App() {
  return (
    <Routes>
      <Route element={<PageLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/success" element={<Success />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
