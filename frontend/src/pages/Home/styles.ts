import { Link } from 'react-router-dom'
import styled from 'styled-components'

import { colors as c } from '../../styles/GlobalStyle'

export const PageShell = styled.main`
  width: min(1180px, calc(100% - 32px));
  margin: 28px auto 56px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`

export const Hero = styled.section`
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 20px;

  @media (max-width: 920px) {
    grid-template-columns: 1fr;
  }
`

export const HeroCopy = styled.div`
  padding: 34px;
  border-radius: 32px;
  background:
    radial-gradient(
      circle at top left,
      rgba(217, 119, 6, 0.2),
      transparent 30%
    ),
    linear-gradient(145deg, rgba(18, 27, 42, 0.96), rgba(9, 17, 29, 0.98));
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.28);

  h1 {
    max-width: 12ch;
    margin-top: 12px;
    font-size: clamp(2.6rem, 6vw, 5rem);
    line-height: 0.95;
    letter-spacing: -0.05em;
  }

  p {
    max-width: 58ch;
    margin-top: 18px;
    color: ${c.gray2};
    line-height: 1.75;
  }
`

export const Kicker = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: ${c.red4};
  text-transform: uppercase;
  letter-spacing: 0.18em;
  font-size: 0.72rem;
  font-weight: 800;
`

export const ActionRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 24px;
`

const buttonBase = `
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  padding: 0 18px;
  border-radius: 999px;
  text-decoration: none;
  font-weight: 800;
  transition: transform 0.2s ease, opacity 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    opacity: 0.96;
  }
`

export const PrimaryLink = styled(Link)`
  ${buttonBase}
  background: linear-gradient(135deg, ${c.red1}, ${c.red3});
  color: ${c.white2};
`

export const SecondaryLink = styled(Link)`
  ${buttonBase}
  background: rgba(255, 255, 255, 0.08);
  color: ${c.white1};
`

export const HeroPanel = styled.aside`
  padding: 28px;
  border-radius: 32px;
  background: linear-gradient(
    180deg,
    rgba(132, 204, 22, 0.14),
    rgba(18, 27, 42, 0.92)
  );
  border: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 18px;

  > span {
    color: ${c.gray2};
    font-size: 0.82rem;
    text-transform: uppercase;
    letter-spacing: 0.16em;
  }

  > strong {
    font-size: 1.24rem;
    line-height: 1.4;
  }

  ul {
    display: grid;
    gap: 12px;
  }

  li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 18px;
    padding: 14px 16px;
    border-radius: 18px;
    background: rgba(255, 255, 255, 0.06);
  }

  li span {
    color: ${c.gray2};
    font-size: 0.88rem;
  }

  li strong {
    font-size: 1rem;
  }
`

export const ErrorBanner = styled.div`
  padding: 14px 18px;
  border-radius: 18px;
  background: rgba(248, 113, 113, 0.14);
  border: 1px solid rgba(248, 113, 113, 0.28);
  color: ${c.white1};
`

export const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

export const SectionHeader = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;

  h2 {
    margin-top: 8px;
    font-size: clamp(1.7rem, 3vw, 2.4rem);
  }
`

export const RestaurantGrid = styled.div`
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

export const RestaurantCard = styled(Link)`
  text-decoration: none;
  border-radius: 28px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.18);
  transition:
    transform 0.2s ease,
    border-color 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    border-color: rgba(234, 179, 8, 0.45);
  }
`

export const RestaurantImage = styled.img`
  width: 100%;
  height: 210px;
  object-fit: cover;
  display: block;
`

export const RestaurantCardBody = styled.div`
  padding: 18px 18px 20px;

  strong {
    display: block;
    font-size: 1.1rem;
    margin-bottom: 8px;
  }

  span {
    color: ${c.gray2};
    font-size: 0.88rem;
  }
`

export const EmptyState = styled.div`
  padding: 20px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.05);
  color: ${c.gray2};
`
