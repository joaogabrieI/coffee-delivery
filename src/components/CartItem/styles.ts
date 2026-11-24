import styled from 'styled-components'

export const ItemRow = styled.li`
  display: grid;
  grid-template-columns: 4rem minmax(0, 1fr) auto;
  align-items: start;
  gap: ${({ theme }) => theme.space.md};
  padding-bottom: ${({ theme }) => theme.space.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  > img {
    width: 4rem;
    height: 4rem;
  }
`

export const Info = styled.div`
  min-width: 0;

  > p {
    color: ${({ theme }) => theme.colors.subtitle};
  }
`

export const Controls = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.space.xs};
  margin-top: ${({ theme }) => theme.space.xs};
`

export const RemoveButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.xxs};
  height: 2.25rem;
  padding: 0 ${({ theme }) => theme.space.xs};
  border: 0;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.colors.surfaceAlt};
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSize.textXS};
  text-transform: uppercase;
  transition: background-color 0.2s;

  svg {
    color: ${({ theme }) => theme.colors.primary};
  }

  &:hover {
    background: ${({ theme }) => theme.colors.hover};
  }
`

export const LineTotal = styled.strong`
  white-space: nowrap;
  color: ${({ theme }) => theme.colors.text};
`
