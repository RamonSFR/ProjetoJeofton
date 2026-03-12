import * as S from './styles'

const Login = () => {
  return (
    <S.Container>
      <h1>EFOOD</h1>
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
