import styled from 'styled-components'
import { CONTAINER_WIDTH, media } from '../../styles/tokens'

export const SkipLink = styled.a`
  position: absolute;
  left: ${({ theme }) => theme.space.md};
  top: -100px;
  z-index: 100;
  padding: ${({ theme }) => `${theme.space.xs} ${theme.space.md}`};
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.colors.primaryStrong};
  color: ${({ theme }) => theme.colors.primaryText};
  font-weight: 700;

  &:focus {
    top: ${({ theme }) => theme.space.md};
  }
`

export const Main = styled.main`
  max-width: ${CONTAINER_WIDTH};
  margin: 0 auto;
  padding: ${({ theme }) => `${theme.space.lg} ${theme.space.md} ${theme.space.xxxl}`};

  ${media.md} {
    padding: ${({ theme }) => `${theme.space.xl} ${theme.space.lg} 6rem`};
  }
`
