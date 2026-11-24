import { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
  *,
  *::before,
  *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    color-scheme: ${({ theme }) => theme.mode};
    -webkit-text-size-adjust: 100%;
  }

  body {
    min-height: 100vh;
    background: ${({ theme }) => theme.colors.bg};
    color: ${({ theme }) => theme.colors.text};
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
    transition: background-color 0.2s, color 0.2s;
  }

  body, input, textarea, button, output {
    font-family: ${({ theme }) => theme.fonts.text};
    font-weight: 400;
    font-size: ${({ theme }) => theme.fontSize.textM};
    line-height: 1.3;
  }

  h1, h2, h3, h4 {
    font-family: ${({ theme }) => theme.fonts.title};
    color: ${({ theme }) => theme.colors.title};
    font-weight: 800;
    line-height: 1.3;
  }

  button {
    cursor: pointer;
    font: inherit;
  }

  fieldset {
    border: 0;
    min-width: 0;
  }

  button:disabled {
    cursor: not-allowed;
  }

  img, svg {
    display: block;
    max-width: 100%;
  }

  a {
    color: inherit;
  }

  /* Foco visível e de alto contraste nos dois temas (WCAG 2.4.7). */
  :focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.focusRing};
    outline-offset: 2px;
  }

  [tabindex='-1']:focus {
    outline: none;
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
`
