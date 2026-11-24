import { useEffect, useRef } from 'react'
import { Outlet, useLocation } from 'react-router-dom'

/**
 * Layout comum a todas as rotas: link "Pular para o conteúdo", Header e <main>.
 * A cada troca de rota rola ao topo e move o foco para o <h1> da página
 * (leitores de tela anunciam a nova página — TECH_SPEC §7).
 */
export function PageLayout() {
  const { pathname } = useLocation()
  const mainRef = useRef<HTMLElement>(null)
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    window.scrollTo(0, 0)
    const heading = mainRef.current?.querySelector('h1')
    if (heading) {
      heading.setAttribute('tabindex', '-1')
      heading.focus()
    }
  }, [pathname])

  return (
    <>
      <a href="#conteudo">Pular para o conteúdo</a>
      <main id="conteudo" ref={mainRef}>
        <Outlet />
      </main>
    </>
  )
}
