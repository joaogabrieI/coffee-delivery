import styled from 'styled-components'
import { media } from '../../styles/tokens'

export const HeroSection = styled.section`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  align-items: center;
  gap: ${({ theme }) => theme.space.xl};
  padding: ${({ theme }) => `${theme.space.md} 0 ${theme.space.xxl}`};

  ${media.lg} {
    grid-template-columns: minmax(0, 1fr) minmax(0, 30rem);
    gap: ${({ theme }) => theme.space.xxxl};
    padding: 5.75rem 0;
  }
`

export const HeroContent = styled.div`
  h1 {
    font-size: 2rem;
    line-height: 1.2;

    ${media.md} {
      font-size: ${({ theme }) => theme.fontSize.titleXL};
    }
  }

  > p {
    margin-top: ${({ theme }) => theme.space.md};
    font-size: ${({ theme }) => theme.fontSize.textM};
    color: ${({ theme }) => theme.colors.subtitle};

    ${media.md} {
      font-size: ${({ theme }) => theme.fontSize.textL};
    }
  }
`

export const Benefits = styled.ul`
  list-style: none;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: ${({ theme }) => `${theme.space.md} ${theme.space.xxl}`};
  margin-top: ${({ theme }) => theme.space.xl};

  ${media.sm} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  ${media.lg} {
    margin-top: 4rem;
  }
`

export const Benefit = styled.li`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.sm};
  color: ${({ theme }) => theme.colors.text};
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

export const HeroImage = styled.img`
  width: 100%;
  max-width: 22rem;
  height: auto;
  justify-self: center;

  ${media.lg} {
    max-width: 30rem;
  }
`
