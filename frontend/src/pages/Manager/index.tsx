import { useEffect } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'

import { clearCart } from '../../store/cartSlice'
import { useAppDispatch } from '../../store/hooks'
import { clearSession } from '../../lib/session'
import { useSession } from '../../lib/useSession'

import * as S from './styles'

const Manager = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const session = useSession()

  useEffect(() => {
    if (!session) {
      navigate('/login', { replace: true })
      return
    }

    if (session.role !== 'manager') {
      navigate('/', { replace: true })
    }
  }, [navigate, session])

  const handleLogout = () => {
    clearSession()
    dispatch(clearCart())
    navigate('/login')
  }

  if (!session || session.role !== 'manager') {
    return (
      <S.PageShell>
        <S.Notice>Carregando área do gerente...</S.Notice>
      </S.PageShell>
    )
  }

  return (
    <S.PageShell>
      <S.TopNav>
        <S.Brand to="/manager">
          <span>Orderly Manager</span>
          <small>Painel de restaurantes e pedidos</small>
        </S.Brand>

        <S.NavLinks>
          <NavLink
            to="/manager/restaurants"
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            Restaurants
          </NavLink>
          <NavLink
            to="/manager"
            end
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            Dashboard
          </NavLink>
        </S.NavLinks>

        <S.NavActions>
          <S.SessionChip>
            <span>Usuário</span>
            <strong>{session.name}</strong>
            <small>{session.role === 'manager' ? 'Gerente' : 'Cliente'}</small>
          </S.SessionChip>

          <S.LogoutButton type="button" onClick={handleLogout}>
            Logout
          </S.LogoutButton>
        </S.NavActions>
      </S.TopNav>

      <S.Content>
        <Outlet />
      </S.Content>
    </S.PageShell>
  )
}

export default Manager