# Projeto Tópicos Avançados em TI

## Sobre o projeto

Este projeto está sendo desenvolvido para a disciplina de "Tópicos Avançados em TI" ministrada pelo professor "Jeofton", UNIPÊ, 2026.1

A proposta é permitir que clientes façam pedidos em restaurantes de forma prática, enquanto os gestores administram seus restaurantes e produtos cadastrados na plataforma.

## Para que serve

A aplicação serve para:

- cadastrar usuários com perfis de **gestor** e **cliente**;
- cadastrar restaurantes vinculados aos gestores;
- cadastrar produtos de cada restaurante;
- criar pedidos de clientes;
- controlar itens do pedido e status de entrega.

## Integrantes do grupo

- Ramon Sávio
- Adijair Araújo
- Rafael
- Iago Veras de Melo

## Modelo das entidades

```sql
users (
	id PRIMARY KEY,
	CPF VARCHAR,
	ENDERECO VARCHAR,
	nome VARCHAR NOT NULL,
	email VARCHAR UNIQUE NOT NULL,
	password VARCHAR NOT NULL,
	role ENUM('gestor', 'cliente') NOT NULL
)

restaurantes (
	id PRIMARY KEY,
	nome VARCHAR NOT NULL,
	gestor_id INTEGER REFERENCES users(id)
)

produtos (
	id PRIMARY KEY,
	restaurante_id INTEGER REFERENCES restaurantes(id),
	nome VARCHAR NOT NULL,
	preco DECIMAL(10,2) NOT NULL
)

pedidos (
	id PRIMARY KEY,
	restaurante_id INTEGER REFERENCES restaurantes(id),
	cliente_id INTEGER REFERENCES users(id),
	total INTEGER,
	status ENUM(
		'PENDENTE',
		'CONFIRMADO',
		'EM_PREPARO',
		'SAIU_PARA_ENTREGA',
		'ENTREGUE',
		'CANCELADO'
	)
)

pedido_itens (
	id PRIMARY KEY,
	pedido_id INTEGER REFERENCES pedidos(id),
	produto_id INTEGER REFERENCES produtos(id),
	quantidade INTEGER NOT NULL,
	preco_unitario DECIMAL(10,2) NOT NULL,
	subtotal DECIMAL(10,2) NOT NULL
)
```
## Bounded context do sistema:

### Contexto de Identidade e Acesso (Identity & Access)
 linguagem ubíqua: Role, autentificação, autorização, endereço 
 Entidades chave: Users
 Responsabilidades: Autenticação, troca de senha, definição de permissões globais.

### Contexto de Catálogo e Cardápio (Menu Management)
 linguagem ubíqua: nome do restaurante, produtos, preço, gestor 
 Entidades: Restaurante, Produto (Menu Item).
 Responsabilidades: Cadastro de pratos, alteração de preços, disponibilidade de estoque, gestão das informações do estabelecimento.

### Contexto de Vendas e Pedidos (Ordering)
 linguagem ubíqua: status, restaurante, tempo, valor total
 Entidades: Pedido (Order), Item do Pedido (OrderItem), Cliente (Customer Snapshot).
 Responsabilidades: Cálculo do total, fluxo de status do pedido (PENDENTE -> ENTREGUE), registro do endereço de entrega no momento da compra.

## API em microservicos (recomendado)

Agora os servicos ficam dentro de `backend/`.

1. Instale [Docker Desktop](https://www.docker.com/products/docker-desktop/) e deixe-o em execucao.
2. Rode:

```bash
cd backend
docker compose up --build
```

- **Gateway:** [http://localhost:3000](http://localhost:3000) — mesmos endpoints que antes (`GET /test`, `/users`, `/restaurants`).
- **Bancos:** PostgreSQL em `localhost:5434` (`db_users`) e `localhost:5435` (`db_restaurants`).

Desenvolvimento **sem** Docker: em tres terminais, com dois Postgres (ou as portas dos `.env.example` de cada servico), na ordem:

1. `cd backend/user-service && cp .env.example .env` (ajuste `DATABASE_URL`), `npx prisma migrate dev`, `npm run dev`
2. `cd backend/restaurant-service && cp .env.example .env` (ajuste `DATABASE_URL` e `USER_SERVICE_URL`), `npx prisma migrate dev`, `npm run dev`
3. `cd backend/api-gateway && cp .env.example .env`, `npm run dev`

Detalhes adicionais: [backend/README.md](backend/README.md).

## Estrutura de pastas(Cean architecture)
Exemplo:

<img width="685" height="582" alt="Captura de Tela (59)" src="https://github.com/user-attachments/assets/086c922f-f492-4405-bb75-d44dc672df4c" />
