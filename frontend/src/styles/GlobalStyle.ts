import { createGlobalStyle } from 'styled-components'

export const colors = {
  primaryBlack: '#0B090A',
  secondaryBlack: '#161A1D',
  red1: '#660708',
  red2: '#A4161A',
  red3: '#BA181B',
  red4: '#E5383B',
  gray1: '#B1A7A6',
  gray2: '#D3D3D3',
  white1: '#F5F3F4',
  white2: '#FFFFFF'
}

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    list-style: none;
    font-family: 'Montserrat', sans-serif;
  }
`

export default GlobalStyle
