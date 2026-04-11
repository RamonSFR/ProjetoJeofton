# API de usuários (`/users`)

Base URL local (padrão): `http://localhost:3000` (via **api-gateway** com `docker compose` na raiz do repositório).  
O **user-service** isolado usa tipicamente a porta `3001`. Ajuste host/porta conforme `.env`.

**Headers comuns**

- `Content-Type: application/json` — obrigatório em rotas com **body** (`POST`, `PUT`).

**Erro de validação (400)**

Quando query, params ou body não passam no Zod:

```json
{
  "message": "Dados invalidos",
  "errors": {
    "campo": ["mensagem do erro"]
  },
  "formErrors": []
}
```

**Nota (Windows / PowerShell):** use `curl.exe` para não cair no alias `Invoke-WebRequest`. Para `POST`/`PUT` com JSON grande, salve o body em um arquivo `.json` e use `-d "@arquivo.json"`.

---

## `GET /users`

Lista usuários com **paginação**.

### Query string (opcional)

| Parâmetro   | Tipo    | Padrão | Regras                          |
|------------|---------|--------|----------------------------------|
| `page`     | número  | `1`    | inteiro ≥ 1                     |
| `pageSize` | número  | `20`   | inteiro entre 1 e 100 (máx. 100) |

### Resposta `200`

```json
{
  "data": [
    {
      "id": 1,
      "cpf": "12345678901",
      "name": "Nome",
      "email": "email@exemplo.com",
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

> **Nota:** o campo `password` é omitido de todas as respostas da API por segurança.

**Front:** não precisa enviar query; se omitir `page` e `pageSize`, a API aplica os padrões.

### cURL

```bash
curl.exe -s "http://localhost:3000/users"
curl.exe -s "http://localhost:3000/users?page=1&pageSize=10"
```

### Exemplo de erro de validação

```bash
curl.exe -s "http://localhost:3000/users?page=0"
```

---

## `GET /users/email`

Busca **um** usuário pelo e-mail (único no banco).

### Query string (obrigatório)

| Parâmetro | Tipo   | Regras        |
|-----------|--------|---------------|
| `email`   | string | e-mail válido |

### Resposta `200`

Objeto usuário (mesmo formato de um item em `data` acima).

### Resposta `404`

```json
{ "message": "Usuario nao encontrado." }
```

### cURL

```bash
curl.exe -s "http://localhost:3000/users/email?email=maria@exemplo.com"
```

**Front:** enviar `email` como query param (URL-encoded se necessário).

---

## `GET /users/:id`

Busca usuário por **id** numérico.

### Parâmetros de rota

| Parâmetro | Tipo   | Regras              |
|-----------|--------|---------------------|
| `id`      | número | inteiro positivo    |

### Resposta `200`

Objeto usuário.

### Resposta `404`

```json
{ "message": "Usuario nao encontrado." }
```

### cURL

```bash
curl.exe -s "http://localhost:3000/users/1"
```

---

## `POST /users`

Cria usuário.

### Body (JSON)

| Campo      | Tipo   | Obrigatório | Regras |
|------------|--------|-------------|--------|
| `cpf`      | string | sim         | após remover não-dígitos, **11 dígitos**; pode enviar formatado (`000.000.000-00`) |
| `name`     | string | sim         | mínimo **2** caracteres (após trim) |
| `email`    | string | sim         | e-mail válido |
| `password` | string | sim         | mínimo **8** caracteres |

### Resposta `201`

Objeto usuário criado (inclui `id`, datas; `password` é omitido).

### cURL

Arquivo `body-create-user.json`:

```json
{
  "cpf": "12345678901",
  "name": "Maria Teste",
  "email": "maria.teste@exemplo.com",
  "password": "senha123456"
}
```

```bash
curl.exe -s -X POST "http://localhost:3000/users" ^
  -H "Content-Type: application/json" ^
  -d "@body-create-user.json"
```

(Linux/macOS: use `\` em vez de `^` para quebra de linha, ou uma linha só.)

---

## `PUT /users/:id`

Atualiza usuário. **Pelo menos um** campo no body.

### Parâmetros de rota

| Parâmetro | Tipo   | Regras           |
|-----------|--------|------------------|
| `id`      | número | inteiro positivo |

### Body (JSON)

Todos opcionais, mas **não** pode ser `{}`. Mesmas regras de `POST` para cada campo enviado (`cpf`, `name`, `email`, `password`).

### Resposta `200`

Objeto usuário atualizado.

### cURL

`body-update-user.json` (exemplo só nome):

```json
{
  "name": "Maria Atualizada"
}
```

```bash
curl.exe -s -X PUT "http://localhost:3000/users/1" ^
  -H "Content-Type: application/json" ^
  -d "@body-update-user.json"
```

---

## `DELETE /users/:id`

Remove usuário.

### Parâmetros de rota

| Parâmetro | Tipo   | Regras           |
|-----------|--------|------------------|
| `id`      | número | inteiro positivo |

### Resposta `200`

Objeto do usuário removido (último estado antes do delete).

### cURL

```bash
curl.exe -s -X DELETE "http://localhost:3000/users/1"
```

---

## Ordem das rotas (relevante para o front)

A rota **`/users/email`** é mais específica que **`/users/:id`**. O front deve usar:

- listagem: `GET /users?...`
- por e-mail: `GET /users/email?email=...`
- por id: `GET /users/:id`

Nunca confundir `GET /users/email` com `GET /users/email` onde `email` seria interpretado como `:id` — na API atual, `/users/email` está registrada antes de `/users/:id`, então funciona como rota fixa.

---

## Segurança e front

- O campo **`password`** é **omitido** de todas as respostas (listagem, busca por id/email, criação, atualização e remoção). A senha é armazenada como hash bcrypt no banco, mas nunca é exposta na API.
- Não há autenticação JWT/cookie documentada nestas rotas; se forem protegidas no futuro, incluir header `Authorization` na documentação.
