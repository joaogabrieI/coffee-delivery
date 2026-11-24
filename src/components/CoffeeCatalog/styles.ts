import styled from 'styled-components'
import { media } from '../../styles/tokens'

export const CatalogSection = styled.section`
  margin-top: ${({ theme }) => theme.space.xl};

  h2 {
    font-size: ${({ theme }) => theme.fontSize.titleM};
    color: ${({ theme }) => theme.colors.subtitle};

    ${media.md} {
      font-size: ${({ theme }) => theme.fontSize.titleL};
    }
  }
`

/** 1 → 2 → 3 → 4 colunas (mobile first). */
export const Grid = styled.ul`
  list-style: none;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: ${({ theme }) => `${theme.space.xxxl} ${theme.space.xl}`};
  margin-top: ${({ theme }) => theme.space.xxxl};

  ${media.md} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  ${media.lg} {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  ${media.xl} {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
`
