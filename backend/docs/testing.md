# Testes automatizados (backend)

Este documento descreve **como rodar** os testes, **o que está coberto** e **como repetir manualmente** os cenários principais.

## Visão geral

| Serviço | Tipo | Ferramenta | Comando |
|---------|------|------------|---------|
| `order-service` | Unitário + integração HTTP (Prisma mockado) | Jest + ts-jest + supertest | `npm test` dentro de `backend/order-service` |
| `user-service` | Unitário (schemas Zod) | Jest + ts-jest | `npm test` dentro de `backend/user-service` |
| `restaurant-service` | Unitário (schemas Zod) | Jest + ts-jest | `npm test` dentro de `backend/restaurant-service` |
| `api-gateway` | *(sem suíte Jest neste repositório)* | — | Validar com E2E manual (curl/Postman) na porta 3000 |

**Princípio:** testes unitários rodam **sem Docker** e **sem banco de dados**. O arquivo `app.integration.test.ts` do `order-service` usa **supertest** contra o Express com **Prisma mockado** (não é integração com Postgres real).

---

## Pré-requisitos

- Node.js compatível com o projeto (ex.: 22, como nas imagens Docker).
- Dependências instaladas em cada serviço onde for rodar testes:

```bash
cd backend/order-service
npm install

cd ../user-service
npm install

cd ../restaurant-service
npm install
```

---

## Como rodar os testes (automático)

### Um serviço por vez

```bash
cd backend/order-service
npm test
```

```bash
cd backend/user-service
npm test
```

```bash
cd backend/restaurant-service
npm test
```

### Modo watch (reexecuta ao salvar)

```bash
npm run test:watch
```

### Cobertura (opcional)

```bash
npm run test:coverage
```

---

## O que cada suíte cobre

### `order-service`

| Arquivo | Conteúdo |
|---------|-----------|
| `src/domain/order-status.test.ts` | Transições permitidas e proibidas entre `OrderStatus`. |
| `src/validation/order-validation.test.ts` | Regras Zod de criação de pedido, listagem e `PATCH` de status. |
| `src/app.integration.test.ts` | HTTP: `GET /test`, `GET /orders` (lista vazia com mock), `GET /orders/:id` 404, `PATCH .../status` 200 e 409. |

### `user-service`

| Arquivo | Conteúdo |
|---------|-----------|
| `src/validation/user-validation.test.ts` | CPF normalizado, senha mínima, paginação, update parcial. |

### `restaurant-service`

| Arquivo | Conteúdo |
|---------|-----------|
| `src/validation/restaurant-validation.test.ts` | Nome, `managerId`, update mínimo, query de listagem. |
| `src/validation/product-validation.test.ts` | Preço positivo, update mínimo, query `ids` em lista. |

---

## Como testar manualmente (sem Jest)

### 1) Testes automáticos (você só dispara o comando)

Siga a seção **Como rodar os testes**. Isso já valida regras de domínio, Zod e parte do pipeline HTTP do `order-service` com mock.

### 2) Smoke com Docker (integração “de verdade” com banco e serviços)

Na pasta `backend`:

```bash
docker compose up --build -d
```

Depois, no **gateway** (`http://127.0.0.1:3000`):

- `GET /test` → `{"status":"ok"}`
- `GET /users/1` → 200
- `GET /restaurants/1/products?page=1&pageSize=5` → 200
- `POST /orders` com JSON válido (usuário, restaurante e produto existentes) → 201

No PowerShell, use `curl.exe` e corpo JSON em arquivo UTF-8 (ver `README.md` da pasta `docs` e documentação de cada serviço).

### 3) Repetir um caso específico de transição de status

1. Crie um pedido `POST /orders` (status `PENDING`).
2. `PATCH /orders/{id}/status` com `{ "status": "CONFIRMED" }` → 200.
3. Tente `{ "status": "DELIVERED" }` a partir de `PENDING` → **409** (regra de negócio).

Isso valida o mesmo contrato exercitado em `order-status.test.ts`, mas contra o sistema completo.

---

## Evolução recomendada (fora do escopo atual)

- **Integração com Postgres real** para cada serviço (`DATABASE_URL` de teste + `prisma migrate deploy` antes da suíte).
- **E2E** do stack com **supertest** no gateway ou Playwright/Newman.
- **CI** (GitHub Actions) executando `npm test` em cada pasta `backend/*-service`.

---

## Arquivos de configuração

- `jest.config.cjs` — em cada serviço com testes.
- `tsconfig.json` — `**/*.test.ts` excluído do `tsc` de produção para não ir para `dist/`.
