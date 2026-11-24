import { Minus, Plus } from '@phosphor-icons/react'
import { MAX_QTY, MIN_QTY } from '../../utils/pricing'
import { Container, StepButton, Value } from './styles'

interface QuantityInputProps {
  value: number
  onChange: (next: number) => void
  min?: number
  max?: number
  /** Nome do produto — compõe os rótulos acessíveis ("Diminuir quantidade de Latte"). */
  label: string
  size?: 'sm' | 'md'
}

/**
 * Controle −/+ reutilizado no catálogo e no carrinho. Componente controlado:
 * não guarda estado, só avisa o pai pelo `onChange` (RF-02, RN-01).
 */
export function QuantityInput({
  value,
  onChange,
  min = MIN_QTY,
  max = MAX_QTY,
  label,
  size = 'md',
}: QuantityInputProps) {
  return (
    <Container $size={size} role="group" aria-label={`Quantidade de ${label}`}>
      <StepButton
        type="button"
        onClick={() => onChange(value - 1)}
        disabled={value <= min}
        aria-label={`Diminuir quantidade de ${label}`}
      >
        <Minus size={14} weight="bold" aria-hidden />
      </StepButton>
      <Value aria-live="polite" aria-atomic="true">
        {value}
      </Value>
      <StepButton
        type="button"
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label={`Aumentar quantidade de ${label}`}
      >
        <Plus size={14} weight="bold" aria-hidden />
      </StepButton>
    </Container>
  )
}
