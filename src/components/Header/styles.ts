import styled from 'styled-components'
import { CONTAINER_WIDTH, media } from '../../styles/tokens'

export const HeaderBar = styled.header`
  position: sticky;
  top: 0;
  z-index: 10;
  background: ${({ theme }) => theme.colors.bg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  transition: background-color 0.2s;

  > div > a {
    text-decoration: none;
    border-radius: ${({ theme }) => theme.radius.sm};
  }
`

export const HeaderContent = styled.div`
  max-width: ${CONTAINER_WIDTH};
  margin: 0 auto;
  padding: ${({ theme }) => theme.space.md};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space.sm};

  ${media.md} {
    padding: ${({ theme }) => `${theme.space.xl} ${theme.space.lg}`};
  }
`

export const Actions = styled.nav`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.sm};
  min-width: 0;
`
