import styled from 'styled-components'

export const EmptyBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.space.sm};
  padding: ${({ theme }) => `${theme.space.lg} 0`};
  text-align: center;

  svg {
    color: ${({ theme }) => theme.colors.primary};
  }

  a {
    display: inline-flex;
    align-items: center;
    min-height: 2.75rem;
    padding: 0 ${({ theme }) => theme.space.md};
    border-radius: ${({ theme }) => theme.radius.sm};
    background: ${({ theme }) => theme.colors.primaryStrong};
    color: ${({ theme }) => theme.colors.primaryText};
    font-weight: 700;
    text-decoration: none;
  }
`
