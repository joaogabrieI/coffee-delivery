import styled from 'styled-components'
import { TOUCH_TARGET } from '../../styles/tokens'

export const ToggleButton = styled.button`
  display: grid;
  place-items: center;
  width: ${TOUCH_TARGET};
  height: ${TOUCH_TARGET};
  flex-shrink: 0;
  border: 0;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.colors.primarySoft};
  color: ${({ theme }) => theme.colors.primaryInk};
  transition: background-color 0.2s;

  &:hover {
    background: ${({ theme }) => theme.colors.hover};
  }
`
