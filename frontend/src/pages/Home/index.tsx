import { useEffect, useMemo, useState } from 'react'

import { getRestaurants } from '../../lib/api'
import { getRestaurantImage } from '../../lib/restaurant-images'
import { useSession } from '../../lib/useSession'
import type { RestaurantRecord } from '../../types/api'

import * as S from './styles'

const Home = () => {
  const session = useSession()
  const [restaurants, setRestaurants] = useState<RestaurantRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadRestaurants = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await getRestaurants(1, 60)
        setRestaurants(response.data)
      } catch (fetchError) {
        setError(
          fetchError instanceof Error
            ? fetchError.message
            : 'Unable to load restaurants.'
        )
      } finally {
        setLoading(false)
      }
    }

    void loadRestaurants()
  }, [])

  const title = useMemo(
    () => (session ? `Olá, ${session.name}` : 'Olá'),
    [session]
  )

  return (
    <S.PageShell>
      <S.Hero>
        <S.HeroCopy>
          <S.Kicker>Restaurantes</S.Kicker>
          <h1>{title}</h1>
          <p>
            Descubra os melhores restaurantes disponíveis na sua região, faça
            pedidos e acompanhe em tempo real.
          </p>
          <S.ActionRow>
            <S.PrimaryLink to="/restaurants">Ver restaurantes</S.PrimaryLink>
            <S.SecondaryLink to="/cart">Abrir carrinho</S.SecondaryLink>
          </S.ActionRow>
        </S.HeroCopy>

        <S.HeroPanel>
          <span>{session ? 'Logado' : 'Não-logado'}</span>
          <strong>
            {session
              ?  'Acesse seu carrinho e pedidos de qualquer lugar'
              : 'Faça login para acessar o carrinho e seus pedidos de qualquer lugar'}
          </strong>
          <ul>
            <li>
              <span>Restaurants</span>
              <strong>{loading ? '...' : restaurants.length}</strong>
            </li>
          </ul>
        </S.HeroPanel>
      </S.Hero>

      {error ? <S.ErrorBanner>{error}</S.ErrorBanner> : null}

      <S.Section>
        <S.SectionHeader>
          <div>
            <S.Kicker>Navegar</S.Kicker>
            <h2>Restaurantes</h2>
          </div>
          <span>
            {loading ? 'Carregando...' : `${restaurants.length} disponíveis`}
          </span>
        </S.SectionHeader>

        <S.RestaurantGrid>
          {restaurants.map((restaurant) => (
            <S.RestaurantCard
              key={restaurant.id}
              to={`/restaurants/${restaurant.id}`}
            >
              <S.RestaurantImage
                src={getRestaurantImage(restaurant.id)}
                alt={restaurant.name}
              />
              <S.RestaurantCardBody>
                <strong>{restaurant.name}</strong>
                <span>Open menu</span>
              </S.RestaurantCardBody>
            </S.RestaurantCard>
          ))}
        </S.RestaurantGrid>

        {!loading && restaurants.length === 0 ? (
          <S.EmptyState>No restaurants were returned by the API.</S.EmptyState>
        ) : null}
      </S.Section>
    </S.PageShell>
  )
}

export default Home
