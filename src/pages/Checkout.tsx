import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { CartItem } from '../components/CartItem'
import { CartSummary } from '../components/CartSummary'
import { DeliveryAddressForm } from '../components/DeliveryAddressForm'
import { EmptyCart } from '../components/EmptyCart'
import { PaymentMethodSelector } from '../components/PaymentMethodSelector'
import { useCart } from '../hooks/useCart'
import { useCep } from '../hooks/useCep'
import { isUF } from '../types/address'
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
    control,
    handleSubmit,
    setValue,
    setFocus,
    formState: { errors },
  } = useForm<CheckoutFormInput, unknown, CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    mode: 'onBlur', // valida ao sair do campo; no submit valida tudo e foca o 1º erro
    defaultValues: {
      address: { cep: '', street: '', number: '', complement: '', neighborhood: '', city: '' },
    },
  })

  const { status: cepStatus, lookup, retry } = useCep()

  /** Preenche só os campos que a API trouxe; número e complemento NUNCA são tocados. */
  function fillAddress(data: Awaited<ReturnType<typeof lookup>>) {
    if (!data) return
    const options = { shouldValidate: true, shouldDirty: true }
    if (data.street) setValue('address.street', data.street, options)
    if (data.neighborhood) setValue('address.neighborhood', data.neighborhood, options)
    if (data.city) setValue('address.city', data.city, options)
    if (isUF(data.uf)) setValue('address.uf', data.uf, options)
    setFocus('address.number')
  }

  async function handleCepChange(cep: string) {
    fillAddress(await lookup(cep))
  }

  async function handleRetryCep() {
    fillAddress(await retry())
  }

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
            <DeliveryAddressForm
              register={register}
              errors={errors.address}
              cepStatus={cepStatus}
              onCepChange={handleCepChange}
              onRetryCep={handleRetryCep}
            />
          </Panel>
          <Panel>
            <Controller
              control={control}
              name="paymentMethod"
              render={({ field, fieldState }) => (
                <PaymentMethodSelector
                  value={field.value}
                  onChange={field.onChange}
                  error={fieldState.error?.message}
                  inputRef={field.ref}
                />
              )}
            />
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
