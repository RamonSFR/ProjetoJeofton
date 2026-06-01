import { useEffect, useMemo, useState } from 'react'
import { useOutletContext } from 'react-router-dom'

import { getOrders, updateOrderStatus } from '../../lib/api'
import type { OrderRecord, OrderStatus, OrderItemRecord } from '../../types/api'

import { type ManagerRestaurantContext } from './RestaurantWorkspace'
import * as S from './styles'

const ORDER_STATUS_OPTIONS: OrderStatus[] = [
  'PENDING',
  'CONFIRMED',
  'PREPARING',
  'OUT_FOR_DELIVERY',
  'CANCELLED'
]

const getOrderId = (order: OrderRecord) => order.id ?? order.orderId ?? 0

const getOrderTotal = (order: OrderRecord) => {
  const raw = order.total ?? order.totalAmount

  if (typeof raw === 'number') {
    return raw
  }

  if (typeof raw === 'string') {
    const cleaned = raw.replace(/,/g, '.').replace(/[^0-9.-]/g, '')
    const parsed = Number(cleaned)
    return Number.isFinite(parsed) ? parsed : 0
  }

  return 0
}

const getItemName = (item: OrderItemRecord) =>
  item.productName ?? item.productNameSnapshot ?? 'Item sem nome'

const ManagerOrders = () => {
  const { restaurant } = useOutletContext<ManagerRestaurantContext>()
  const moneyFormatter = useMemo(
    () =>
      new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }),
    []
  )

  const [orders, setOrders] = useState<OrderRecord[]>([])
  const [selectedStatus, setSelectedStatus] = useState<
    Record<number, OrderStatus>
  >({})
  const [loading, setLoading] = useState(true)
  const [savingOrderId, setSavingOrderId] = useState<number | null>(null)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const loadOrders = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await getOrders({
        page: 1,
        pageSize: 100,
        restaurantId: restaurant.id
      })

      setOrders(response.data)
      setSelectedStatus(
        response.data.reduce<Record<number, OrderStatus>>(
          (accumulator, order) => {
            const orderId = getOrderId(order)
            accumulator[orderId] = order.status
            return accumulator
          },
          {}
        )
      )
    } catch (fetchError) {
      setError(
        fetchError instanceof Error
          ? fetchError.message
          : 'Unable to load orders.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadOrders()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restaurant.id])

  const handleSaveStatus = async (
    orderId: number,
    currentStatus: OrderStatus
  ) => {
    const nextStatus = selectedStatus[orderId] ?? currentStatus

    if (currentStatus === 'DELIVERED') {
      return
    }

    try {
      setSavingOrderId(orderId)
      setMessage('')
      await updateOrderStatus(orderId, nextStatus)
      await loadOrders()
      setMessage(`Pedido #${orderId} atualizado para ${nextStatus}.`)
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : 'Unable to update order status.'
      )
    } finally {
      setSavingOrderId(null)
    }
  }

  return (
    <S.Section>
      <S.Toolbar>
        <div>
          <S.Kicker>Orders</S.Kicker>
          <h2>Pedidos de {restaurant.name}</h2>
        </div>
        <span>{loading ? 'Carregando...' : `${orders.length} pedidos`}</span>
      </S.Toolbar>

      {error ? <S.Notice>{error}</S.Notice> : null}
      {message ? <S.Notice>{message}</S.Notice> : null}

      <S.OrderList>
        {orders.map((order) => {
          const orderId = getOrderId(order)
          const total = moneyFormatter.format(getOrderTotal(order))

          return (
            <S.OrderCard key={orderId}>
              <S.OrderInfo>
                <h3>Pedido #{orderId}</h3>
                <span>
                  Cliente: {order.customerName ?? `#${order.customerId}`}
                  {order.customerEmail ? ` · ${order.customerEmail}` : ''}
                </span>
                <span>Total: {total}</span>
                <span>
                  Delivery:{' '}
                  {order.deliveryAddressSnapshot ?? 'Sem endereço informado'}
                </span>

                <div>
                  <strong>Itens</strong>
                  <ul>
                    {order.items?.map((item) => (
                      <li key={`${orderId}-${item.productId}`}>
                        {getItemName(item)} x{item.quantity}
                      </li>
                    ))}
                  </ul>
                </div>
              </S.OrderInfo>

              <S.OrderSide>
                <S.StatusBadge>{order.status}</S.StatusBadge>

                {order.status !== 'DELIVERED' ? (
                  <>
                    <S.Select
                      value={selectedStatus[orderId] ?? order.status}
                      onChange={(event) =>
                        setSelectedStatus((current) => ({
                          ...current,
                          [orderId]: event.target.value as OrderStatus
                        }))
                      }
                    >
                      {ORDER_STATUS_OPTIONS.map((statusOption) => (
                        <option key={statusOption} value={statusOption}>
                          {statusOption}
                        </option>
                      ))}
                    </S.Select>

                    <S.TextButton
                      type="button"
                      onClick={() =>
                        void handleSaveStatus(orderId, order.status)
                      }
                      disabled={savingOrderId === orderId}
                    >
                      Alterar status
                    </S.TextButton>
                  </>
                ) : (
                  <S.SmallMeta>Pedido entregue. Status bloqueado.</S.SmallMeta>
                )}
              </S.OrderSide>
            </S.OrderCard>
          )
        })}
      </S.OrderList>

      {!loading && orders.length === 0 ? (
        <S.EmptyState>
          Nenhum pedido encontrado para este restaurante.
        </S.EmptyState>
      ) : null}
    </S.Section>
  )
}

export default ManagerOrders
