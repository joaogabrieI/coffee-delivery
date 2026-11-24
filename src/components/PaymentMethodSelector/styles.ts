import styled from 'styled-components'
import { media } from '../../styles/tokens'

export const PaymentFieldset = styled.fieldset`
  display: flex;
  flex-direction: column;
`

export const Options = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: ${({ theme }) => theme.space.sm};
  margin-bottom: ${({ theme }) => theme.space.xs};

  ${media.sm} {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  label {
    display: block;
    cursor: pointer;
  }

  /* o rádio é visualmente escondido; o "card" ao lado mostra foco e seleção */
  input:focus-visible + span {
    outline: 3px solid ${({ theme }) => theme.colors.focusRing};
    outline-offset: 2px;
  }

  input:checked + span {
    border-color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.primarySoft};
    color: ${({ theme }) => theme.colors.primaryInk};
  }

  input[aria-invalid='true']:not(:checked) + span {
    border-color: ${({ theme }) => theme.colors.error};
  }
`

export const OptionCard = styled.span`
  position: relative;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.sm};
  min-height: 3.25rem;
  padding: ${({ theme }) => theme.space.md};
  border: 1px solid transparent;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.colors.surfaceAlt};
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSize.textXS};
  text-transform: uppercase;
  transition:
    background-color 0.2s,
    border-color 0.2s;

  > svg:first-child {
    flex-shrink: 0;
    color: ${({ theme }) => theme.colors.primary};
  }

  .check {
    margin-left: auto;
    flex-shrink: 0;
  }

  &:hover {
    background: ${({ theme }) => theme.colors.hover};
  }
`
