import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'

import { getUserByEmail } from '../../lib/api'
import { saveSession } from '../../lib/session'
import { useSession } from '../../lib/useSession'
import { useAppDispatch } from '../../store/hooks'
import { clearCart } from '../../store/cartSlice'
import type { UserRole } from '../../types/api'

import * as S from './styles'

const Login = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const session = useSession()
  const [loginState, setLoginState] = useState<UserRole>('client')
  const [email, setEmail] = useState('')
  const [statusMessage, setStatusMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    try {
      setLoading(true)
      setStatusMessage('')

      const user = await getUserByEmail(email.trim())
      saveSession(user, loginState)
      dispatch(clearCart())
      setStatusMessage('Login realizado com sucesso.')
      navigate('/')
    } catch (loginError) {
      setStatusMessage(
        loginError instanceof Error
          ? loginError.message
          : 'Ocorreu um erro ao tentar validar o login. Por favor, tente novamente.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <S.Container>
      <S.LoginCard>
        <S.HeaderBlock>
          <S.Kicker>Login</S.Kicker>
          <h1>Efetue login para realizar e verificar seus pedidos</h1>
        </S.HeaderBlock>

        <S.SelectLoginButtons>
          <S.LoginButton
            type="button"
            onClick={() => setLoginState('client')}
            className={loginState === 'client' ? 'isActive' : ''}
          >
            Cliente
          </S.LoginButton>
          <S.LoginButton
            type="button"
            onClick={() => setLoginState('manager')}
            className={loginState === 'manager' ? 'isActive' : ''}
          >
            Gerente
          </S.LoginButton>
        </S.SelectLoginButtons>

        <S.Form onSubmit={handleSubmit}>
          <S.FormTitle>Faça login com seu email</S.FormTitle>
          <input
            type="email"
            placeholder="seu-email@exemplo.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </S.Form>
      </S.LoginCard>
    </S.Container>
  )
}

export default Login
