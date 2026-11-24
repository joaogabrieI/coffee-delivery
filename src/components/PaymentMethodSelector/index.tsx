import {
  Bank,
  Check,
  CreditCard,
  CurrencyDollar,
  Money,
  WarningCircle,
} from '@phosphor-icons/react'
import type { Ref } from 'react'
import { PAYMENT_METHOD_LABELS, PAYMENT_METHODS } from '../../data/paymentMethods'
import type { PaymentMethod } from '../../types/order'
import { ErrorText, PanelDescription, PanelLegend } from '../DeliveryAddressForm/styles'
import { OptionCard, Options, PaymentFieldset } from './styles'

const ICONS = { credit: CreditCard, debit: Bank, cash: Money } as const

interface PaymentMethodSelectorProps {
  value: PaymentMethod | undefined
  onChange: (method: PaymentMethod) => void
  error?: string
  /** Ref do 1º rádio — permite ao formulário focar o grupo quando há erro. */
  inputRef?: Ref<HTMLInputElement>
}

/** Crédito, débito ou dinheiro — exatamente uma opção (RF-09). Nenhum dado de cartão é pedido. */
export function PaymentMethodSelector({
  value,
  onChange,
  error,
  inputRef,
}: PaymentMethodSelectorProps) {
  const errorId = 'payment-error'

  return (
    <PaymentFieldset
      aria-describedby={error ? `payment-description ${errorId}` : 'payment-description'}
    >
      <PanelLegend $iconColor="primary">
        <CurrencyDollar size={22} aria-hidden />
        Pagamento
      </PanelLegend>
      <PanelDescription id="payment-description">
        O pagamento é feito na entrega. Escolha a forma que deseja pagar
      </PanelDescription>

      <Options>
        {PAYMENT_METHODS.map((method, index) => {
          const Icon = ICONS[method]
          const checked = value === method
          return (
            <label key={method}>
              <input
                ref={index === 0 ? inputRef : undefined}
                className="sr-only"
                type="radio"
                name="paymentMethod"
                value={method}
                checked={checked}
                onChange={() => onChange(method)}
                aria-invalid={Boolean(error)}
              />
              <OptionCard>
                <Icon size={16} aria-hidden />
                {PAYMENT_METHOD_LABELS[method]}
                {checked && <Check size={14} weight="bold" className="check" aria-hidden />}
              </OptionCard>
            </label>
          )
        })}
      </Options>

      {error && (
        <ErrorText id={errorId}>
          <WarningCircle size={16} weight="fill" aria-hidden />
          {error}
        </ErrorText>
      )}
    </PaymentFieldset>
  )
}
