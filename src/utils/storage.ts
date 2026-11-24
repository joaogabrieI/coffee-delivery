/**
 * Acesso defensivo ao localStorage (PRD §6.4): modo privado, cota cheia ou
 * JSON corrompido nunca derrubam a aplicação — no pior caso, volta ao estado inicial.
 */

/** Chaves versionadas: mudar o sufixo invalida dados de versões antigas. */
export const STORAGE_KEYS = {
  cart: 'coffee-delivery:cart:v1',
  theme: 'coffee-delivery:theme',
  lastOrder: 'coffee-delivery:last-order:v1',
} as const

/**
 * Lê e valida um valor. `validate` recebe `unknown` e devolve o valor tipado
 * ou `null` se o formato estiver errado.
 */
export function readStorage<T>(key: string, validate: (value: unknown) => T | null): T | null {
  try {
    const raw = localStorage.getItem(key)
    if (raw === null) return null
    return validate(JSON.parse(raw))
  } catch {
    return null
  }
}

export function writeStorage(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Sem persistência disponível: a aplicação segue funcionando em memória.
  }
}

export function removeStorage(key: string): void {
  try {
    localStorage.removeItem(key)
  } catch {
    // idem
  }
}
