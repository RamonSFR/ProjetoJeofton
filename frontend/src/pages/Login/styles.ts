import styled from 'styled-components'

import { colors as c } from '../../styles/GlobalStyle'

export const Container = styled.div`
  width: min(1180px, calc(100% - 32px));
  min-height: calc(100vh - 120px);
  margin: 24px auto 56px;
  display: grid;
  place-items: center;
`

export const LoginCard = styled.div`
  width: min(560px, 100%);
  padding: 34px;
  border-radius: 32px;
  background:
    radial-gradient(
      circle at top right,
      rgba(132, 204, 22, 0.14),
      transparent 34%
    ),
    linear-gradient(180deg, rgba(18, 27, 42, 0.96), rgba(9, 17, 29, 0.98));
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.28);
`

export const HeaderBlock = styled.div`
  margin-bottom: 18px;

  h1 {
    margin-top: 12px;
    font-size: clamp(2rem, 4vw, 3.3rem);
    line-height: 1;
  }

  p {
    margin-top: 14px;
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

export const Form = styled.form`
  padding: 18px;
  border-radius: 24px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  background: rgba(255, 255, 255, 0.04);

  select,
  input {
    width: 100%;
    min-height: 52px;
    border-radius: 16px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    padding: 0 16px;
    background: rgba(9, 17, 29, 0.75);
    color: ${c.white1};

    &:focus {
      border-color: ${c.red2};
      outline: none;
    }
  }

  select {
    appearance: none;
  }

  button {
    width: 100%;
    min-height: 52px;
    border-radius: 16px;
    border: none;
    background: linear-gradient(135deg, ${c.red1}, ${c.red3});
    color: ${c.white2};
    font-weight: 800;

    &:disabled {
      opacity: 0.72;
      cursor: wait;
    }
  }
`

export const FormTitle = styled.h2`
  font-size: 1.1rem;
  color: ${c.white1};
`

export const SelectLoginButtons = styled.div`
  display: flex;
  margin: 18px 0;
  overflow: hidden;
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.1);
`

export const LoginButton = styled.button`
  width: 50%;
  min-height: 48px;
  border: none;
  background: rgba(255, 255, 255, 0.04);
  color: ${c.gray2};
  font-weight: 800;
  transition:
    background 0.2s ease,
    color 0.2s ease;

  &.isActive {
    background: linear-gradient(135deg, ${c.red1}, ${c.red2});
    color: ${c.white1};
  }

  &:not(.isActive):hover {
    background: rgba(255, 255, 255, 0.08);
  }
`

export const FooterBlock = styled.div`
  margin-top: 18px;
  padding: 18px 20px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.04);

  strong {
    display: block;
    margin-bottom: 8px;
  }

  span {
    color: ${c.gray2};
    line-height: 1.6;
  }

  p {
    margin-top: 12px;
    color: ${c.red4};
    font-weight: 700;
  }
`
