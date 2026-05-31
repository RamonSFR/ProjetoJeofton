import { NavLink, useNavigate } from 'react-router-dom'

import * as S from './styles'
import { clearSession } from '../../lib/session'
import { useSession } from '../../lib/useSession'
import { useAppSelector } from '../../store/hooks'
import { selectCartCount } from '../../store/selectors'
import { useAppDispatch } from '../../store/hooks'
import { clearCart } from '../../store/cartSlice'

const Header = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const session = useSession()
  const cartCount = useAppSelector(selectCartCount)

  const handleLogout = () => {
    clearSession()
    dispatch(clearCart())
    navigate('/')
  }

  return (
    <S.HeaderContainer>
      <S.Brand to="/">
        <span>Orderly</span>
      </S.Brand>

      <S.NavBar>
        <li>
          <NavLink
            to="/restaurants"
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            Restaurantes
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/orders"
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            Meus Pedidos
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/cart"
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            Carrinho
            {cartCount > 0 ? <S.NavBadge>{cartCount}</S.NavBadge> : null}
          </NavLink>
        </li>
        <li>
          {session ? (
            <S.SessionLink as="span">
              {session.name} ·{' '}
              {session.role === 'manager' ? 'Gerente' : 'Cliente'}
            </S.SessionLink>
          ) : (
            <NavLink
              to="/login"
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              Login
            </NavLink>
          )}
        </li>
      </S.NavBar>

      <S.Actions>
        {session ? (
          <S.SessionBadge>
            <span>Logado</span>
            <strong>{session.name}</strong>
            <small>{session.role === 'manager' ? 'Gerente' : 'Cliente'}</small>
          </S.SessionBadge>
        ) : null}
        {session ? (
          <S.LogoutButton type="button" onClick={handleLogout}>
            Logout
          </S.LogoutButton>
        ) : null}
      </S.Actions>
    </S.HeaderContainer>
  )
}

export default Header
