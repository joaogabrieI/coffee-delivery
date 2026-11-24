import styled from 'styled-components'
import { media } from '../styles/tokens'

export const CheckoutLayout = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: ${({ theme }) => theme.space.xl};

  ${media.lg} {
    grid-template-columns: minmax(0, 1fr) minmax(0, 28rem);
  }

  h1,
  h2.section-title {
    font-size: ${({ theme }) => theme.fontSize.titleXS};
    color: ${({ theme }) => theme.colors.subtitle};
    margin-bottom: ${({ theme }) => theme.space.md};
  }
`

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.sm};
  min-width: 0;
`

export const Panel = styled.section`
  & + & {
    margin-top: ${({ theme }) => theme.space.sm};
  }

  padding: ${({ theme }) => theme.space.lg};
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.colors.surface};

  ${media.md} {
    padding: ${({ theme }) => theme.space.xxl};
  }
`

export const CartPanel = styled(Panel)`
  border-radius: ${({ theme }) => theme.radius.cart};
`

export const CartList = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.lg};
`

export const FormAlert = styled.p`
  &:not(:empty) {
    margin-bottom: ${({ theme }) => theme.space.sm};
    padding: ${({ theme }) => theme.space.sm} ${({ theme }) => theme.space.md};
    border-left: 4px solid ${({ theme }) => theme.colors.error};
    border-radius: ${({ theme }) => theme.radius.sm};
    background: ${({ theme }) => theme.colors.errorSoft};
    color: ${({ theme }) => theme.colors.error};
    font-size: ${({ theme }) => theme.fontSize.textS};
    font-weight: 700;
  }
`
