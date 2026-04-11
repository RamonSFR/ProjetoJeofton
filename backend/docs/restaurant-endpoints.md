# API de restaurantes (`/restaurants`)

Base URL local (padrao): `http://localhost:3000` (via **api-gateway** com `docker compose` na raiz do repo).  
O **restaurant-service** sozinho usa tipicamente a porta `3002`. Ajuste host/porta conforme `.env`.

**Headers comuns**

- `Content-Type: application/json` - obrigatorio em rotas com body (`POST`, `PUT`).

**Erro de validacao (400)**

Quando query, params ou body nao passam no Zod:

```json
{
  "message": "Dados invalidos",
  "errors": {
    "campo": ["mensagem do erro"]
  },
  "formErrors": []
}
```

**Nota (Windows / PowerShell):** use `curl.exe` para evitar o alias `Invoke-WebRequest`.

---

## `GET /restaurants`

Lista restaurantes com **paginacao**.

### Query string (opcional)

| Parametro | Tipo | Padrao | Regras |
|-----------|------|--------|--------|
| `page` | numero | `1` | inteiro >= 1 |
| `pageSize` | numero | `20` | inteiro entre 1 e 100 |

### Resposta `200`

```json
{
  "data": [
    {
      "id": 1,
      "name": "Pizzaria do Bairro",
      "managerId": 5,
      "createdAt": "2026-01-01T00:00:00.000Z",
      "updatedAt": "2026-01-01T00:00:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "pageSize": 20,
    "total": 1,
    "totalPages": 1
  }
}
```

Com **nenhum** restaurante no banco, `total` e `totalPages` vêm `0` (lista vazia em `data`).

### cURL

```bash
curl.exe -s "http://localhost:3000/restaurants"
curl.exe -s "http://localhost:3000/restaurants?page=1&pageSize=10"
```

### Exemplo de erro de validacao

```bash
curl.exe -s "http://localhost:3000/restaurants?page=0"
```

---

## `GET /restaurants/:id`

Busca um restaurante por **id**.

### Parametros de rota

| Parametro | Tipo | Regras |
|-----------|------|--------|
| `id` | numero | inteiro positivo |

### Resposta `200`

Objeto restaurante.

### Resposta `404`

```json
{ "message": "Restaurante nao encontrado." }
```

### cURL

```bash
curl.exe -s "http://localhost:3000/restaurants/1"
```

---

## `POST /restaurants`

Cria um restaurante.

### Body (JSON)

| Campo | Tipo | Obrigatorio | Regras |
|-------|------|-------------|--------|
| `name` | string | sim | minimo 2 caracteres |
| `managerId` | numero | sim | inteiro positivo |

### Resposta `201`

Objeto restaurante criado.

### Resposta `409`

```json
{ "message": "Campo unico ja existe." }
```

### cURL

Arquivo `body-create-restaurant.json`:

```json
{
  "name": "Pizzaria do Bairro",
  "managerId": 5
}
```

```bash
curl.exe -s -X POST "http://localhost:3000/restaurants" ^
  -H "Content-Type: application/json" ^
  -d "@body-create-restaurant.json"
```

---

## `PUT /restaurants/:id`

Atualiza restaurante. **Pelo menos um** campo no body.

### Parametros de rota

| Parametro | Tipo | Regras |
|-----------|------|--------|
| `id` | numero | inteiro positivo |

### Body (JSON)

Todos opcionais, mas nao pode ser `{}` (o Zod rejeita com **400**; a mensagem costuma vir em `formErrors`, por exemplo: `Informe ao menos um campo para atualizar`).

| Campo | Tipo | Regras |
|-------|------|--------|
| `name` | string | minimo 2 caracteres |
| `managerId` | numero | inteiro positivo |

### Resposta `200`

Objeto restaurante atualizado.

### Respostas `404` e `409`

```json
{ "message": "Restaurante nao encontrado." }
```

```json
{ "message": "Campo unico ja existe." }
```

### cURL

Arquivo `body-update-restaurant.json`:

```json
{
  "name": "Pizzaria do Bairro - Renovada"
}
```

```bash
curl.exe -s -X PUT "http://localhost:3000/restaurants/1" ^
  -H "Content-Type: application/json" ^
  -d "@body-update-restaurant.json"
```

---

## `DELETE /restaurants/:id`

Remove restaurante.

### Parametros de rota

| Parametro | Tipo | Regras |
|-----------|------|--------|
| `id` | numero | inteiro positivo |

### Resposta `200`

Objeto do restaurante removido.

### Resposta `404`

```json
{ "message": "Restaurante nao encontrado." }
```

### cURL

```bash
curl.exe -s -X DELETE "http://localhost:3000/restaurants/1"
```

---

## Observacoes para o front

- O backend valida body, query e params com `validateRequest(...)` + Zod.
- `managerId` deve ser enviado como numero inteiro positivo e **existir** na tabela `users` (crie o usuario antes, ex.: `POST /users`). Se nao existir, o Prisma falha na FK e a API responde **500** com mensagem generica (`Erro ao criar restaurante.` / `Erro ao atualizar restaurante.`), nao 404.
- A listagem retorna `{ data, meta }`, nao um array puro.
- Erros 500 retornam mensagens genericas em portugues, sem expor detalhes internos do Prisma.
