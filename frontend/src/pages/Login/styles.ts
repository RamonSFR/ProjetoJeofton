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
