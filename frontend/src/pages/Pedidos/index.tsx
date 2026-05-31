import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import { getOrders, getRestaurants, updateOrderStatus } from '../../lib/api'
import { useSession } from '../../lib/useSession'
import type { OrderRecord, RestaurantRecord } from '../../types/api'

import * as S from './styles'

type OrderViewRecord = OrderRecord & {
  orderId?: number
  totalAmount?: number | string
  total?: number | string
}

const Orders = () => {
  const session = useSession()
  const moneyFormatter = useMemo(
    () =>
      new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }),
    []
  )

  const [restaurants, setRestaurants] = useState<RestaurantRecord[]>([])
  const [orders, setOrders] = useState<OrderViewRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const loadOrders = async () => {
    try {
      setLoading(true)
      setMessage('')

      const restaurantsResponse = await getRestaurants(1, 100)
      setRestaurants(restaurantsResponse.data)

      if (!session) {
        setOrders([])
        return
      }

      const ordersResponse = await getOrders({
        page: 1,
        pageSize: 40,
        customerId: session.id
      })

      setOrders(ordersResponse.data)
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : 'Unable to load orders.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadOrders()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.id])

  const handleConfirmDelivery = async (orderId: number, status: string) => {
    if (status !== 'OUT_FOR_DELIVERY') {
      setMessage(
        'Este pedido só pode ser confirmado se tiver saído para entrega.'
      )
      return
    }

    try {
      setSaving(true)
      setMessage('')

      await updateOrderStatus(orderId, 'DELIVERED')
      await loadOrders()
      setMessage('Delivery confirmed.')
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : 'Unable to update order status.'
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <S.Container>
      <S.PageTitle>
        <S.Kicker>Pedidos</S.Kicker>
        <h1>Verifique seus pedidos e confirme a entrega</h1>
      </S.PageTitle>

      {message ? <S.MessageBanner>{message}</S.MessageBanner> : null}

      {!session ? (
        <S.EmptyState>
          <h2>Você precisa fazer login para ver seus pedidos.</h2>
          <p>
            Após fazer login, esta área mostrará apenas seus próprios pedidos.
          </p>
          <Link to="/login">Ir para login</Link>
        </S.EmptyState>
      ) : (
        <S.Panel>
          <S.PanelHeader>
            <div>
              <S.SectionTag>Meus Pedidos</S.SectionTag>
              <h2>histórico de pedidos</h2>
            </div>
            <span>
              {loading ? 'Carregando...' : `${orders.length} pedidos`}
            </span>
          </S.PanelHeader>

          {loading ? <p>Carregando seu histórico de pedidos...</p> : null}

          <S.OrderList>
            {orders.map((order) => {
              const orderId = order.id ?? order.orderId
              const restaurant = restaurants.find(
                (item) => item.id === order.restaurantId
              )

              return (
                <S.OrderItem key={orderId}>
                  <div>
                    <strong>Pedido #{orderId}</strong>
                    <span>
                      {restaurant?.name ?? `Restaurant #${order.restaurantId}`}
                    </span>
                    {order.items?.length ? (
                      <ul>
                        {order.items.map((item) => (
                          <li key={`${orderId}-${item.productId}`}>
                            {item.productNameSnapshot} x{item.quantity}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>

                  <div>
                    <S.StatusTag>{order.status}</S.StatusTag>
                    <strong>
                      {moneyFormatter.format(
                        // Robust numeric parsing: accept number, numeric string, or fall back to 0
                        (() => {
                          const raw = order.total ?? order.totalAmount
                          if (typeof raw === 'number') return raw
                          if (typeof raw === 'string') {
                            // Replace comma decimal separators and strip non-numeric chars except dot and minus
                            const cleaned = raw
                              .replace(/,/g, '.')
                              .replace(/[^0-9.-]/g, '')
                            const parsed = Number(cleaned)
                            return Number.isFinite(parsed) ? parsed : 0
                          }
                          return 0
                        })()
                      )}
                    </strong>
                    <button
                      type="button"
                      onClick={() =>
                        void handleConfirmDelivery(orderId, order.status)
                      }
                      disabled={saving}
                    >
                      Confirmar Entrega
                    </button>
                  </div>
                </S.OrderItem>
              )
            })}
          </S.OrderList>

          {!loading && orders.length === 0 ? (
            <S.EmptyState>
              <h3>Nenhum pedido encontrado.</h3>
              <p>
                Faça um pedido através da página do restaurante ou do carrinho.
              </p>
            </S.EmptyState>
          ) : null}
        </S.Panel>
      )}
    </S.Container>
  )
}

export default Orders
