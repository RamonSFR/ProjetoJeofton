import styled from 'styled-components'

import { colors as c } from '../../styles/GlobalStyle'

export const PageShell = styled.main`
  width: min(1180px, calc(100% - 32px));
  margin: 28px auto 56px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`

export const Hero = styled.section`
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 18px;

  @media (max-width: 920px) {
    grid-template-columns: 1fr;
  }
`

export const HeroCopy = styled.div`
  padding: 32px;
  border-radius: 30px;
  background: linear-gradient(
    145deg,
    rgba(18, 27, 42, 0.94),
    rgba(9, 17, 29, 0.98)
  );
  border: 1px solid rgba(255, 255, 255, 0.08);

  h1 {
    margin-top: 12px;
    font-size: clamp(2rem, 5vw, 4rem);
    line-height: 0.95;
  }

  p {
    margin-top: 16px;
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

export const SidePanel = styled.aside`
  padding: 28px;
  border-radius: 30px;
  background: linear-gradient(
    180deg,
    rgba(132, 204, 22, 0.14),
    rgba(18, 27, 42, 0.92)
  );
  border: 1px solid rgba(255, 255, 255, 0.08);

  span {
    display: block;
    color: ${c.gray2};
    text-transform: uppercase;
    letter-spacing: 0.14em;
    font-size: 0.72rem;
  }

  strong {
    display: block;
    margin-top: 12px;
    font-size: 2rem;
  }

  p {
    margin-top: 10px;
    color: ${c.gray2};
  }
`

export const MessageBanner = styled.div`
  padding: 14px 18px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.08);
`

export const EmptyState = styled.div`
  padding: 24px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);

  h2 {
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

export const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 16px;

  @media (max-width: 920px) {
    grid-template-columns: 1fr;
  }
`

export const CartList = styled.div`
  display: grid;
  gap: 12px;
`

export const CartCard = styled.article`
  padding: 20px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  justify-content: space-between;
  gap: 16px;

  strong {
    display: block;
    font-size: 1.05rem;
  }

  span {
    color: ${c.gray2};
    font-size: 0.9rem;
  }

  > div:last-child {
    min-width: 180px;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 10px;

    button {
      min-height: 40px;
      width: 100%;
      border: 0;
      border-radius: 14px;
      background: rgba(255, 255, 255, 0.08);
      color: ${c.white1};
      font-weight: 800;
    }
  }
`

export const Price = styled.strong`
  font-size: 1rem;
`

export const QuantityRow = styled.div`
  display: grid;
  grid-template-columns: 40px 1fr 40px;
  gap: 8px;
  width: 100%;

  button,
  strong {
    min-height: 38px;
    border-radius: 12px;
    border: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: rgba(9, 17, 29, 0.8);
    color: ${c.white1};
  }
`

export const SummaryCard = styled.aside`
  padding: 22px;
  border-radius: 24px;
  background: linear-gradient(
    180deg,
    rgba(217, 119, 6, 0.14),
    rgba(255, 255, 255, 0.04)
  );
  border: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  flex-direction: column;
  gap: 12px;

  span {
    color: ${c.gray2};
    text-transform: uppercase;
    letter-spacing: 0.14em;
    font-size: 0.72rem;
  }

  strong {
    font-size: 2rem;
  }

  p {
    color: ${c.gray2};
  }

  button {
    min-height: 48px;
    border: 0;
    border-radius: 16px;
    background: linear-gradient(135deg, ${c.red1}, ${c.red3});
    color: ${c.white2};
    font-weight: 800;
  }

  a {
    color: ${c.red4};
    font-weight: 800;
    text-decoration: none;
  }
`
