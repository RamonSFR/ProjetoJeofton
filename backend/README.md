# Backend do projeto

Este diretorio concentra todo o backend da aplicacao:

- `user-service` — usuarios e banco `db_users`
- `restaurant-service` — restaurantes/produtos e banco `db_restaurants`
- `order-service` — pedidos e banco `db_orders`
- `notification-service` — consumer RabbitMQ para notificacoes de pedido
- `api-gateway` — porta **3000**, expoe `/users`, `/restaurants`, `/orders` e `/test`
- `rabbitmq` — broker AMQP + Management UI
- `redis` — cache distribuido para catalogo e queries frequentes
- `redisinsight` — interface visual para inspecionar chaves e uso do Redis
- `realtime-service` — WebSocket para eventos em tempo real (Socket.io)

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
- Redis Insight: `http://localhost:5540`
- Realtime Service: `http://localhost:3006` (WebSocket)
- Realtime Info: `http://localhost:3000/realtime/info`

## Fluxo de mensageria

Ao criar pedido no `order-service`, um evento de integracao `PedidoCriadoEvent` e publicado na exchange fanout `gestao-pedidos.events`.
O `notification-service` consome esse evento na fila `GestaoPedidos.Notificacoes:PedidoCriadoEvent` e registra o log:

`[E-MAIL SIMULADO] Para: <email> | Pedido: <id> | Total: R$ <valor>`

No `order-service`, o mesmo evento tambem e consumido por um **projetor de read model** na fila `GestaoPedidos.OrderService:PedidoCriadoProjection`.
Esse projetor aplica **consistencia eventual** para consultas de `GET /orders` e `GET /orders/:id`, populando as tabelas `orders_read` e `order_items_read`.
A idempotencia da projecao e garantida pela tabela `processed_events` (chave unica `event_id`): evento repetido e apenas reconhecido (`ack`) sem reprojecao.

## CQRS no order-service

- **Commands (write model):** `POST /orders`, `PATCH /orders/:id/status`, `DELETE /orders/:id` continuam operando no modelo transacional `orders/order_items`.
- **Queries (read model):** `GET /orders` e `GET /orders/:id` leem do modelo denormalizado `orders_read/order_items_read`.
- A listagem usa paginacao nativa PostgreSQL com `LIMIT/OFFSET`.
- As queries tambem usam **cache distribuido no Redis** com TTL curto para reduzir latencia sem esconder a consistencia eventual do read model.

## Cache distribuido com Redis

- `restaurant-service` aplica **Cache-Aside** em `GET /:restaurantId/products` e `GET /:restaurantId/products/:productId`.
- `POST`, `PUT` e `DELETE` de produto invalidam o cache do item e das listagens do restaurante apos a escrita no banco.
- `order-service` aplica cache distribuido em `GET /orders` e `GET /orders/:id`.
- O cache de pedidos e invalidado quando o projetor do CQRS grava no read model e tambem apos mudancas de status.
- As rotas de leitura ainda enviam `Cache-Control` para permitir cache HTTP curto em navegador/proxy.

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

6. Monitorar o Redis em tempo real:

```bash
docker compose exec redis redis-cli -a redissenha123 MONITOR
```

Esperado:

- `GET ProjetoJeofton:restaurant-service:product:*` na primeira e segunda leitura de produtos
- `SET ... EX 300` ou `EX 120` apos cache MISS no catalogo
- `GET ProjetoJeofton:order-service:order-read:*` nas consultas do read model
- `DEL ...` quando houver invalidacao apos escrita/projecao

## Executar sem Docker

Em cinco terminais, na ordem:

1. `cd user-service && cp .env.example .env`, ajustar `DATABASE_URL`, depois `npx prisma migrate dev` e `npm run dev`
2. `cd restaurant-service && cp .env.example .env`, ajustar `DATABASE_URL` e `USER_SERVICE_URL`, depois `npx prisma migrate dev` e `npm run dev`
3. `cd order-service && cp .env.example .env`, ajustar `DATABASE_URL`, `USER_SERVICE_URL`, `RESTAURANT_SERVICE_URL`, `RABBITMQ_URL`, depois `npx prisma migrate dev` e `npm run dev`
4. `cd notification-service && cp .env.example .env`, ajustar `RABBITMQ_URL`, depois `npm install` e `npm run dev`
5. `cd api-gateway && cp .env.example .env`, depois `npm run dev`
