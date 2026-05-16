# Backend do projeto

Este diretorio concentra todo o backend da aplicacao:

- `user-service` — usuarios e banco `db_users`
- `restaurant-service` — restaurantes/produtos e banco `db_restaurants`
- `order-service` — pedidos e banco `db_orders`
- `notification-service` — consumer RabbitMQ para notificacoes de pedido
- `api-gateway` — porta **3000**, expoe `/users`, `/restaurants`, `/orders` e `/test`
- `rabbitmq` — broker AMQP + Management UI

## Subir os microservicos (recomendado)

No proprio diretorio `backend/`:

```bash
docker compose up --build
```

Endpoints publicos:

- `http://localhost:3000/test`
- `http://localhost:3000/users`
- `http://localhost:3000/restaurants`
- `http://localhost:3000/orders`
- RabbitMQ Management UI: `http://localhost:15672` (admin/admin)

## Fluxo de mensageria

Ao criar pedido no `order-service`, um evento de integracao `PedidoCriadoEvent` e publicado na exchange fanout `gestao-pedidos.events`.
O `notification-service` consome esse evento na fila `GestaoPedidos.Notificacoes:PedidoCriadoEvent` e registra o log:

`[E-MAIL SIMULADO] Para: <email> | Pedido: <id> | Total: R$ <valor>`

## Checkpoint de validacao (ordem sugerida)

1. Verificar stack e saude dos containers:

```bash
docker compose ps
```

2. Criar pedido:

```bash
curl -X POST http://localhost:3000/orders \
  -H "Content-Type: application/json" \
  -d '{"restaurantId":1,"customerId":1,"items":[{"productId":1,"quantity":1}]}'
```

3. Verificar processamento no servico de notificacoes:

```bash
docker compose logs notification-service
```

4. Verificar queue na Management API do RabbitMQ:

```bash
curl -u admin:admin \
  http://localhost:15672/api/queues/%2F/GestaoPedidos.Notificacoes:PedidoCriadoEvent
```

Esperado: `messages_ready = 0` e `messages_unacknowledged = 0`.

5. Rodar testes de integracao do fluxo:

```bash
cd order-service
npm run test:integration
```

## Executar sem Docker

Em cinco terminais, na ordem:

1. `cd user-service && cp .env.example .env`, ajustar `DATABASE_URL`, depois `npx prisma migrate dev` e `npm run dev`
2. `cd restaurant-service && cp .env.example .env`, ajustar `DATABASE_URL` e `USER_SERVICE_URL`, depois `npx prisma migrate dev` e `npm run dev`
3. `cd order-service && cp .env.example .env`, ajustar `DATABASE_URL`, `USER_SERVICE_URL`, `RESTAURANT_SERVICE_URL`, `RABBITMQ_URL`, depois `npx prisma migrate dev` e `npm run dev`
4. `cd notification-service && cp .env.example .env`, ajustar `RABBITMQ_URL`, depois `npm install` e `npm run dev`
5. `cd api-gateway && cp .env.example .env`, depois `npm run dev`
