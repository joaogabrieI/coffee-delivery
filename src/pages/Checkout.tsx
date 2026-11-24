import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { CartItem } from '../components/CartItem'
import { CartSummary } from '../components/CartSummary'
import { DeliveryAddressForm } from '../components/DeliveryAddressForm'
import { EmptyCart } from '../components/EmptyCart'
import { PaymentMethodSelector } from '../components/PaymentMethodSelector'
import { useCart } from '../hooks/useCart'
import { useCep } from '../hooks/useCep'
import { isUF } from '../types/address'
import { createOrder, saveLastOrder } from '../utils/order'
import {
  type CheckoutFormData,
  type CheckoutFormInput,
  checkoutSchema,
} from '../schemas/checkoutSchema'
import { CartList, CartPanel, CheckoutLayout, Column, FormAlert, Panel } from './Checkout.styles'

const FORM_ID = 'checkout-form'

export function Checkout() {
  const { lines, totals, increment, decrement, removeItem, clearCart } = useCart()
  const navigate = useNavigate()
  const isEmpty = lines.length === 0

  const {
    register,
    control,
    handleSubmit,
    setValue,
    setFocus,
    formState: { errors, isSubmitted, isSubmitting },
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

  /**
   * Só roda com o formulário VÁLIDO (o handleSubmit do RHF valida com Zod antes).
   * Ordem: snapshot → salvar → limpar carrinho → navegar (RF-12, RF-13).
   */
  function handleConfirm(data: CheckoutFormData) {
    if (lines.length === 0) return // RN-10: guarda extra contra carrinho vazio
    const order = createOrder(lines, data.address, data.paymentMethod)
    saveLastOrder(order)
    clearCart()
    navigate('/success')
  }

  const hasErrors = isSubmitted && Object.keys(errors).length > 0

  return (
    <CheckoutLayout>
      <Column>
        <h1>Complete seu pedido</h1>
        <form
          id={FORM_ID}
          noValidate
          aria-label="Dados de entrega e pagamento"
          onSubmit={handleSubmit(handleConfirm)}
        >
          {/* Resumo anunciado no envio inválido; o RHF também foca o 1º campo com erro. */}
          <FormAlert role="alert">
            {hasErrors && 'Não foi possível confirmar: revise os campos destacados.'}
          </FormAlert>
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
            disabled={isEmpty || isSubmitting}
            disabledReason="Adicione pelo menos um café para confirmar o pedido."
          />
        </CartPanel>
      </Column>
    </CheckoutLayout>
  )
}
