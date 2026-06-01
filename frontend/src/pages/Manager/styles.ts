import { Link, NavLink } from 'react-router-dom'
import styled from 'styled-components'

import { colors as c } from '../../styles/GlobalStyle'

export const PageShell = styled.main`
  width: min(1180px, calc(100% - 32px));
  margin: 28px auto 56px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`

export const TopNav = styled.header`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 18px 20px;
  border-radius: 28px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background:
    radial-gradient(
      circle at top left,
      rgba(132, 204, 22, 0.12),
      transparent 28%
    ),
    linear-gradient(145deg, rgba(18, 27, 42, 0.98), rgba(9, 17, 29, 0.98));
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.26);
`

export const Brand = styled(Link)`
  display: flex;
  flex-direction: column;
  gap: 4px;
  text-decoration: none;

  span {
    color: ${c.white1};
    font-size: 1.4rem;
    font-weight: 900;
    letter-spacing: 0.03em;
  }

  small {
    color: ${c.gray2};
    font-size: 0.76rem;
  }
`

export const NavLinks = styled.nav`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;

  a {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 42px;
    padding: 0 16px;
    border-radius: 999px;
    color: ${c.gray2};
    text-decoration: none;
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
  }
`

export const NavActions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-left: auto;
`

export const SessionChip = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 10px 14px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.06);

  span {
    color: ${c.gray1};
    font-size: 0.68rem;
    text-transform: uppercase;
    letter-spacing: 0.14em;
  }

  strong {
    color: ${c.white1};
    font-size: 0.94rem;
    font-weight: 800;
  }

  small {
    color: ${c.gray1};
    font-size: 0.74rem;
  }
`

const buttonBase = `
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 42px;
  padding: 0 16px;
  border: 0;
  border-radius: 999px;
  font-weight: 800;
  text-decoration: none;
  transition: transform 0.2s ease, opacity 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    opacity: 0.96;
  }
`

export const LogoutButton = styled.button`
  ${buttonBase}
  background: rgba(255, 255, 255, 0.08);
  color: ${c.white1};
`

export const Content = styled.section`
  display: flex;
  flex-direction: column;
  gap: 20px;
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

  h1,
  h2 {
    margin-top: 8px;
    font-size: clamp(1.8rem, 4vw, 2.8rem);
  }

  span {
    color: ${c.gray2};
  }
`

export const Kicker = styled.span`
  color: ${c.red4};
  text-transform: uppercase;
  letter-spacing: 0.16em;
  font-size: 0.72rem;
  font-weight: 800;
`

export const Hero = styled.section`
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 18px;

  @media (max-width: 920px) {
    grid-template-columns: 1fr;
  }
`

export const HeroCopy = styled.div`
  padding: 30px;
  border-radius: 30px;
  background:
    radial-gradient(
      circle at top left,
      rgba(217, 119, 6, 0.16),
      transparent 30%
    ),
    linear-gradient(145deg, rgba(18, 27, 42, 0.96), rgba(9, 17, 29, 0.98));
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
    line-height: 1.75;
  }
`

export const HeroPanel = styled.aside`
  padding: 24px;
  border-radius: 30px;
  background: linear-gradient(
    180deg,
    rgba(132, 204, 22, 0.12),
    rgba(18, 27, 42, 0.94)
  );
  border: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 16px;

  img {
    width: 100%;
  }
`

export const HeroStats = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;

  div {
    padding: 14px 16px;
    border-radius: 18px;
    background: rgba(255, 255, 255, 0.06);
  }

  span {
    display: block;
    color: ${c.gray2};
    font-size: 0.76rem;
    text-transform: uppercase;
    letter-spacing: 0.14em;
    margin-bottom: 6px;
  }

  strong {
    font-size: 1.15rem;
  }
`

export const Tabs = styled.nav`
  display: inline-flex;
  gap: 10px;
  padding: 8px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.05);
  width: fit-content;
  flex-wrap: wrap;
`

export const TabLink = styled(NavLink)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 42px;
  padding: 0 16px;
  border-radius: 999px;
  color: ${c.gray2};
  text-decoration: none;
  font-weight: 800;

  &.active {
    background: linear-gradient(135deg, ${c.red1}, ${c.red3});
    color: ${c.white2};
  }
`

export const Panel = styled.section`
  padding: 22px;
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  flex-direction: column;
  gap: 18px;
`

export const Notice = styled.div`
  padding: 16px 18px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.05);
  color: ${c.gray2};
  line-height: 1.7;
`

export const FeedbackBanner = styled.div<{ $variant: 'success' | 'error' }>`
  padding: 16px 18px;
  border-radius: 18px;
  line-height: 1.6;
  border: 1px solid
    ${({ $variant }) =>
      $variant === 'success'
        ? 'rgba(132, 204, 22, 0.32)'
        : 'rgba(248, 113, 113, 0.32)'};
  background: ${({ $variant }) =>
    $variant === 'success'
      ? 'rgba(132, 204, 22, 0.14)'
      : 'rgba(248, 113, 113, 0.14)'};
  color: ${c.white1};
  box-shadow: 0 14px 30px rgba(0, 0, 0, 0.16);
`

export const EmptyState = styled.div`
  padding: 24px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: ${c.gray2};
  line-height: 1.7;
`

export const CardGrid = styled.div`
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

export const CardBody = styled.div`
  padding: 18px 18px 20px;

  strong {
    display: block;
    font-size: 1.06rem;
    margin-bottom: 8px;
  }

  span {
    color: ${c.gray2};
    font-size: 0.88rem;
  }
`

export const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;

  @media (max-width: 920px) {
    grid-template-columns: 1fr;
  }
`

export const SummaryCard = styled.div`
  padding: 18px;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);

  span {
    display: block;
    color: ${c.gray2};
    font-size: 0.78rem;
    text-transform: uppercase;
    letter-spacing: 0.14em;
    margin-bottom: 8px;
  }

  strong {
    font-size: 1.65rem;
  }
`

export const Toolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`

export const ToolbarActions = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  align-items: center;
`

export const FormCard = styled.div`
  padding: 20px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  flex-direction: column;
  gap: 14px;
`

export const FieldGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 12px;

  @media (max-width: 680px) {
    grid-template-columns: 1fr;
  }
`

export const Input = styled.input`
  width: 100%;
  min-height: 46px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(4, 9, 17, 0.75);
  color: ${c.white1};
  padding: 0 14px;

  &::placeholder {
    color: ${c.gray1};
  }
`

export const TextArea = styled.textarea`
  width: 100%;
  min-height: 96px;
  resize: vertical;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(4, 9, 17, 0.75);
  color: ${c.white1};
  padding: 12px 14px;
`

export const ButtonRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`

export const PrimaryButton = styled.button`
  ${buttonBase}
  background: linear-gradient(135deg, ${c.red1}, ${c.red3});
  color: ${c.white2};
`

export const SecondaryButton = styled.button`
  ${buttonBase}
  background: rgba(255, 255, 255, 0.08);
  color: ${c.white1};
`

export const DangerButton = styled.button`
  ${buttonBase}
  background: rgba(248, 113, 113, 0.16);
  color: ${c.white1};
`

export const AddButton = styled.button`
  ${buttonBase}
  background: linear-gradient(135deg, ${c.red1}, ${c.red3});
  color: ${c.white2};
`

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(2, 6, 23, 0.72);
  backdrop-filter: blur(14px);
`

export const ModalDialog = styled.div`
  width: min(760px, 100%);
  max-height: calc(100vh - 48px);
  overflow: auto;
  padding: 24px;
  border-radius: 30px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background:
    radial-gradient(
      circle at top left,
      rgba(217, 119, 6, 0.16),
      transparent 28%
    ),
    linear-gradient(145deg, rgba(18, 27, 42, 0.98), rgba(9, 17, 29, 0.98));
  box-shadow: 0 28px 80px rgba(0, 0, 0, 0.42);
`

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: flex-start;
  margin-bottom: 18px;

  h3 {
    margin-top: 8px;
    font-size: clamp(1.4rem, 3vw, 2rem);
  }
`

export const ModalCloseButton = styled.button`
  ${buttonBase}
  background: rgba(255, 255, 255, 0.08);
  color: ${c.white1};
  min-width: 40px;
  width: 40px;
  padding: 0;
  border-radius: 999px;
`

export const ModalForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

export const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`

export const ProductCard = styled.article`
  padding: 18px;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  flex-direction: column;
  gap: 12px;

  strong {
    font-size: 1.02rem;
  }

  span {
    color: ${c.gray2};
  }
`

export const ProductActions = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`

export const OrderList = styled.div`
  display: grid;
  gap: 12px;
`

export const OrderCard = styled.article`
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(240px, 0.8fr);
  gap: 16px;
  padding: 18px;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);

  @media (max-width: 820px) {
    grid-template-columns: 1fr;
  }
`

export const OrderInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  h3 {
    font-size: 1.08rem;
  }

  p,
  span,
  li {
    color: ${c.gray2};
  }

  ul {
    display: grid;
    gap: 4px;
    margin-top: 8px;
  }
`

export const OrderSide = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;

  @media (max-width: 820px) {
    align-items: flex-start;
  }
`

export const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 0.75rem;
  text-transform: uppercase;
  font-weight: 800;
  background: linear-gradient(135deg, ${c.red1}, ${c.red3});
  color: ${c.white1};
`

export const Select = styled.select`
  width: 100%;
  min-height: 44px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(4, 9, 17, 0.75);
  color: ${c.white1};
  padding: 0 12px;
`

export const TextButton = styled.button`
  ${buttonBase}
  background: rgba(255, 255, 255, 0.08);
  color: ${c.white1};
`

export const SmallMeta = styled.small`
  color: ${c.gray1};
`
