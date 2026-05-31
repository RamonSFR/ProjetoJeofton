import styled from 'styled-components'

import { colors as c } from '../../styles/GlobalStyle'

export const Container = styled.main`
  width: min(1180px, calc(100% - 32px));
  margin: 28px auto 56px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`

export const PageTitle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  h1 {
    max-width: 15ch;
    font-size: clamp(2.2rem, 5vw, 4rem);
    line-height: 0.95;
    letter-spacing: -0.04em;
  }

  p {
    max-width: 68ch;
    color: ${c.gray2};
    line-height: 1.7;
  }
`

export const Kicker = styled.span`
  color: ${c.red4};
  text-transform: uppercase;
  letter-spacing: 0.16em;
  font-size: 0.72rem;
  font-weight: 800;
`

export const MessageBanner = styled.div`
  padding: 14px 18px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.08);
`

export const Panel = styled.section`
  padding: 24px;
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  flex-direction: column;
  gap: 18px;
`

export const PanelHeader = styled.header`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: end;

  h2 {
    font-size: 1.45rem;
    margin-top: 8px;
  }

  span {
    color: ${c.gray2};
    font-size: 0.9rem;
  }
`

export const SectionTag = styled.span`
  display: inline-flex;
  color: ${c.red4};
  text-transform: uppercase;
  letter-spacing: 0.16em;
  font-size: 0.7rem;
  font-weight: 800;
`

export const OrderList = styled.ul`
  display: grid;
  gap: 12px;
`

export const OrderItem = styled.li`
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 16px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.06);

  strong {
    display: block;
    color: ${c.white1};
    margin-bottom: 4px;
  }

  span {
    font-size: 0.88rem;
    color: ${c.gray2};
  }

  ul {
    margin-top: 10px;
    display: grid;
    gap: 4px;
    color: ${c.gray2};
    font-size: 0.9rem;
  }

  div:last-child {
    min-width: 160px;
    text-align: right;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 10px;

    button {
      width: 100%;
      min-height: 42px;
      border-radius: 14px;
      border: 0;
      background: rgba(255, 255, 255, 0.08);
      color: ${c.white1};
      font-weight: 700;
    }
  }
`

export const StatusTag = styled.span`
  background: linear-gradient(135deg, ${c.red1}, ${c.red3});
  color: ${c.white1};
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 0.75rem !important;
  text-transform: uppercase;
  font-weight: bold;
`

export const EmptyState = styled.div`
  padding: 24px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);

  h2,
  h3 {
    margin-bottom: 8px;
  }

  p {
    color: ${c.gray2};
    line-height: 1.7;
    margin-bottom: 12px;
  }

  a {
    color: ${c.red4};
    font-weight: 800;
    text-decoration: none;
  }
`
