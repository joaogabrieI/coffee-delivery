import styled from 'styled-components'
import { media } from '../../styles/tokens'

export const Layout = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  align-items: end;
  gap: ${({ theme }) => theme.space.xxl};

  ${media.lg} {
    grid-template-columns: minmax(0, 1fr) minmax(0, 30rem);
    gap: 6rem;
  }
`

export const Header = styled.header`
  h1 {
    font-size: ${({ theme }) => theme.fontSize.titleL};
    color: ${({ theme }) => theme.colors.accentStrong};
  }

  p {
    margin-top: ${({ theme }) => theme.space.xxs};
    font-size: ${({ theme }) => theme.fontSize.textL};
    color: ${({ theme }) => theme.colors.subtitle};
  }
`

/** Borda em degradê amarelo → roxo (Figma): fundo duplo com background-clip. */
export const InfoBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.xl};
  margin-top: ${({ theme }) => theme.space.xxl};
  padding: ${({ theme }) => theme.space.xl} ${({ theme }) => theme.space.lg};
  border: 1px solid transparent;
  border-radius: ${({ theme }) => theme.radius.cart};
  background:
    linear-gradient(${({ theme }) => theme.colors.bg}, ${({ theme }) => theme.colors.bg})
      padding-box,
    linear-gradient(
        102.89deg,
        ${({ theme }) => theme.colors.accent} 2.61%,
        ${({ theme }) => theme.colors.primary} 98.76%
      )
      border-box;

  ${media.md} {
    padding: ${({ theme }) => theme.space.xxl};
  }
`

export const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.sm};
  min-width: 0;

  p {
    min-width: 0;
    overflow-wrap: anywhere;
  }

  strong {
    color: ${({ theme }) => theme.colors.subtitle};
  }
`

export const IconBubble = styled.span<{ $color: string }>`
  flex-shrink: 0;
  display: grid;
  place-items: center;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  color: ${({ theme }) => theme.colors.bg};

  svg {
    width: 1rem;
    height: 1rem;
  }
`

export const Items = styled.section`
  margin-top: ${({ theme }) => theme.space.xl};
  padding: ${({ theme }) => theme.space.lg};
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.colors.surface};
  font-size: ${({ theme }) => theme.fontSize.textS};

  h2 {
    font-size: ${({ theme }) => theme.fontSize.titleXS};
    color: ${({ theme }) => theme.colors.subtitle};
  }

  ul {
    list-style: none;
    margin-top: ${({ theme }) => theme.space.sm};
    padding-bottom: ${({ theme }) => theme.space.sm};
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  }

  li {
    display: flex;
    justify-content: space-between;
    gap: ${({ theme }) => theme.space.md};
    padding: ${({ theme }) => theme.space.xxs} 0;
  }
`

export const Totals = styled.dl`
  margin-top: ${({ theme }) => theme.space.sm};

  div {
    display: flex;
    justify-content: space-between;
    padding: ${({ theme }) => theme.space.xxs} 0;
  }

  div:last-child {
    font-size: ${({ theme }) => theme.fontSize.textM};
    font-weight: 700;
    color: ${({ theme }) => theme.colors.subtitle};
  }
`

export const Illustration = styled.img`
  width: 100%;
  max-width: 30rem;
  height: auto;
  justify-self: center;
`
