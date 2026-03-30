# Restaurant Endpoints

## Visão Geral
API de gerenciamento de restaurantes com CRUD completo e validação por Zod + middleware alidateRequest.

Base URL: /restaurants

---

## 1) Criar restaurante

- Método: POST
- URL: /restaurants
- Validação: createRestaurantSchema (body)

### Corpo (JSON) de exemplo
`json
{
   name: Pizzaria do Bairro,
  managerId: 5
}
`

### Campos
- 
ame (string, obrigatório, mínimo 2 caracteres)
- managerId (número inteiro positivo, obrigatório)

### Respostas
- 201 Created : objeto restaurante criado
- 409 Conflict: Unique field already exists (duplicidade de campo único no Prisma)
- 400 Bad Request: falha de validação Zod
- 500 Internal Server Error : erro inesperado

---

## 2) Listar restaurantes

- Método: GET
- URL: /restaurants
- Validação: getRestaurantsQuerySchema (query)

### Query params
- page (número inteiro, >= 1, padrão 1)
- pageSize (número inteiro, 1 <= valor <= 100, padrão 20)

### Exemplo
GET /restaurants?page=1&pageSize=20

### Respostas
- 200 OK : array de restaurantes
- 400 Bad Request : falha de validação Zod
- 500 Internal Server Error : erro inesperado

---

## 3) Obter restaurante por ID

- Método: GET
- URL: /restaurants/:id
- Validação: estaurantIdParamSchema (params)

### Parâmetros de rota
- id (número inteiro positivo)

### Exemplo
GET /restaurants/3

### Respostas
- 200 OK : objeto restaurante
- 404 Not Found: restaurante não encontrado
- 400 Bad Request: ID inválido
- 500 Internal Server Error : erro inesperado

---

## 4) Atualizar restaurante

- Método: PUT
- URL: /restaurants/:id
- Validação:
  - estaurantIdParamSchema (params)
  - updateRestaurantSchema (body)

### Parâmetros de rota
- id (número inteiro positivo)

### Corpo (JSON) de exemplo
`json
{
  name: Pizzaria do Bairro - Renovada,
  managerId: 7
}
`

### Campos
- 
ame (string, mínimo 2, opcional)
- managerId (número inteiro positivo, opcional)
- Deve conter ao menos um campo (refine Zod)

### Respostas
- 200 OK : objeto restaurante atualizado
- 404 Not Found: não existe restaurante com ID informado
- 409 Conflict: campo único duplicado
- 400 Bad Request: falha de validação Zod
- 500 Internal Server Error : erro inesperado

---

## 5) Excluir restaurante

- Método: DELETE
- URL: /restaurants/:id
- Validação: estaurantIdParamSchema (params)

### Parâmetros de rota
- id (número inteiro positivo)

### Exemplo
DELETE /restaurants/3

### Respostas
- 204 No Content: exclusão realizada
- 404 Not Found: restaurante não encontrado
- 400 Bad Request: ID inválido
- 500 Internal Server Error: erro inesperado

---

## Observações de validação
- alidateRequest(schema, source) converte e valida dados via Zod
- Erros de validação retornam 400 com detalhes das mensagens de cada campo
- createRestaurantSchema, updateRestaurantSchema, estaurantIdParamSchema, getRestaurantsQuerySchema estão em src/validation/restaurant-validation.ts

