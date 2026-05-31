import { createGlobalStyle } from 'styled-components'

export const colors = {
  primaryBlack: '#09111D',
  secondaryBlack: '#121B2A',
  red1: '#D97706',
  red2: '#F59E0B',
  red3: '#84CC16',
  red4: '#EAB308',
  gray1: '#94A3B8',
  gray2: '#CBD5E1',
  white1: '#F8FAFC',
  white2: '#FFFFFF'
}

const GlobalStyle = createGlobalStyle`
  :root {
    color-scheme: dark;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    min-height: 100vh;
    font-family: 'Montserrat', 'Segoe UI', sans-serif;
    background:
      radial-gradient(circle at top left, rgba(217, 119, 6, 0.18), transparent 32%),
      radial-gradient(circle at top right, rgba(132, 204, 22, 0.18), transparent 28%),
      linear-gradient(180deg, #0b1220 0%, #09111d 100%);
    color: ${colors.white1};
  }

  body, button, input, select, textarea {
    font: inherit;
  }

  a {
    color: inherit;
  }

  ul {
    list-style: none;
  }

  button {
    cursor: pointer;
  }

  #root {
    min-height: 100vh;
  }
`

export default GlobalStyle
