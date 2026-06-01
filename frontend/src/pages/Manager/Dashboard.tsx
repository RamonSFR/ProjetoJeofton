import { useEffect, useMemo, useState } from 'react'

import { getOrders, getRestaurantProducts, getRestaurants } from '../../lib/api'
import { getRestaurantImage } from '../../lib/restaurant-images'
import { useSession } from '../../lib/useSession'
import type { OrderRecord, RestaurantRecord } from '../../types/api'

import * as S from './styles'

type RestaurantSummary = {
  restaurant: RestaurantRecord
  productCount: number
  orderCount: number
}

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

const getItemName = (productName?: string, productNameSnapshot?: string) =>
  productName ?? productNameSnapshot ?? 'Item sem nome'

const Dashboard = () => {
  const session = useSession()
  const moneyFormatter = useMemo(
    () =>
      new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }),
    []
  )

  const [restaurants, setRestaurants] = useState<RestaurantSummary[]>([])
  const [recentOrders, setRecentOrders] = useState<OrderRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadDashboard = async () => {
      if (!session || session.role !== 'manager') {
        return
      }

      try {
        setLoading(true)
        setError('')

        const restaurantsResponse = await getRestaurants(1, 100)
        const linkedRestaurants = restaurantsResponse.data.filter(
          (restaurant) => restaurant.managerId === session.id
        )

        const summaries = await Promise.all(
          linkedRestaurants.map(async (restaurant) => {
            const [productsResponse, ordersResponse] = await Promise.all([
              getRestaurantProducts(restaurant.id, { page: 1, pageSize: 100 }),
              getOrders({ page: 1, pageSize: 100, restaurantId: restaurant.id })
            ])

            return {
              restaurant,
              productCount: productsResponse.data.length,
              orderCount: ordersResponse.data.length
            }
          })
        )

        const allOrders = summaries.flatMap((summary) =>
          summary.orderCount > 0 ? [summary.restaurant.id] : []
        )

        let mergedRecent: OrderRecord[] = []

        if (linkedRestaurants.length) {
          // Fetch recent orders for each linked restaurant and merge
          const perRestaurant = await Promise.all(
            linkedRestaurants.map((r) =>
              getOrders({ page: 1, pageSize: 12, restaurantId: r.id })
            )
          )

          mergedRecent = perRestaurant.flatMap((res) => res.data)

          // sort by createdAt (newest first) falling back to order id
          mergedRecent.sort((a, b) => {
            const aTime = a.createdAt ? Date.parse(a.createdAt) : 0
            const bTime = b.createdAt ? Date.parse(b.createdAt) : 0
            if (aTime !== bTime) return bTime - aTime
            return (b.orderId ?? b.id) - (a.orderId ?? a.id)
          })

          // limit to 12 items
          mergedRecent = mergedRecent.slice(0, 12)
        }

        setRestaurants(summaries)
        setRecentOrders(mergedRecent)
        void allOrders
      } catch (fetchError) {
        setError(
          fetchError instanceof Error
            ? fetchError.message
            : 'Unable to load manager dashboard.'
        )
      } finally {
        setLoading(false)
      }
    }

    void loadDashboard()
  }, [session])

  return (
    <S.Section>
      <S.SectionHeader>
        <div>
          <S.Kicker>Dashboard</S.Kicker>
          <h1>Resumo da operação</h1>
        </div>
        <span>
          {loading
            ? 'Carregando...'
            : `${restaurants.length} restaurantes vinculados`}
        </span>
      </S.SectionHeader>

      {error ? <S.Notice>{error}</S.Notice> : null}

      <S.Hero>
        <S.HeroCopy>
          <S.Kicker>Visão geral</S.Kicker>
          <h1>
            Gerencie seus restaurantes e acompanhe os pedidos em um único lugar.
          </h1>
          <p>
            Use a área de Restaurantes para abrir um restaurante específico,
            editar o menu e acompanhar os pedidos em andamento.
          </p>
        </S.HeroCopy>

        <S.HeroPanel>
          <strong>Resumo</strong>
          <S.HeroStats>
            <div>
              <span>Restaurantes</span>
              <strong>{loading ? '...' : restaurants.length}</strong>
            </div>
            <div>
              <span>Itens de menu</span>
              <strong>
                {loading
                  ? '...'
                  : restaurants.reduce(
                      (total, item) => total + item.productCount,
                      0
                    )}
              </strong>
            </div>
            <div>
              <span>Pedidos</span>
              <strong>
                {loading
                  ? '...'
                  : restaurants.reduce(
                      (total, item) => total + item.orderCount,
                      0
                    )}
              </strong>
            </div>
          </S.HeroStats>
        </S.HeroPanel>
      </S.Hero>

      <S.Section>
        <S.SectionHeader>
          <div>
            <S.Kicker>Restaurantes</S.Kicker>
            <h2>Restaurantes vinculados</h2>
          </div>
          <span>{loading ? 'Carregando...' : `${restaurants.length}`}</span>
        </S.SectionHeader>

        <S.CardGrid>
          {restaurants.map(({ restaurant }) => (
            <S.RestaurantCard
              key={restaurant.id}
              to={`/manager/restaurants/${restaurant.id}`}
            >
              <S.RestaurantImage
                src={getRestaurantImage(restaurant.id)}
                alt={restaurant.name}
              />
              <S.CardBody>
                <strong>{restaurant.name}</strong>
                <span>Click para abrir menu e pedidos</span>
              </S.CardBody>
            </S.RestaurantCard>
          ))}
        </S.CardGrid>

        {!loading && restaurants.length === 0 ? (
          <S.EmptyState>
            Nenhum restaurante está vinculado a este gerente no momento.
          </S.EmptyState>
        ) : null}
      </S.Section>

      <S.Section>
        <S.SectionHeader>
          <div>
            <S.Kicker>Pedidos recentes</S.Kicker>
            <h2>Últimos pedidos</h2>
          </div>
          <span>{recentOrders.length} registros</span>
        </S.SectionHeader>

        <S.Panel>
          {recentOrders.length === 0 ? (
            <S.EmptyState>
              Os pedidos desse gerente aparecerão aqui quando houver
              movimentação.
            </S.EmptyState>
          ) : (
            recentOrders.slice(0, 6).map((order) => (
              <S.Notice key={getOrderId(order)}>
                Pedido #{getOrderId(order)} - Restaurante #{order.restaurantId}{' '}
                - {order.status} - {moneyFormatter.format(getOrderTotal(order))}
                {order.items?.length ? (
                  <>
                    {' '}
                    -{' '}
                    {order.items
                      .map((item) =>
                        getItemName(item.productName, item.productNameSnapshot)
                      )
                      .join(', ')}
                  </>
                ) : null}
              </S.Notice>
            ))
          )}
        </S.Panel>
      </S.Section>
    </S.Section>
  )
}

export default Dashboard
