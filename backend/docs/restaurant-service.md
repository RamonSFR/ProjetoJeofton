# Restaurant Service

Microsserviço de **restaurantes** e **produtos** (cardápio por restaurante). Stack: **Node.js**, **Express 5**, **Prisma 7**, **PostgreSQL**, **Zod**.

Código-fonte: `backend/restaurant-service/`.

## Porta e banco

| Item | Padrão (Docker Compose) |
|------|-------------------------|
| Porta HTTP | `3002` |
| Banco | `db_restaurants` |
| Postgres no host | `5435` → `5432` no container |

Variáveis:

| Variável | Descrição |
|----------|-----------|
| `DATABASE_URL` | Connection string PostgreSQL (obrigatória). |
| `PORT` | Porta HTTP (padrão `3002`). |
| `USER_SERVICE_URL` | Base URL do user-service para validar `managerId` (ex.: `http://user-service:3001`). |

## Modelo de dados (Prisma)

### `Restaurant` → tabela `restaurants`

| Campo | Observações |
|-------|-------------|
| `id` | PK. |
| `name` | Nome do estabelecimento. |
| `managerId` | ID do usuário gestor (FK lógica ao user-service; coluna `manager_id`). |

### `Product` → tabela `products`

| Campo | Observações |
|-------|-------------|
| `id` | PK. |
| `restaurantId` | Dono do produto (`restaurant_id`). |
| `name`, `price` | `price` como `Decimal(10,2)` — na API JSON costuma aparecer como **string** (ex.: `"15.5"`). |

## Health check

### `GET /test`

Definido **antes** dos routers para não conflitar com `GET /:id`.

**Resposta `200`:** `{ "status": "ok" }`

---

## Integração com User Service

Ao **criar** ou **atualizar** restaurante com `managerId`, o serviço chama:

`GET {USER_SERVICE_URL}/{managerId}`

Se retornar **404**, a API responde **500** com mensagem genérica (`Erro ao criar restaurante.` / `Erro ao atualizar restaurante.`) — o cliente deve garantir que o usuário exista **antes** (ex.: `POST /users`).

---

## API — Restaurantes

Base no **gateway:** `http://localhost:3000/restaurants/...`  
Base **direto:** `http://localhost:3002/...`

**Validação `400`:** mesmo formato `{ "message": "Dados invalidos", "errors", "formErrors" }`.

### `GET /`

Listagem paginada.

**Query:** `page` (padrão 1), `pageSize` (padrão 20, máx. 100).

**Resposta `200`:** `{ "data", "meta" }`.

---

### `GET /:id`

**Resposta `200`:** restaurante.  
**Resposta `404`:** `{ "message": "Restaurante nao encontrado." }`

---

### `POST /`

**Body:**

| Campo | Regras |
|-------|--------|
| `name` | string, mín. 2 caracteres. |
| `managerId` | número inteiro positivo (deve existir no user-service). |

**Resposta `201`:** restaurante criado.  
**Resposta `500`:** gestor inexistente ou erro interno.

---

### `PUT /:id`

Body parcial (`name` e/ou `managerId`); **não** pode ser `{}`.

**Resposta `200` / `404` / `500`:** como no create/update de gestor.

---

### `DELETE /:id`

**Resposta `200`:** objeto removido.  
**Resposta `404`:** não encontrado.

**Nota:** se existirem `products` ligados, o delete pode falhar por FK do Prisma (comportamento do banco).

---

## API — Produtos (cardápio)

Rotas sob **`/:restaurantId/products`** (registradas **antes** do router de `/:id` do restaurante onde aplicável; aqui os paths de produto são mais específicos).

### `POST /:restaurantId/products`

**Body:**

| Campo | Regras |
|-------|--------|
| `name` | string, mín. 2 caracteres. |
| `price` | número finito **> 0**. |

**Resposta `201`:** produto.  
**Resposta `404`:** restaurante inexistente (FK / tratamento).

---

### `GET /:restaurantId/products`

**Query:**

| Parâmetro | Padrão | Regras |
|-----------|--------|--------|
| `page` | `1` | ≥ 1 |
| `pageSize` | `20` | 1–100 |
| `ids` | opcional | Lista separada por **vírgulas** (ex.: `ids=1,2,3`), até **100** ids. Filtra produtos desse restaurante. |

**Resposta `200`:** `{ "data", "meta" }`.

---

### `GET /:restaurantId/products/:productId`

**Resposta `200`:** produto.  
**Resposta `404`:** `{ "message": "Produto nao encontrado." }`

---

### `PUT /:restaurantId/products/:productId`

Body parcial (`name` e/ou `price`); não pode ser `{}`.

**Resposta `200` / `404`**

---

### `DELETE /:restaurantId/products/:productId`

**Resposta `200`:** produto removido.  
**Resposta `404`:** não encontrado.

---

## Exemplos de URL (gateway)

```text
GET    http://localhost:3000/restaurants
POST   http://localhost:3000/restaurants
GET    http://localhost:3000/restaurants/1
PUT    http://localhost:3000/restaurants/1
DELETE http://localhost:3000/restaurants/1

POST   http://localhost:3000/restaurants/1/products
GET    http://localhost:3000/restaurants/1/products?page=1&pageSize=10&ids=1
GET    http://localhost:3000/restaurants/1/products/1
PUT    http://localhost:3000/restaurants/1/products/1
DELETE http://localhost:3000/restaurants/1/products/1
```
