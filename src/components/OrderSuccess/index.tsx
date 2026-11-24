import { CurrencyDollar, MapPin, Timer } from '@phosphor-icons/react'
import { useTheme } from 'styled-components'
import { PAYMENT_METHOD_LABELS } from '../../data/paymentMethods'
import type { Order } from '../../types/order'
import { maskCep } from '../../utils/cep'
import { formatBRL } from '../../utils/format'
import { Header, IconBubble, InfoBox, InfoRow, Items, Layout, Illustration, Totals } from './styles'

/** Janela de entrega exibida (texto fictício, como no Figma). */
export const DELIVERY_ESTIMATE = '20 min - 30 min'

interface OrderSuccessProps {
  order: Order
}

/** Resumo do pedido concluído (RF-12). Tudo vem do snapshot, nada do carrinho. */
export function OrderSuccess({ order }: OrderSuccessProps) {
  const { colors } = useTheme()
  const { address } = order
  const streetLine = [`${address.street}, ${address.number}`, address.complement]
    .filter(Boolean)
    .join(' - ')

  return (
    <Layout>
      <div>
        <Header>
          <h1>Uhu! Pedido confirmado</h1>
          <p>Agora é só aguardar que logo o café chegará até você</p>
        </Header>

        <InfoBox>
          <InfoRow>
            <IconBubble $color={colors.primary} aria-hidden>
              <MapPin weight="fill" />
            </IconBubble>
            <p>
              Entrega em <strong>{streetLine}</strong>
              <br />
              {address.neighborhood} - {address.city}, {address.uf} · CEP {maskCep(address.cep)}
            </p>
          </InfoRow>

          <InfoRow>
            <IconBubble $color={colors.accent} aria-hidden>
              <Timer weight="fill" />
            </IconBubble>
            <p>
              Previsão de entrega
              <br />
              <strong>{DELIVERY_ESTIMATE}</strong>
            </p>
          </InfoRow>

          <InfoRow>
            <IconBubble $color={colors.accentStrong} aria-hidden>
              <CurrencyDollar />
            </IconBubble>
            <p>
              Pagamento na entrega
              <br />
              <strong>{PAYMENT_METHOD_LABELS[order.paymentMethod]}</strong>
            </p>
          </InfoRow>
        </InfoBox>

        <Items aria-label="Itens do pedido">
          <h2>Resumo do pedido</h2>
          <ul>
            {order.items.map((item) => (
              <li key={item.coffeeId}>
                <span>
                  {item.quantity}× {item.name}
                </span>
                <span>{formatBRL(item.unitPriceCents * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <Totals>
            <div>
              <dt>Total de itens</dt>
              <dd>{formatBRL(order.subtotalCents)}</dd>
            </div>
            <div>
              <dt>Entrega</dt>
              <dd>{formatBRL(order.deliveryFeeCents)}</dd>
            </div>
            <div>
              <dt>Total</dt>
              <dd>{formatBRL(order.totalCents)}</dd>
            </div>
          </Totals>
        </Items>
      </div>

      <Illustration src="/delivery.svg" alt="" width={492} height={293} />
    </Layout>
  )
}
