import { useState } from 'react'

import * as S from './styles'

type LoginType = 'cliente' | 'vendedor'

const Login = () => {
  const [loginState, setLoginState] = useState<LoginType>('cliente')

  return (

    <S.Container>
      <h1>Ifome</h1>

      <S.SelectLoginButtons>
        <S.LoginButton onClick={() => setLoginState("cliente")} className={`left ${loginState === "cliente" ? "isActive" : ""}`}>Cliente</S.LoginButton>
        <S.LoginButton onClick={() => setLoginState("vendedor")} className={`right ${loginState === "vendedor" ? "isActive" : ""}`}>Vendedor</S.LoginButton>
      </S.SelectLoginButtons>

      <S.Form>
        <S.FormTitle>Faça seu login</S.FormTitle>
        <input type="email" placeholder="email" />
        <input type="password" placeholder="Senha" />
        <button type="submit">Entrar</button>
      </S.Form>
    </S.Container>
  )
}

export default Login
