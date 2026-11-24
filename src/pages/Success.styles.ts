import styled from 'styled-components'

export const EmptyState = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.space.sm};
  padding: ${({ theme }) => theme.space.xxxl} 0;
  text-align: center;

  svg {
    color: ${({ theme }) => theme.colors.primary};
  }

  h1 {
    font-size: ${({ theme }) => theme.fontSize.titleL};
  }

  a {
    display: inline-flex;
    align-items: center;
    min-height: 2.75rem;
    margin-top: ${({ theme }) => theme.space.sm};
    padding: 0 ${({ theme }) => theme.space.lg};
    border-radius: ${({ theme }) => theme.radius.sm};
    background: ${({ theme }) => theme.colors.primaryStrong};
    color: ${({ theme }) => theme.colors.primaryText};
    font-weight: 700;
    text-decoration: none;
  }
`
