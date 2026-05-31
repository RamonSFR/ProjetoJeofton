import styled from 'styled-components'

import { colors as c } from '../../styles/GlobalStyle'

export const PageShell = styled.main`
  width: min(1180px, calc(100% - 32px));
  margin: 28px auto 56px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`

export const Topbar = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;

  a,
  button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 42px;
    padding: 0 16px;
    border-radius: 999px;
    border: 0;
    text-decoration: none;
    font-weight: 800;
    color: ${c.white1};
    background: rgba(255, 255, 255, 0.08);
  }
`

export const Hero = styled.section`
  display: grid;
  grid-template-columns: 1.05fr 1fr;
  gap: 18px;

  @media (max-width: 920px) {
    grid-template-columns: 1fr;
  }
`

export const HeroImage = styled.img`
  width: 100%;
  min-height: 320px;
  object-fit: cover;
  border-radius: 30px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.24);
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
    letter-spacing: -0.05em;
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

export const MetaRow = styled.div`
  margin-top: 18px;
  padding: 14px 16px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.05);
  color: ${c.gray2};
  line-height: 1.6;
`

export const MessageBanner = styled.div`
  padding: 14px 18px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.08);
`

export const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

export const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: end;

  h2 {
    margin-top: 8px;
    font-size: clamp(1.6rem, 4vw, 2.3rem);
  }

  span {
    color: ${c.gray2};
  }
`

export const MenuGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;

  @media (max-width: 960px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 680px) {
    grid-template-columns: 1fr;
  }
`

export const MenuCard = styled.article`
  padding: 20px;
  border-radius: 26px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  flex-direction: column;
  gap: 14px;

  strong {
    font-size: 1.06rem;
  }

  span {
    color: ${c.gray2};
  }

  button {
    margin-top: auto;
    min-height: 46px;
    border: 0;
    border-radius: 16px;
    background: linear-gradient(135deg, ${c.red1}, ${c.red3});
    color: ${c.white2};
    font-weight: 800;
  }
`

export const EmptyState = styled.div`
  padding: 20px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.05);
  color: ${c.gray2};
`
