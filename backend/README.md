# Backend do projeto

Este diretorio concentra todo o backend da aplicacao:

- `user-service` — usuarios e banco `db_users`
- `restaurant-service` — restaurantes/produtos e banco `db_restaurants`
- `api-gateway` — porta **3000**, expoe `/users`, `/restaurants` e `/test`

## Subir os microservicos (recomendado)

No proprio diretorio `backend/`:

```bash
docker compose up --build
```

Endpoints publicos:

- `http://localhost:3000/test`
- `http://localhost:3000/users`
- `http://localhost:3000/restaurants`

## Executar sem Docker

Em tres terminais, na ordem:

1. `cd user-service && cp .env.example .env`, ajustar `DATABASE_URL`, depois `npx prisma migrate dev` e `npm run dev`
2. `cd restaurant-service && cp .env.example .env`, ajustar `DATABASE_URL` e `USER_SERVICE_URL`, depois `npx prisma migrate dev` e `npm run dev`
3. `cd api-gateway && cp .env.example .env`, depois `npm run dev`

## Monolito legado (referencia)

O codigo legado do monolito Express + Prisma segue no mesmo diretorio para referencia/comparacao.
Se precisar subir apenas o Postgres antigo (porta **5433**), use:

```bash
docker compose -f docker-compose.monolith.yml up
```
