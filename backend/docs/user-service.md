# User Service

Microsserviço de **usuários** (cadastro, consulta, atualização e remoção). Stack: **Node.js**, **Express 5**, **Prisma 7**, **PostgreSQL**, validação com **Zod**. Senha persistida com **bcrypt** (nunca retornada nas respostas).

Código-fonte: `backend/user-service/`.

## Porta e banco

| Item | Valor (padrão Docker Compose) |
|------|-------------------------------|
| Porta HTTP | `3001` |
| Banco | `db_users` (PostgreSQL) |
| Porta Postgres no host | `5434` → `5432` no container |

Variável obrigatória: `DATABASE_URL` (connection string PostgreSQL). Opcional: `PORT` (padrão `3001`).

## Modelo de dados (Prisma)

Tabela `users` (`@@map("users")`):

| Campo | Tipo | Observações |
|-------|------|-------------|
| `id` | Int | PK, autoincremento. |
| `cpf` | String | Único; 11 dígitos após normalização (não-dígitos removidos na validação). |
| `name` | String | |
| `email` | String | Único. |
| `password` | String | Hash bcrypt no armazenamento. |
| `createdAt`, `updatedAt` | DateTime | |

## Health check

### `GET /test`

Registrado **antes** do router de usuários para não ser capturado por `GET /:id`.

**Resposta `200`:** `{ "status": "ok" }`

---

## API REST

Base no **gateway**: `http://localhost:3000/users/...`  
Base **direto** no serviço: `http://localhost:3001/...` (mesmos paths relativos após o prefixo `/users` no gateway).

**Headers:** `Content-Type: application/json` em `POST` e `PUT`.

### Erro de validação `400` (Zod)

```json
{
  "message": "Dados invalidos",
  "errors": { "campo": ["mensagem"] },
  "formErrors": []
}
```

---

### `GET /`

Lista usuários com **paginação**.

**Query (opcional):**

| Parâmetro | Padrão | Regras |
|-----------|--------|--------|
| `page` | `1` | inteiro ≥ 1 |
| `pageSize` | `20` | inteiro entre 1 e 100 |

**Resposta `200`:** `{ "data": [...], "meta": { "page", "pageSize", "total", "totalPages" } }` — itens **sem** `password`.

**Gateway:** `GET /users?page=1&pageSize=10`

---

### `GET /email`

**Query obrigatória:** `email` (string, formato de e-mail).

**Resposta `200`:** objeto usuário (sem `password`).  
**Resposta `404`:** `{ "message": "Usuario nao encontrado." }`

**Gateway:** `GET /users/email?email=maria@exemplo.com`

**Ordem de rotas:** esta rota é mais específica que `GET /:id` e está registrada antes.

---

### `GET /:id`

**Params:** `id` — inteiro positivo.

**Resposta `200`:** usuário sem `password`.  
**Resposta `404`:** usuário não encontrado.

**Gateway:** `GET /users/1`

---

### `POST /`

**Body (JSON):**

| Campo | Obrigatório | Regras |
|-------|-------------|--------|
| `cpf` | sim | Após remover não-dígitos, **11** dígitos (pode enviar mascarado). |
| `name` | sim | mín. 2 caracteres (trim). |
| `email` | sim | e-mail válido. |
| `password` | sim | mín. 8 caracteres. |

**Resposta `201`:** usuário criado (sem `password`).  
**Resposta `500`:** erro genérico (ex.: violação de unicidade em `cpf`/`email` — hoje não há `409` específico no controller).

**Gateway:** `POST /users`

---

### `PUT /:id`

**Params:** `id` — inteiro positivo.

**Body:** parcial; **pelo menos um** campo entre `cpf`, `name`, `email`, `password`. Mesmas regras do `POST` para cada campo enviado.

**Resposta `200`:** usuário atualizado (sem `password`).  
**Resposta `404`:** não encontrado.

**Gateway:** `PUT /users/1`

---

### `DELETE /:id`

**Resposta `200`:** objeto do usuário removido (ainda sem expor `password` no tipo de resposta do serviço).  
**Resposta `404`:** não encontrado.

**Gateway:** `DELETE /users/1`

---

## Integrações

- Nenhuma chamada HTTP de saída neste serviço.
- O **restaurant-service** valida existência do gestor com `GET {USER_SERVICE_URL}/:id` (sem prefixo `/users`).

## Segurança

- Respostas **nunca** incluem `password`.
- Autenticação JWT/sessão **não** implementada nesta versão.

## cURL (Windows)

Prefira `curl.exe` e, para JSON, arquivo UTF-8:

```bash
curl.exe -s -X POST "http://localhost:3000/users" -H "Content-Type: application/json" --data-binary "@body.json"
```

No PowerShell, **evite** `$pid` como nome de variável (é reservado).
