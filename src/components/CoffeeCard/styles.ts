import styled from 'styled-components'
import { TOUCH_TARGET } from '../../styles/tokens'

export const Card = styled.article`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: ${({ theme }) => `0 ${theme.space.lg} ${theme.space.lg}`};
  border-radius: ${({ theme }) => theme.radius.card};
  background: ${({ theme }) => theme.colors.surface};
  transition: background-color 0.2s;

  > img {
    width: 7.5rem;
    height: 7.5rem;
    margin-top: -1.25rem;
  }
`

export const Tags = styled.ul`
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: ${({ theme }) => theme.space.xxs};
  margin-top: ${({ theme }) => theme.space.sm};

  li {
    padding: ${({ theme }) => `${theme.space.xxs} ${theme.space.xs}`};
    border-radius: ${({ theme }) => theme.radius.pill};
    background: ${({ theme }) => theme.colors.accentSoft};
    color: ${({ theme }) => theme.colors.accentInk};
    font-size: ${({ theme }) => theme.fontSize.tag};
    font-weight: 700;
    text-transform: uppercase;
  }
`

export const Title = styled.h3`
  margin-top: ${({ theme }) => theme.space.md};
  font-size: ${({ theme }) => theme.fontSize.titleS};
  color: ${({ theme }) => theme.colors.subtitle};
`

export const Description = styled.p`
  flex: 1;
  margin-top: ${({ theme }) => theme.space.xs};
  font-size: ${({ theme }) => theme.fontSize.textS};
  color: ${({ theme }) => theme.colors.textMuted};
`

export const CardFooter = styled.div`
  width: 100%;
  margin-top: ${({ theme }) => theme.space.xl};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space.xs};
`

export const Price = styled.p`
  display: flex;
  align-items: baseline;
  gap: ${({ theme }) => theme.space.xxs};
  white-space: nowrap;
  color: ${({ theme }) => theme.colors.text};

  span {
    font-size: ${({ theme }) => theme.fontSize.textS};
  }

  strong {
    font-family: ${({ theme }) => theme.fonts.title};
    font-size: ${({ theme }) => theme.fontSize.titleM};
    font-weight: 800;
  }
`

export const Actions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space.xs};
`

export const AddButton = styled.button<{ $added: boolean }>`
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: ${TOUCH_TARGET};
  height: ${TOUCH_TARGET};
  border: 0;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme, $added }) => ($added ? theme.colors.accent : theme.colors.primaryStrong)};
  color: ${({ theme, $added }) => ($added ? theme.colors.accentText : theme.colors.primaryText)};
  transition: background-color 0.2s;

  &:hover {
    background: ${({ theme }) => theme.colors.primary};
  }
`
