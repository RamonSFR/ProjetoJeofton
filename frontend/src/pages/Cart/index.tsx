import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { createOrder } from '../../lib/api'
import { useSession } from '../../lib/useSession'
import { clearCart, removeItem, setQuantity } from '../../store/cartSlice'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import {
  selectCartItems,
  selectCartRestaurantId,
  selectCartRestaurantName,
  selectCartTotal
} from '../../store/selectors'

import * as S from './styles'

const Cart = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const session = useSession()
  const items = useAppSelector(selectCartItems)
  const restaurantId = useAppSelector(selectCartRestaurantId)
  const restaurantName = useAppSelector(selectCartRestaurantName)
  const total = useAppSelector(selectCartTotal)
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const formatter = useMemo(
    () =>
      new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }),
    []
  )

  const handlePlaceOrder = async () => {
    if (!session) {
      setMessage('Please sign in before placing an order.')
      navigate('/login')
      return
    }

    if (!restaurantId || items.length === 0) {
      setMessage('Your cart is empty.')
      return
    }

    try {
      setSubmitting(true)
      setMessage('')

      await createOrder({
        restaurantId,
        customerId: session.id,
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity
        }))
      })

      dispatch(clearCart())
      setMessage('Order placed successfully.')
      navigate('/orders')
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : 'Unable to place the order.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <S.PageShell>
      <S.Hero>
        <S.HeroCopy>
          <S.Kicker>Shopping cart</S.Kicker>
          <h1>Veja seus itens e faça seu pedido</h1>
          <p>
            O carrinho ficará limitado a apenas um restaurante, caso um item de
            um restaurante diferente seja adicionado irá substituir o atual.
          </p>
        </S.HeroCopy>

        <S.SidePanel>
          <span>{restaurantName ?? 'Nenhum restaurante selecionado'}</span>
          <p>Total:</p>
          <strong>{formatter.format(total)}</strong>
          <p>{items.length} item(s) no seu carrinho</p>
        </S.SidePanel>
      </S.Hero>

      {message ? <S.MessageBanner>{message}</S.MessageBanner> : null}

      {items.length === 0 ? (
        <S.EmptyState>
          <h2>Seu carrinho está vazio.</h2>
          <p>
            Escolha um restaurante, abra seu menu e adicione pratos a este
            carrinho.
          </p>
          <Link to="/restaurants">Navegar por restaurantes</Link>
        </S.EmptyState>
      ) : (
        <S.ContentGrid>
          <S.CartList>
            {items.map((item) => (
              <S.CartCard key={item.productId}>
                <div>
                  <strong>{item.name}</strong>
                  <span>{item.restaurantName}</span>
                </div>

                <div>
                  <S.Price>{formatter.format(Number(item.price))}</S.Price>
                  <S.QuantityRow>
                    <button
                      type="button"
                      onClick={() =>
                        dispatch(
                          setQuantity({
                            productId: item.productId,
                            quantity: item.quantity - 1
                          })
                        )
                      }
                    >
                      -
                    </button>
                    <strong>{item.quantity}</strong>
                    <button
                      type="button"
                      onClick={() =>
                        dispatch(
                          setQuantity({
                            productId: item.productId,
                            quantity: item.quantity + 1
                          })
                        )
                      }
                    >
                      +
                    </button>
                  </S.QuantityRow>
                  <button
                    type="button"
                    onClick={() => dispatch(removeItem(item.productId))}
                  >
                    Remover
                  </button>
                </div>
              </S.CartCard>
            ))}
          </S.CartList>

          <S.SummaryCard>
            <span>Resumo do pedido</span>
            <strong>{formatter.format(total)}</strong>
            <p>{restaurantName ?? 'Restaurante selecionado'}</p>

            <button
              type="button"
              onClick={() => void handlePlaceOrder()}
              disabled={submitting}
            >
              {submitting ? 'Placing order...' : 'Place order'}
            </button>

            {!session ? (
              <Link to="/login">Faça login para fazer um pedido</Link>
            ) : null}
          </S.SummaryCard>
        </S.ContentGrid>
      )}
    </S.PageShell>
  )
}

export default Cart
