import { z } from 'zod'
import { UFS } from '../types/address'

/**
 * Validação do checkout (RF-08, RF-09, RN-07). Um único schema valida o formulário
 * e gera os tipos (z.input = o que o formulário guarda; z.output = o que sai validado).
 * Obs.: no Zod 4 a mensagem customizada usa `error` (no Zod 3 era `errorMap`).
 */
export const addressSchema = z.object({
  cep: z
    .string()
    .transform((value) => value.replace(/\D/g, ''))
    .refine((digits) => digits.length === 8, 'Informe um CEP válido (8 dígitos)'),
  street: z.string().trim().min(1, 'Informe a rua'),
  number: z.string().trim().min(1, 'Informe o número').max(10, 'Use no máximo 10 caracteres'),
  complement: z.string().trim().max(60, 'Use no máximo 60 caracteres').optional(),
  neighborhood: z.string().trim().min(1, 'Informe o bairro'),
  city: z.string().trim().min(1, 'Informe a cidade'),
  uf: z.enum(UFS, { error: 'Selecione a UF' }),
})

export const paymentMethodSchema = z.enum(['credit', 'debit', 'cash'], {
  error: 'Selecione a forma de pagamento',
})

export const checkoutSchema = z.object({
  address: addressSchema,
  paymentMethod: paymentMethodSchema,
})

/** Valores do formulário enquanto o usuário digita (CEP com máscara, UF ainda vazia…). */
export type CheckoutFormInput = z.input<typeof checkoutSchema>
/** Dados já validados e normalizados (CEP só com dígitos). */
export type CheckoutFormData = z.output<typeof checkoutSchema>
