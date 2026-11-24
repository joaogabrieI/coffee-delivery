import { CartItem } from '../components/CartItem'
import { CartSummary } from '../components/CartSummary'
import { EmptyCart } from '../components/EmptyCart'
import { useCart } from '../hooks/useCart'
import { CartList, CartPanel, CheckoutLayout, Column } from './Checkout.styles'

const FORM_ID = 'checkout-form'

export function Checkout() {
  const { lines, totals, increment, decrement, removeItem } = useCart()
  const isEmpty = lines.length === 0

  return (
    <CheckoutLayout>
      <Column>
        <h1>Complete seu pedido</h1>
        <form id={FORM_ID} noValidate />
      </Column>

      <Column>
        <h2 className="section-title">Cafés selecionados</h2>
        <CartPanel aria-label="Cafés selecionados">
          {isEmpty ? (
            <EmptyCart />
          ) : (
            <CartList>
              {lines.map((line) => (
                <CartItem
                  key={line.coffeeId}
                  item={line}
                  onIncrement={increment}
                  onDecrement={decrement}
                  onRemove={removeItem}
                />
              ))}
            </CartList>
          )}
          <CartSummary
            totals={totals}
            formId={FORM_ID}
            disabled={isEmpty}
            disabledReason="Adicione pelo menos um café para confirmar o pedido."
          />
        </CartPanel>
      </Column>
    </CheckoutLayout>
  )
}
