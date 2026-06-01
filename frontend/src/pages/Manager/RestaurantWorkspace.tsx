import { useEffect, useMemo, useState } from 'react'
import { Outlet, useNavigate, useParams } from 'react-router-dom'

import { getRestaurant } from '../../lib/api'
import { getRestaurantImage } from '../../lib/restaurant-images'
import { useSession } from '../../lib/useSession'
import type { RestaurantRecord } from '../../types/api'

import * as S from './styles'

export interface ManagerRestaurantContext {
  restaurant: RestaurantRecord
}

const ManagerRestaurantWorkspace = () => {
  const { restaurantId } = useParams()
  const navigate = useNavigate()
  const session = useSession()
  const id = Number(restaurantId)

  const [restaurant, setRestaurant] = useState<RestaurantRecord | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const restaurantImage = useMemo(
    () => (Number.isFinite(id) ? getRestaurantImage(id) : undefined),
    [id]
  )

  useEffect(() => {
    const loadRestaurant = async () => {
      if (!session || session.role !== 'manager' || !Number.isFinite(id)) {
        return
      }

      try {
        setLoading(true)
        setError('')

        const restaurantResponse = await getRestaurant(id)
        if (restaurantResponse.managerId !== session.id) {
          setError('Você não tem acesso a este restaurante.')
          setRestaurant(null)
          return
        }

        setRestaurant(restaurantResponse)
      } catch (fetchError) {
        setError(
          fetchError instanceof Error
            ? fetchError.message
            : 'Unable to load restaurant.'
        )
      } finally {
        setLoading(false)
      }
    }

    void loadRestaurant()
  }, [id, session])

  useEffect(() => {
    if (restaurant && session && restaurant.managerId !== session.id) {
      navigate('/manager/restaurants', { replace: true })
    }
  }, [navigate, restaurant, session])

  if (loading) {
    return <S.Notice>Carregando restaurante...</S.Notice>
  }

  if (error || !restaurant) {
    return (
      <S.Section>
        <S.SectionHeader>
          <div>
            <S.Kicker>Restaurant</S.Kicker>
            <h1>Workspace do restaurante</h1>
          </div>
        </S.SectionHeader>

        <S.Notice>{error || 'Restaurante nao encontrado.'}</S.Notice>
      </S.Section>
    )
  }

  return (
    <S.Section>
      <S.Hero>
        <S.HeroCopy>
          <S.Kicker>Restaurante</S.Kicker>
          <h1>{restaurant.name}</h1>
          <p>
            Use as abas abaixo para editar o menu e acompanhar os pedidos deste
            restaurante.
          </p>
        </S.HeroCopy>

        <S.HeroPanel>
          <img src={restaurantImage} alt={restaurant.name} />
          <S.HeroStats>
            <div>
              <span>ID</span>
              <strong>{restaurant.id}</strong>
            </div>
            <div>
              <span>Gerente(s)</span>
              <strong>{restaurant.managerId}</strong>
            </div>
            <div>
              <span>Estado</span>
              <strong>Ativo</strong>
            </div>
          </S.HeroStats>
        </S.HeroPanel>
      </S.Hero>

      <S.Tabs>
        <S.TabLink
          to="menu"
          className={({ isActive }) => (isActive ? 'active' : '')}
        >
          Cardápio
        </S.TabLink>
        <S.TabLink
          to="orders"
          className={({ isActive }) => (isActive ? 'active' : '')}
        >
          Pedidos
        </S.TabLink>
      </S.Tabs>

      <Outlet context={{ restaurant }} />
    </S.Section>
  )
}

export default ManagerRestaurantWorkspace
