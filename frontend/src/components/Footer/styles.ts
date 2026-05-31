import styled from 'styled-components'

export const FooterBar = styled.footer`
  position: fixed;
  bottom: 0;
  right: 12px;
  font-size: 11px;
  color: #888;
  display: flex;
  gap: 8px;
  align-items: center;
  padding: 4px 8px;
  z-index: 1000;
`

export const EnvBadge = styled.span`
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: bold;

  &.env-development {
    background: #fff3cd;
    color: #856404;
  }

  &.env-staging {
    background: #d1ecf1;
    color: #0c5460;
  }

  &.env-production {
    background: #d4edda;
    color: #155724;
  }
`
