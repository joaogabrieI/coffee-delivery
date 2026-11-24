import { MapPinLine } from '@phosphor-icons/react'
import type { FieldErrors, UseFormRegister } from 'react-hook-form'
import type { CheckoutFormInput } from '../../schemas/checkoutSchema'
import { UFS } from '../../types/address'
import { maskCep } from '../../utils/cep'
import { Field } from './Field'
import { FieldsGrid, Input, PanelDescription, PanelLegend, Select } from './styles'

interface DeliveryAddressFormProps {
  register: UseFormRegister<CheckoutFormInput>
  errors: FieldErrors<CheckoutFormInput>['address']
}

/** Campos de endereço (RF-08). Recebe `register` e `errors` do useForm da página. */
export function DeliveryAddressForm({ register, errors }: DeliveryAddressFormProps) {
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
        <Field id="cep" label="CEP" area="cep" error={errors?.cep?.message}>
          {(a11y) => (
            <Input
              {...a11y}
              {...register('address.cep', {
                onChange: (event) => {
                  event.target.value = maskCep(event.target.value)
                },
              })}
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
