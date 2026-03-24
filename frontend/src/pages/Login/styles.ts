import styled from 'styled-components'

import { colors as c } from '../../styles/GlobalStyle'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: ${c.red1};

  h1 {
    font-size: 3rem;
    color: ${c.white1};
    margin-bottom: 32px;
    font-weight: 900;
    text-shadow: 2px 2px 4px rgba(255, 255, 255, 0.5);
  }
`

export const Form = styled.form`
  padding: 32px 16px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${c.white1};

  input {
    width: 384px;
    height: 32px;
    border-radius: 2px;
    border: 1px solid ${c.gray1};
    padding: 0 16px;

    &:focus {
      outline: none;
      border-color: ${c.red1};
    }
  }

  button {
    width: 100%;
    margin-top: 16px;
    border-radius: 2px;
    padding: 8px 0;
    border: none;
    background-color: ${c.red1};
    color: ${c.white1};
    font-weight: 600;
    cursor: pointer;
  }
`

export const FormTitle = styled.h2`
  margin-bottom: 32px;
  color: ${c.red1};
  font-weight: 700;
`

export const SelectLoginButtons = styled.div`
  display: flex;
  margin-bottom: 16px;
`

export const LoginButton = styled.button`
  width: 128px;
  cursor: pointer;
  padding: 8px 16px;
  background-color: ${c.gray2};
  border: none;
  text-align: center;
  color: ${c.red2};

  &.isActive {
    background-color: ${c.red3};
    color: ${c.white1};
  }

  &.left {
    border-radius: 12px 0 0 12px;
    border-left: 2px solid ${c.red1};
  }

  &.right {
    border-radius: 0 12px 12px 0;
    border-right: 2px solid ${c.red1};
  }

  &.right, &.left {
    border-bottom: 2px solid ${c.red1};
    border-top: 2px solid ${c.red1};
  }
`
