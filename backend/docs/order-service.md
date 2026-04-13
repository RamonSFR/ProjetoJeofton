# Order Service

Microsserviço de **pedidos** (`Order`, `OrderItem`), com cálculo de total, snapshot de preço/nome do produto e máquina de estados para **status**. Stack: **Node.js**, **Express 5**, **Prisma 7**, **PostgreSQL**, **Zod**.

Código-fonte: `backend/order-service/`.

**Observação de modelo:** `OrderItem` **não** possui campo `subtotal`; o total do pedido é a soma de `quantity * unitPrice` por linha.

## Porta e banco

| Item | Padrão (Docker Compose) |
|------|-------------------------|
| Porta HTTP | `3003` |
| Banco | `db_orders` |
| Postgres no host | `5436` → `5432` no container |

Variáveis:

| Variável | Descrição |
|----------|-----------|
| `DATABASE_URL` | PostgreSQL (obrigatória). |
| `PORT` | Padrão `3003`. |
| `USER_SERVICE_URL` | Base do user-service (ex.: `http://user-service:3001`) para `GET /:customerId`. |
| `RESTAURANT_SERVICE_URL` | Base do restaurant-service para `GET /:restaurantId` e `GET /:restaurantId/products?...`. |

## Modelo de dados (Prisma)

### Enum `OrderStatus`

Valores exatos na API (string):

`PENDING` | `CONFIRMED` | `PREPARING` | `OUT_FOR_DELIVERY` | `DELIVERED` | `CANCELLED`

### `Order` → `orders`

| Campo | Descrição |
|-------|-----------|
| `restaurantId`, `customerId` | Referências lógicas (sem FK cross-database). |
| `total` | `Decimal(10,2)` — em JSON costuma vir como string. |
| `status` | Enum; padrão `PENDING` na criação. |
| `deliveryAddressSnapshot` | Opcional; texto livre no momento do pedido. |

### `OrderItem` → `order_items`

| Campo | Descrição |
|-------|-----------|
| `productId` | ID do produto no restaurant-service. |
| `productNameSnapshot` | Nome no momento da compra. |
| `quantity` | Inteiro positivo. |
| `unitPrice` | Snapshot do preço (`Decimal`). |

Itens são removidos em **cascade** se o pedido for apagado (evolução futura; hoje o cancelamento é lógico via status).

---

## Transições de status

Regra implementada em `src/domain/order-status.ts`:

| Status atual | Pode ir para |
|--------------|--------------|
| `PENDING` | `CONFIRMED`, `CANCELLED` |
| `CONFIRMED` | `PREPARING`, `CANCELLED` |
| `PREPARING` | `OUT_FOR_DELIVERY` |
| `OUT_FOR_DELIVERY` | `DELIVERED` |
| `DELIVERED` | *(nenhum — final)* |
| `CANCELLED` | *(nenhum — final)* |

- **Mesmo status** em `PATCH`: tratado como **no-op** (`200`, pedido inalterado semanticamente além de `updatedAt` se houver update no Prisma).
- **Cancelamento por `DELETE`:** tenta transição para `CANCELLED`. Se o status atual não permitir, **409**. Se já estiver `CANCELLED`, devolve o pedido (**200**, idempotente).

---

## Health check

### `GET /test`

Fora do prefixo `/orders`, na raiz da app.

**Resposta `200`:** `{ "status": "ok" }`

---

## Montagem das rotas HTTP

O router de pedidos está em **`/orders`** (`app.use('/orders', orderRouter)`).

Ordem interna relevante: `PATCH /:id/status` é registrado **antes** de `GET /:id` para não capturar `status` como id.

---

## API REST

No **gateway**, use sempre o prefixo **`/orders`** uma única vez:

- `http://localhost:3000/orders`
- `http://localhost:3000/orders/1`
- `http://localhost:3000/orders/1/status` (PATCH)

Direto no serviço (porta 3003), os paths são os mesmos: `/orders`, `/orders/1`, etc.

**Headers:** `Content-Type: application/json` onde houver body.

### Validação `400`

Formato padrão Zod (`message`, `errors`, `formErrors`).

---

### `POST /orders`

Cria pedido: valida cliente e restaurante via HTTP, busca preços atuais dos produtos no restaurant-service, agrega quantidades por `productId`, calcula `total` e persiste itens com snapshot.

**Body:**

| Campo | Obrigatório | Regras |
|-------|-------------|--------|
| `restaurantId` | sim | inteiro positivo. |
| `customerId` | sim | inteiro positivo. |
| `items` | sim | array com ≥ 1 item; cada item: `productId` e `quantity` (inteiros positivos). |
| `deliveryAddress` | não | string não vazia (trim); mapeada para `deliveryAddressSnapshot`. |

**Respostas:**

| Código | Situação |
|--------|----------|
| `201` | Pedido criado com `items`. |
| `404` | Cliente ou restaurante não encontrado nos serviços externos. |
| `422` | Produto inexistente no restaurante ou regra de itens (mensagem em `message`). |
| `500` | Erro interno não mapeado. |

---

### `GET /orders`

Lista paginada com filtros opcionais.

**Query:**

| Parâmetro | Padrão | Regras |
|-----------|--------|--------|
| `page` | `1` | ≥ 1 |
| `pageSize` | `20` | 1–100 |
| `customerId` | opcional | inteiro positivo |
| `restaurantId` | opcional | inteiro positivo |
| `status` | opcional | um dos valores do enum |

**Resposta `200`:** `{ "data": [ pedidos com items ], "meta": { page, pageSize, total, totalPages } }`.

---

### `GET /orders/:id`

**Resposta `200`:** pedido com `items`.  
**Resposta `404`:** `{ "message": "Pedido nao encontrado." }`

---

### `PATCH /orders/:id/status`

**Body:**

```json
{ "status": "CONFIRMED" }
```

**Resposta `200`:** pedido atualizado.  
**Resposta `404`:** pedido não encontrado.  
**Resposta `409`:** transição inválida:

```json
{
  "message": "Transicao de status nao permitida",
  "current": "DELIVERED",
  "requested": "CANCELLED"
}
```

---

### `DELETE /orders/:id`

Cancelamento lógico (status → `CANCELLED` quando permitido).

**Resposta `200`:** pedido cancelado ou já cancelado.  
**Resposta `404`:** não encontrado.  
**Resposta `409`:** não é possível cancelar neste status (corpo inclui `current` / `requested` como no PATCH).

---

## Dependências em runtime

1. **User service:** confirma que `customerId` existe.  
2. **Restaurant service:** confirma `restaurantId`; obtém produtos via `GET /{restaurantId}/products?page=1&pageSize=100&ids=...`.

Se esses serviços estiverem indisponíveis, a criação do pedido pode falhar com **404** ou **500** conforme o caso.

---

## Segurança

Não há autenticação: `customerId` e `restaurantId` são informados no body — adequado apenas para desenvolvimento até introduzir JWT e autorização.
