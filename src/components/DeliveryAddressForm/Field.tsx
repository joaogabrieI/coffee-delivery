import { WarningCircle } from '@phosphor-icons/react'
import type { ReactNode } from 'react'
import { ErrorText, FieldWrapper, Hint, Label } from './styles'

interface FieldProps {
  id: string
  label: string
  optional?: boolean
  error?: string
  hint?: ReactNode
  area: string
  /** Recebe os atributos de acessibilidade a aplicar no <input>/<select>. */
  children: (a11y: {
    id: string
    'aria-invalid': boolean
    'aria-describedby'?: string
  }) => ReactNode
}

/**
 * Rótulo + controle + mensagem. Liga o erro ao campo com aria-describedby e
 * marca aria-invalid (PRD §6.1). O erro tem ícone e texto: não depende só de cor.
 */
export function Field({ id, label, optional, error, hint, area, children }: FieldProps) {
  const errorId = `${id}-error`
  const hintId = `${id}-hint`
  const describedBy = [error && errorId, hint && hintId].filter(Boolean).join(' ') || undefined

  return (
    <FieldWrapper $area={area}>
      <Label htmlFor={id}>
        {label}
        {optional && <span> (opcional)</span>}
      </Label>
      {children({ id, 'aria-invalid': Boolean(error), 'aria-describedby': describedBy })}
      {hint && <Hint id={hintId}>{hint}</Hint>}
      {error && (
        <ErrorText id={errorId}>
          <WarningCircle size={16} weight="fill" aria-hidden />
          {error}
        </ErrorText>
      )}
    </FieldWrapper>
  )
}
