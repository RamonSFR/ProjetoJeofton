import styled from 'styled-components'
import { colors as c } from '../../styles/GlobalStyle'

export const HeaderContainer = styled.header`
  width: 100%;
  margin: 0 auto;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: ${c.red1};
  padding: 16px 0;

  h1 {
    color: ${c.white1};
    font-weight: 900;
    font-size: 3rem;
    text-shadow: 4px 4px 4px rgba(255, 255, 255, 0.3);
  }
`

export const NavBar = styled.nav`
  ul {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
  }

  a {
    color: ${c.white1};
    font-size: 1.15rem;
    font-weight: 700;
    text-decoration: none;
    cursor: pointer;
  }
`
