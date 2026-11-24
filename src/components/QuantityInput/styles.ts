import styled from 'styled-components'
import { TOUCH_TARGET } from '../../styles/tokens'

export const Container = styled.div<{ $size: 'sm' | 'md' }>`
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  height: ${({ $size }) => ($size === 'sm' ? '2.25rem' : TOUCH_TARGET)};
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.colors.surfaceAlt};
`

export const StepButton = styled.button`
  display: grid;
  place-items: center;
  /* área de toque ≥ 44 px de largura mesmo no tamanho "sm" */
  width: 2.25rem;
  height: 100%;
  min-height: 2.25rem;
  border: 0;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: transparent;
  color: ${({ theme }) => theme.colors.primary};
  transition:
    color 0.2s,
    background-color 0.2s;

  &:hover:not(:disabled) {
    color: ${({ theme }) => theme.colors.primaryStrong};
    background: ${({ theme }) => theme.colors.hover};
  }

  &:disabled {
    opacity: 0.4;
  }
`

export const Value = styled.output`
  min-width: 1.25rem;
  text-align: center;
  color: ${({ theme }) => theme.colors.title};
`
