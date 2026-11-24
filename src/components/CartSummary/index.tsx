import type { Totals } from '../../types/cart'
import { formatBRL } from '../../utils/format'
import { ConfirmButton, Row, SummaryList, TotalRow } from './styles'

interface CartSummaryProps {
  totals: Totals
  disabled: boolean
  /** Id do <form> que o botão envia (o botão fica fora do formulário no layout). */
  formId: string
  /** Texto explicando por que confirmar está bloqueado (lido por leitores de tela). */
  disabledReason?: string
}

/** Subtotal, entrega, total e o botão de confirmar (RF-10, RF-11). */
export function CartSummary({ totals, disabled, formId, disabledReason }: CartSummaryProps) {
  return (
    <>
      <SummaryList>
        <Row>
          <dt>Total de itens</dt>
          <dd>{formatBRL(totals.subtotalCents)}</dd>
        </Row>
        <Row>
          <dt>Entrega</dt>
          <dd>{formatBRL(totals.deliveryFeeCents)}</dd>
        </Row>
        <TotalRow>
          <dt>Total</dt>
          <dd>{formatBRL(totals.totalCents)}</dd>
        </TotalRow>
      </SummaryList>

      <ConfirmButton
        type="submit"
        form={formId}
        disabled={disabled}
        aria-describedby={disabled && disabledReason ? 'confirm-disabled-reason' : undefined}
      >
        Confirmar pedido
      </ConfirmButton>
      {disabled && disabledReason && (
        <p id="confirm-disabled-reason" className="sr-only">
          {disabledReason}
        </p>
      )}
    </>
  )
}
