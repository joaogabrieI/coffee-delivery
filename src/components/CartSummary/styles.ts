import styled from 'styled-components'

export const SummaryList = styled.dl`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.sm};
  margin-top: ${({ theme }) => theme.space.lg};
`

export const Row = styled.div`
  display: flex;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space.md};
  font-size: ${({ theme }) => theme.fontSize.textS};

  dd {
    font-size: ${({ theme }) => theme.fontSize.textM};
  }
`

export const TotalRow = styled(Row)`
  font-size: ${({ theme }) => theme.fontSize.textL};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.subtitle};

  dd {
    font-size: ${({ theme }) => theme.fontSize.textL};
  }
`

export const ConfirmButton = styled.button`
  width: 100%;
  min-height: 2.875rem;
  margin-top: ${({ theme }) => theme.space.lg};
  border: 0;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.colors.accent};
  color: ${({ theme }) => theme.colors.accentText};
  font-size: ${({ theme }) => theme.fontSize.textS};
  font-weight: 700;
  text-transform: uppercase;
  transition: filter 0.2s;

  &:hover:not(:disabled) {
    filter: brightness(0.92);
  }

  &:disabled {
    opacity: 0.5;
  }
`
