/** Mantém só os dígitos (máx. 8). */
export const onlyDigits = (value: string) => value.replace(/\D/g, '').slice(0, 8)

/** "01001000" → "01001-000" (máscara aplicada enquanto o usuário digita). */
export function maskCep(value: string): string {
  const digits = onlyDigits(value)
  return digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits
}

export const isCompleteCep = (value: string) => onlyDigits(value).length === 8
