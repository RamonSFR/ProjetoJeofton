import * as S from './styles'

const Header = () => {
  return (
    <S.HeaderContainer>
      <h1>Ifome</h1>
      <S.NavBar>
        <ul>
          <li><a href="#">Home</a></li>
          <li><a href="#">Lojas</a></li>
          <li><a href="#">Pedidos</a></li>
        </ul>
      </S.NavBar>
    </S.HeaderContainer>
  )
}

export default Header
