import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { CartItem } from '../components/CartItem'
import { CartSummary } from '../components/CartSummary'
import { DeliveryAddressForm } from '../components/DeliveryAddressForm'
import { EmptyCart } from '../components/EmptyCart'
import { useCart } from '../hooks/useCart'
import {
  type CheckoutFormData,
  type CheckoutFormInput,
  checkoutSchema,
} from '../schemas/checkoutSchema'
import { CartList, CartPanel, CheckoutLayout, Column, Panel } from './Checkout.styles'

const FORM_ID = 'checkout-form'

export function Checkout() {
  const { lines, totals, increment, decrement, removeItem } = useCart()
  const isEmpty = lines.length === 0

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormInput, unknown, CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    mode: 'onBlur', // valida ao sair do campo; no submit valida tudo e foca o 1º erro
    defaultValues: {
      address: { cep: '', street: '', number: '', complement: '', neighborhood: '', city: '' },
    },
  })

  function handleConfirm(data: CheckoutFormData) {
    // Implementado na T-21 (snapshot do pedido).
    void data
  }

  return (
    <CheckoutLayout>
      <Column>
        <h1>Complete seu pedido</h1>
        <form id={FORM_ID} noValidate onSubmit={handleSubmit(handleConfirm)}>
          <Panel>
            <DeliveryAddressForm register={register} errors={errors.address} />
          </Panel>
        </form>
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
