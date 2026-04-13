# Documentação do backend

Esta pasta concentra a documentação dos **microsserviços** e do **API Gateway** do projeto.

## Índice

| Documento | Descrição |
|-----------|-----------|
| [api-gateway.md](./api-gateway.md) | Ponto de entrada HTTP, roteamento e reescrita de paths para os serviços. |
| [user-service.md](./user-service.md) | Usuários: modelo de dados, variáveis de ambiente, health check e API REST. |
| [restaurant-service.md](./restaurant-service.md) | Restaurantes e produtos (cardápio): modelo, integração com usuários e API REST. |
| [order-service.md](./order-service.md) | Pedidos: modelo, status, integrações e API REST. |

## Referência legada

- [schemaantigo.prisma](./schemaantigo.prisma) — modelo monolítico antigo (referência histórica); o sistema atual usa **um banco por serviço** e esquemas nos respectivos `prisma/schema.prisma`.

## Como subir o ambiente

Na pasta `backend` do repositório:

```bash
docker compose up --build
```

Portas expostas no host (padrão do `docker-compose.yml`):

| Serviço | Porta HTTP | Porta PostgreSQL (host) |
|---------|------------|-------------------------|
| api-gateway | 3000 | — |
| user-service | 3001 | 5434 |
| restaurant-service | 3002 | 5435 |
| order-service | 3003 | 5436 |

Para testar a API, prefira o **gateway** (`http://127.0.0.1:3000` ou `http://localhost:3000`), exceto quando for necessário depurar um serviço isolado na porta própria.
