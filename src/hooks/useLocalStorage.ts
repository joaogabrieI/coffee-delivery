import { useEffect, useState } from 'react'
import { readStorage, removeStorage, writeStorage } from '../utils/storage'

/**
 * `useState` sincronizado com o localStorage.
 * - Leitura: uma vez, no inicializador preguiçoso, com validação.
 * - Escrita: em `useEffect`, sempre que o valor muda. `null` remove a chave.
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  validate: (value: unknown) => T | null,
) {
  const [value, setValue] = useState<T>(() => readStorage(key, validate) ?? initialValue)

  useEffect(() => {
    if (value === null) removeStorage(key)
    else writeStorage(key, value)
  }, [key, value])

  return [value, setValue] as const
}
