import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { colors as c } from '../../styles/GlobalStyle'

export const HeaderContainer = styled.header`
  position: sticky;
  top: 0;
  z-index: 20;
  width: min(1180px, calc(100% - 32px));
  margin: 16px auto 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  padding: 16px 20px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  background: rgba(9, 17, 29, 0.85);
  backdrop-filter: blur(18px);
  box-shadow: 0 24px 60px rgba(3, 7, 18, 0.4);
  flex-wrap: wrap;
`

export const Brand = styled(Link)`
  display: flex;
  flex-direction: column;
  gap: 4px;
  text-decoration: none;

  span {
    color: ${c.white1};
    font-size: 1.6rem;
    font-weight: 900;
    letter-spacing: 0.03em;
  }

  small {
    color: ${c.gray2};
    font-size: 0.76rem;
  }
`

export const NavBar = styled.ul`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;

  a {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 40px;
    padding: 0 14px;
    border-radius: 999px;
    color: ${c.gray2};
    text-decoration: none;
    font-size: 0.95rem;
    font-weight: 700;
    transition:
      transform 0.2s ease,
      background 0.2s ease,
      color 0.2s ease;
  }

  a:hover {
    transform: translateY(-1px);
    background: rgba(255, 255, 255, 0.06);
    color: ${c.white1};
  }

  a.active {
    background: linear-gradient(135deg, ${c.red1}, ${c.red3});
    color: ${c.white2};
    box-shadow: 0 12px 30px rgba(132, 204, 22, 0.16);
  }
`

export const NavBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  min-height: 20px;
  margin-left: 8px;
  padding: 0 6px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.16);
  color: ${c.white1};
  font-size: 0.72rem;
  font-weight: 800;
`

export const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-left: auto;
`

export const SessionBadge = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 10px 14px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.05);

  span {
    color: ${c.gray1};
    font-size: 0.68rem;
    text-transform: uppercase;
    letter-spacing: 0.14em;
  }

  strong {
    color: ${c.white1};
    font-size: 0.9rem;
    font-weight: 700;
  }

  small {
    color: ${c.gray1};
    font-size: 0.74rem;
  }
`

export const SessionLink = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 40px;
  padding: 0 14px;
  border-radius: 999px;
  color: ${c.white1};
  background: rgba(255, 255, 255, 0.08);
  font-weight: 700;
`

const buttonBase = `
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 40px;
  padding: 0 16px;
  border: 0;
  border-radius: 999px;
  font-weight: 800;
  text-decoration: none;
  transition: transform 0.2s ease, opacity 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    opacity: 0.95;
  }
`

export const LoginButton = styled(Link)`
  ${buttonBase}
  background: linear-gradient(135deg, ${c.red2}, ${c.red4});
  color: ${c.white2};
`

export const LogoutButton = styled.button`
  ${buttonBase}
  background: rgba(255, 255, 255, 0.08);
  color: ${c.white1};

  &:hover {
    background: rgba(255, 255, 255, 0.12);
  }
`
