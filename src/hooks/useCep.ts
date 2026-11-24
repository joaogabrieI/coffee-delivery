import { useCallback, useEffect, useRef, useState } from 'react'
import { type CepAddress, CepNotFoundError, fetchAddressByCep, onlyDigits } from '../utils/cep'

export type CepStatus = 'idle' | 'loading' | 'success' | 'not-found' | 'error'

/** Tempo máximo de espera pela API antes de considerar "indisponível". */
export const CEP_TIMEOUT_MS = 8000

/**
 * Consulta de CEP (RF-08, RN-07). É disparada por EVENTO (o usuário completou
 * o CEP ou clicou em "tentar novamente"), não por efeito.
 * - Só consulta com 8 dígitos.
 * - Cancela a requisição anterior (AbortController) — vale a última digitada.
 * - Aborta após CEP_TIMEOUT_MS.
 */
export function useCep() {
  const [status, setStatus] = useState<CepStatus>('idle')
  const controllerRef = useRef<AbortController | null>(null)
  const lastCepRef = useRef('')

  // Ao sair da página, cancela o que estiver pendente.
  useEffect(() => () => controllerRef.current?.abort(), [])

  const lookup = useCallback(async (cep: string): Promise<CepAddress | null> => {
    controllerRef.current?.abort()

    const digits = onlyDigits(cep)
    lastCepRef.current = digits
    if (digits.length !== 8) {
      setStatus('idle')
      return null
    }

    const controller = new AbortController()
    controllerRef.current = controller
    let timedOut = false
    const timer = setTimeout(() => {
      timedOut = true
      controller.abort()
    }, CEP_TIMEOUT_MS)

    setStatus('loading')
    try {
      const data = await fetchAddressByCep(digits, controller.signal)
      setStatus('success')
      return data
    } catch (error) {
      // Cancelada porque o usuário digitou outro CEP: ignora o resultado antigo.
      if (controller.signal.aborted && !timedOut) return null
      setStatus(error instanceof CepNotFoundError ? 'not-found' : 'error')
      return null
    } finally {
      clearTimeout(timer)
    }
  }, [])

  const retry = useCallback(() => lookup(lastCepRef.current), [lookup])

  return { status, lookup, retry }
}
