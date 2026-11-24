import styled from 'styled-components'

export const LogoWrapper = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.xs};
`

export const Wordmark = styled.span`
  display: flex;
  flex-direction: column;
  font-family: ${({ theme }) => theme.fonts.title};
  font-weight: 800;
  font-size: ${({ theme }) => theme.fontSize.textM};
  line-height: 1;

  span:first-child {
    color: ${({ theme }) => theme.colors.primaryInk};
  }

  span:last-child {
    color: ${({ theme }) => theme.colors.accentStrong};
  }
`
