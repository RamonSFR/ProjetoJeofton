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
- Iago

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
