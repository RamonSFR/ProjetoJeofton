import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { addToCart } from '../../store/cartSlice'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { selectCartRestaurantId } from '../../store/selectors'
import { getRestaurant, getRestaurantProducts } from '../../lib/api'
import { getRestaurantImage } from '../../lib/restaurant-images'
import type { ProductRecord, RestaurantRecord } from '../../types/api'

import * as S from './styles'

const RestaurantDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const cartRestaurantId = useAppSelector(selectCartRestaurantId)
  const restaurantId = Number(id)

  const [restaurant, setRestaurant] = useState<RestaurantRecord | null>(null)
  const [products, setProducts] = useState<ProductRecord[]>([])
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)

  const moneyFormatter = useMemo(
    () =>
      new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }),
    []
  )

  useEffect(() => {
    const loadRestaurant = async () => {
      try {
        setLoading(true)
        setMessage('')

        const restaurantResponse = await getRestaurant(restaurantId)
        setRestaurant(restaurantResponse)

        const productsResponse = await getRestaurantProducts(restaurantId, {
          page: 1,
          pageSize: 200
        })
        setProducts(productsResponse.data)
      } catch (error) {
        setMessage(
          error instanceof Error ? error.message : 'Unable to load menu.'
        )
      } finally {
        setLoading(false)
      }
    }

    if (Number.isFinite(restaurantId)) void loadRestaurant()
  }, [restaurantId])

  const handleAddToCart = (product: ProductRecord) => {
    if (!restaurant) return

    dispatch(
      addToCart({
        restaurantId: restaurant.id,
        restaurantName: restaurant.name,
        product: {
          productId: product.id,
          name: product.name,
          price: product.price
        },
        quantity: 1
      })
    )

    setMessage('Item added to your cart.')
  }

  return (
    <S.PageShell>
      <S.Topbar>
        <Link to="/restaurants">Voltar para restaurantes</Link>
        <button type="button" onClick={() => navigate('/cart')}>
          Abrir carrinho
        </button>
      </S.Topbar>

      <S.Hero>
        <S.HeroImage
          src={getRestaurantImage(restaurantId)}
          alt={restaurant?.name ?? 'Restaurant'}
        />
        <S.HeroCopy>
          <S.Kicker>Cardápio</S.Kicker>
          <h1>{restaurant?.name ?? 'Restaurant menu'}</h1>
          <p>
            Clique no botão do cardápio para adicionar o prato ao seu carrinho
            de compras. O carrinho sempre fica limitado a um único restaurante.
          </p>
          <S.MetaRow>
            <span>
              {cartRestaurantId && cartRestaurantId !== restaurantId
                ? 'Adicionar um pedido de outro restaurante irá limpar seu carrinho atual.'
                : 'Carrinho pronto para este restaurante.'}
            </span>
          </S.MetaRow>
        </S.HeroCopy>
      </S.Hero>

      {message ? <S.MessageBanner>{message}</S.MessageBanner> : null}

      <S.Section>
        <S.SectionHeader>
          <div>
            <S.Kicker>Itens disponíveis</S.Kicker>
            <h2>{restaurant?.name ?? 'Menu items'}</h2>
          </div>
          <span>{loading ? 'Loading...' : `${products.length} dishes`}</span>
        </S.SectionHeader>

        <S.MenuGrid>
          {products.map((product) => (
            <S.MenuCard key={product.id}>
              <strong>{product.name}</strong>
              <span>{moneyFormatter.format(Number(product.price))}</span>
              <button type="button" onClick={() => handleAddToCart(product)}>
                Adicionar ao carrinho
              </button>
            </S.MenuCard>
          ))}
        </S.MenuGrid>

        {!loading && products.length === 0 ? (
          <S.EmptyState>
            Este restaurante não tem itens de menu disponíveis no momento.
          </S.EmptyState>
        ) : null}
      </S.Section>
    </S.PageShell>
  )
}

export default RestaurantDetails
