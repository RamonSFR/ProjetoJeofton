import * as S from './styles'

const Orders = () => {
  // Mock de dados para exemplificar a lista
  const orders = [
    { id: '#1234', date: '12/05/2026', status: 'Entregue', total: 'R$ 85,90' },
    { id: '#1235', date: '15/05/2026', status: 'A caminho', total: 'R$ 42,00' },
  ]

  return (
    <S.Container>
      <h1>EFOOD</h1>
      <S.OrdersContent>
        <S.Title>Meus Pedidos</S.Title>
        <S.OrderList>
          {orders.map((order) => (
            <S.OrderItem key={order.id}>
              <div>
                <strong>Pedido {order.id}</strong>
                <span>Data: {order.date}</span>
              </div>
              <div>
                <S.StatusTag>{order.status}</S.StatusTag>
                <p>{order.total}</p>
              </div>
            </S.OrderItem>
          ))}
        </S.OrderList>
        <S.BackButton to="/">Voltar para Home</S.BackButton>
      </S.OrdersContent>
    </S.Container>
  )
}

export default Orders