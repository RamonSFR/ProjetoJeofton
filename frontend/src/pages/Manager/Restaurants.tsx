import { useEffect, useState } from 'react'

import { getRestaurants } from '../../lib/api'
import { getRestaurantImage } from '../../lib/restaurant-images'
import { useSession } from '../../lib/useSession'
import type { RestaurantRecord } from '../../types/api'

import * as S from './styles'

const ManagerRestaurants = () => {
  const session = useSession()
  const [restaurants, setRestaurants] = useState<RestaurantRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadRestaurants = async () => {
      if (!session || session.role !== 'manager') {
        return
      }

      try {
        setLoading(true)
        setError('')

        const response = await getRestaurants(1, 100)
        setRestaurants(
          response.data.filter((restaurant) => restaurant.managerId === session.id)
        )
      } catch (fetchError) {
        setError(
          fetchError instanceof Error ? fetchError.message : 'Unable to load restaurants.'
        )
      } finally {
        setLoading(false)
      }
    }

    void loadRestaurants()
  }, [session])

  return (
    <S.Section>
      <S.SectionHeader>
        <div>
          <S.Kicker>Restaurants</S.Kicker>
          <h1>Restaurantes do gerente</h1>
        </div>
        <span>{loading ? 'Carregando...' : `${restaurants.length} cards`}</span>
      </S.SectionHeader>

      {error ? <S.Notice>{error}</S.Notice> : null}

      <S.CardGrid>
        {restaurants.map((restaurant) => (
          <S.RestaurantCard key={restaurant.id} to={`/manager/restaurants/${restaurant.id}`}>
            <S.RestaurantImage src={getRestaurantImage(restaurant.id)} alt={restaurant.name} />
            <S.CardBody>
              <strong>{restaurant.name}</strong>
              <span>Abra para editar menu e acompanhar pedidos</span>
            </S.CardBody>
          </S.RestaurantCard>
        ))}
      </S.CardGrid>

      {!loading && restaurants.length === 0 ? (
        <S.EmptyState>
          Este gerente ainda não possui restaurantes vinculados.
        </S.EmptyState>
      ) : null}
    </S.Section>
  )
}

export default ManagerRestaurants