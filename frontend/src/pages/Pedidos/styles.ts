import styled from 'styled-components'
import { Link } from 'react-router-dom' // Assumindo que usa react-router
import { colors as c } from '../../styles/GlobalStyle'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-top: 64px;
  min-height: 100vh;
  background-color: ${c.red1};

  h1 {
    font-size: 3rem;
    color: ${c.white1};
    margin-bottom: 32px;
    font-weight: 900;
    text-shadow: 2px 2px 4px rgba(255, 255, 255, 0.5);
  }
`

export const OrdersContent = styled.div`
  width: 100%;
  max-width: 600px;
  padding: 32px;
  border-radius: 8px;
  background-color: ${c.white1};
  display: flex;
  flex-direction: column;
`

export const Title = styled.h2`
  margin-bottom: 24px;
  color: ${c.red1};
  font-weight: 700;
  text-align: center;
`

export const OrderList = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 16px;
`

export const OrderItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border: 1px solid ${c.gray1};
  border-radius: 4px;

  strong {
    display: block;
    color: ${c.red1};
    margin-bottom: 4px;
  }

  span {
    font-size: 0.875rem;
    color: #666;
  }

  div:last-child {
    text-align: right;
    
    p {
      font-weight: bold;
      margin-top: 8px;
    }
  }
`

export const StatusTag = styled.span`
  background-color: ${c.red1};
  color: ${c.white1};
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem !important;
  text-transform: uppercase;
  font-weight: bold;
`

export const BackButton = styled(Link)`
  margin-top: 24px;
  text-align: center;
  text-decoration: none;
  color: ${c.red1};
  font-weight: 600;
  font-size: 0.875rem;

  &:hover {
    text-decoration: underline;
  }
`