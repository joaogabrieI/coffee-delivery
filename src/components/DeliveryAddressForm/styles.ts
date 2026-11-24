import styled, { css } from 'styled-components'
import { media } from '../../styles/tokens'

/** Título do painel. Reaproveitado pelo seletor de pagamento (mesmo visual). */
export const PanelLegend = styled.legend<{ $iconColor?: 'accent' | 'primary' }>`
  float: left; /* faz o <legend> se comportar como bloco comum dentro do fieldset */
  width: 100%;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.xs};
  padding: 0;
  color: ${({ theme }) => theme.colors.subtitle};

  > svg {
    flex-shrink: 0;
    color: ${({ theme, $iconColor = 'accent' }) =>
      $iconColor === 'primary' ? theme.colors.primary : theme.colors.accentStrong};
  }
`

export const PanelDescription = styled.p`
  clear: both;
  margin: 2px 0 ${({ theme }) => theme.space.xl};
  padding-left: 1.875rem;
  font-size: ${({ theme }) => theme.fontSize.textS};
`

/** Mobile: 1 coluna. ≥480 px: grade parecida com o Figma. */
export const FieldsGrid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.space.md};
  grid-template-columns: minmax(0, 1fr);
  grid-template-areas:
    'cep'
    'street'
    'number'
    'complement'
    'neighborhood'
    'city'
    'uf';

  ${media.sm} {
    grid-template-columns: minmax(0, 2fr) minmax(0, 2fr) 5rem;
    grid-template-areas:
      'cep . .'
      'street street street'
      'number complement complement'
      'neighborhood city uf';
  }
`

export const FieldWrapper = styled.div<{ $area: string }>`
  grid-area: ${({ $area }) => $area};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.xxs};
  min-width: 0;
`

export const Label = styled.label`
  font-size: ${({ theme }) => theme.fontSize.textS};
  color: ${({ theme }) => theme.colors.subtitle};

  span {
    font-style: italic;
    color: ${({ theme }) => theme.colors.textMuted};
  }
`

const control = css`
  width: 100%;
  min-height: 2.75rem;
  padding: ${({ theme }) => theme.space.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  background: ${({ theme }) => theme.colors.inputBg};
  color: ${({ theme }) => theme.colors.title};
  font-size: ${({ theme }) => theme.fontSize.textS};
  transition: border-color 0.2s;

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.focusRing};
    outline-offset: 0;
    border-color: ${({ theme }) => theme.colors.focusRing};
  }

  &[aria-invalid='true'] {
    border-color: ${({ theme }) => theme.colors.error};
  }
`

export const Input = styled.input`
  ${control}
`

export const Select = styled.select`
  ${control}
`

export const Hint = styled.div`
  font-size: ${({ theme }) => theme.fontSize.textXS};
  color: ${({ theme }) => theme.colors.text};
`

export const ErrorText = styled.p`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.xxs};
  font-size: ${({ theme }) => theme.fontSize.textXS};
  color: ${({ theme }) => theme.colors.error};
`

export const CepMessage = styled.span<{ $tone: 'info' | 'error' }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.xxs};
  color: ${({ theme, $tone }) => ($tone === 'error' ? theme.colors.error : theme.colors.text)};

  svg {
    flex-shrink: 0;
  }
`

export const RetryButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.xxs};
  min-height: 2.75rem;
  margin-top: ${({ theme }) => theme.space.xxs};
  padding: 0 ${({ theme }) => theme.space.sm};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.radius.sm};
  background: transparent;
  color: ${({ theme }) => theme.colors.primaryInk};
  font-size: ${({ theme }) => theme.fontSize.textXS};
  font-weight: 700;
  text-transform: uppercase;
`
