import { ArrowClockwise, CheckCircle, MapPinLine, WarningCircle } from '@phosphor-icons/react'
import type { FieldErrors, UseFormRegister } from 'react-hook-form'
import type { CepStatus } from '../../hooks/useCep'
import type { CheckoutFormInput } from '../../schemas/checkoutSchema'
import { UFS } from '../../types/address'
import { maskCep } from '../../utils/cep'
import { Field } from './Field'
import {
  CepMessage,
  FieldsGrid,
  Input,
  PanelDescription,
  PanelLegend,
  RetryButton,
  Select,
} from './styles'

interface DeliveryAddressFormProps {
  register: UseFormRegister<CheckoutFormInput>
  errors: FieldErrors<CheckoutFormInput>['address']
  cepStatus: CepStatus
  /** Chamado a cada digitação no CEP (já com máscara). A página decide se consulta. */
  onCepChange: (cep: string) => void
  onRetryCep: () => void
}

const CEP_MESSAGES: Record<Exclude<CepStatus, 'idle'>, string> = {
  loading: 'Buscando endereço…',
  success: 'Endereço encontrado. Confira os dados e informe o número.',
  'not-found': 'CEP não encontrado. Confira os números ou preencha o endereço manualmente.',
  error: 'Não foi possível consultar o CEP agora. Tente novamente ou preencha manualmente.',
}

function CepFeedback({ status, onRetry }: { status: CepStatus; onRetry: () => void }) {
  if (status === 'idle') return null
  const isProblem = status === 'not-found' || status === 'error'
  const Icon = isProblem ? WarningCircle : status === 'success' ? CheckCircle : null

  return (
    <>
      <CepMessage $tone={isProblem ? 'error' : 'info'}>
        {Icon && <Icon size={16} weight="fill" aria-hidden />}
        {CEP_MESSAGES[status]}
      </CepMessage>
      {status === 'error' && (
        <RetryButton type="button" onClick={onRetry}>
          <ArrowClockwise size={14} aria-hidden />
          Tentar novamente
        </RetryButton>
      )}
    </>
  )
}

/**
 * Campos de endereço (RF-08). Recebe `register`/`errors` do useForm da página e o
 * status da consulta de CEP. Todos os campos continuam editáveis em qualquer status.
 */
export function DeliveryAddressForm({
  register,
  errors,
  cepStatus,
  onCepChange,
  onRetryCep,
}: DeliveryAddressFormProps) {
  return (
    <fieldset aria-describedby="address-description">
      <PanelLegend>
        <MapPinLine size={22} aria-hidden />
        Endereço de entrega
      </PanelLegend>
      <PanelDescription id="address-description">
        Informe o endereço onde deseja receber seu pedido
      </PanelDescription>

      <FieldsGrid>
        <Field
          id="cep"
          label="CEP"
          area="cep"
          error={errors?.cep?.message}
          hint={<CepFeedback status={cepStatus} onRetry={onRetryCep} />}
        >
          {(a11y) => (
            <Input
              {...a11y}
              {...register('address.cep', {
                onChange: (event) => {
                  event.target.value = maskCep(event.target.value)
                  onCepChange(event.target.value)
                },
              })}
              aria-busy={cepStatus === 'loading'}
              inputMode="numeric"
              autoComplete="postal-code"
              placeholder="00000-000"
              maxLength={9}
            />
          )}
        </Field>

        <Field id="street" label="Rua" area="street" error={errors?.street?.message}>
          {(a11y) => (
            <Input {...a11y} {...register('address.street')} autoComplete="address-line1" />
          )}
        </Field>

        <Field id="number" label="Número" area="number" error={errors?.number?.message}>
          {(a11y) => <Input {...a11y} {...register('address.number')} inputMode="text" />}
        </Field>

        <Field
          id="complement"
          label="Complemento"
          optional
          area="complement"
          error={errors?.complement?.message}
        >
          {(a11y) => (
            <Input {...a11y} {...register('address.complement')} autoComplete="address-line2" />
          )}
        </Field>

        <Field
          id="neighborhood"
          label="Bairro"
          area="neighborhood"
          error={errors?.neighborhood?.message}
        >
          {(a11y) => <Input {...a11y} {...register('address.neighborhood')} />}
        </Field>

        <Field id="city" label="Cidade" area="city" error={errors?.city?.message}>
          {(a11y) => (
            <Input {...a11y} {...register('address.city')} autoComplete="address-level2" />
          )}
        </Field>

        <Field id="uf" label="UF" area="uf" error={errors?.uf?.message}>
          {(a11y) => (
            <Select {...a11y} {...register('address.uf')} autoComplete="address-level1">
              <option value="">--</option>
              {UFS.map((uf) => (
                <option key={uf} value={uf}>
                  {uf}
                </option>
              ))}
            </Select>
          )}
        </Field>
      </FieldsGrid>
    </fieldset>
  )
}
