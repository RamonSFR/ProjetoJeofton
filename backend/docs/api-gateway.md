# API Gateway

Serviço **Node.js + Express** que expõe a API unificada na porta **3000** e encaminha as requisições aos microsserviços via [http-proxy-middleware](https://github.com/chimurai/http-proxy-middleware).

Código-fonte: `backend/api-gateway/`.

## Responsabilidades

- Expor um único host/porta para o frontend e ferramentas (Postman, curl).
- Repassar tráfego para `user-service`, `restaurant-service` e `order-service`.
- Ajustar o **path** da URL em alguns casos para o que cada serviço espera internamente.

## Variáveis de ambiente

| Variável | Padrão (local) | Descrição |
|----------|----------------|-----------|
| `PORT` | `3000` | Porta HTTP do gateway. |
| `USER_SERVICE_URL` | `http://127.0.0.1:3001` | URL base do user-service (no Docker: `http://user-service:3001`). |
| `RESTAURANT_SERVICE_URL` | `http://127.0.0.1:3002` | URL base do restaurant-service. |
| `ORDER_SERVICE_URL` | `http://127.0.0.1:3003` | URL base do order-service. |

## Rotas próprias do gateway

### `GET /test`

Health check do gateway.

**Resposta `200`:**

```json
{ "status": "ok" }
```

```bash
curl.exe -s "http://localhost:3000/test"
```

---

## Roteamento para os serviços

### Prefixo `/users` → user-service

- Requisições como `GET/POST/PUT/DELETE http://gateway:3000/users/...` são encaminhadas ao user-service.
- **pathRewrite:** remove o prefixo `/users` e envia o restante ao serviço. Exemplos:
  - `GET /users` → destino `GET /` (raiz do user-service).
  - `GET /users/1` → destino `GET /1`.
  - `GET /users/email?email=...` → destino `GET /email?email=...`.

O user-service monta o router na **raiz** (`/`).

### Prefixo `/restaurants` → restaurant-service

- Mesma ideia: remove `/restaurants`.
  - `GET /restaurants` → `GET /`.
  - `GET /restaurants/1/products` → `GET /1/products`.

### Prefixo `/orders` → order-service

O order-service monta as rotas de pedido em **`/orders`** (não na raiz). O proxy, ao ser registrado em `app.use('/orders', ...)`, recebe apenas o **sufixo** da URL (por exemplo `/`, `/5`, `/5/status`). O gateway **prefixa de novo** `/orders` no destino:

- Sufixo `/` ou vazio → destino `/orders`.
- Sufixo `/5` → destino `/orders/5`.
- Sufixo `/5/status` → destino `/orders/5/status`.

Assim, no cliente você usa sempre:

- `POST http://localhost:3000/orders`
- `GET http://localhost:3000/orders/1`
- `PATCH http://localhost:3000/orders/1/status`
- `DELETE http://localhost:3000/orders/1`

**Importante:** não é necessário (nem correto) repetir o segmento, por exemplo `POST /orders/orders`.

---

## Body e JSON

O gateway **não** aplica `express.json()` globalmente antes do proxy, para não consumir o stream do body. O corpo da requisição é repassado ao serviço downstream.

---

## Limitações atuais

- Não há autenticação nem autorização no gateway (JWT ou similar fica para evolução futura).
- Não há rate limiting, cache nem TLS terminado no gateway neste projeto acadêmico.
