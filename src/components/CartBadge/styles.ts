import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { TOUCH_TARGET } from '../../styles/tokens'

export const CartLink = styled(Link)`
  position: relative;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: ${TOUCH_TARGET};
  height: ${TOUCH_TARGET};
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.colors.accentSoft};
  color: ${({ theme }) => theme.colors.accentStrong};
  transition: filter 0.2s;

  &:hover {
    filter: brightness(0.95);
  }
`

export const Badge = styled.span`
  position: absolute;
  top: -0.5rem;
  right: -0.5rem;
  min-width: 1.25rem;
  height: 1.25rem;
  padding: 0 0.25rem;
  display: grid;
  place-items: center;
  border-radius: ${({ theme }) => theme.radius.pill};
  background: ${({ theme }) => theme.colors.accent};
  color: ${({ theme }) => theme.colors.accentText};
  font-size: ${({ theme }) => theme.fontSize.textXS};
  font-weight: 700;
`
