# 🔌 API REST - EP Viagens

Base URL: `http://127.0.0.1:8000/api/`

## 🔐 Autenticação

### 1. Login
**Endpoint:** `POST /auth/login/`

**Body (JSON):**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response (200):**
```json
{
  "token": "seu_token_aqui_muito_longo",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@epviagens.com",
    "first_name": "",
    "last_name": ""
  }
}
```

### 2. Logout
**Endpoint:** `POST /auth/logout/`

**Headers:**
```
Authorization: Token seu_token_aqui_muito_longo
```

**Response (200):**
```json
{
  "message": "Logout realizado com sucesso"
}
```

---

## 📍 Destinos

### Listar Destinos
**Endpoint:** `GET /destinos/`

**Headers:**
```
Authorization: Token seu_token_aqui_muito_longo
```

### Criar Destino
**Endpoint:** `POST /destinos/`

**Headers:**
```
Authorization: Token seu_token_aqui_muito_longo
Content-Type: application/json
```

**Body:**
```json
{
  "cidade": "Rio de Janeiro",
  "estado": "RJ",
  "pais": "Brasil"
}
```

### Atualizar Destino
**Endpoint:** `PUT /destinos/{id}/`

**Headers:**
```
Authorization: Token seu_token_aqui_muito_longo
Content-Type: application/json
```

**Body:**
```json
{
  "cidade": "Rio de Janeiro",
  "estado": "RJ",
  "pais": "Brasil"
}
```

### Deletar Destino
**Endpoint:** `DELETE /destinos/{id}/`

**Headers:**
```
Authorization: Token seu_token_aqui_muito_longo
```

**Response (204):** Sem conteúdo (sucesso)

---

## 🏨 Hospedagens

### Listar Hospedagens
**Endpoint:** `GET /hospedagens/`

### Criar Hospedagem
**Endpoint:** `POST /hospedagens/`

**Headers:**
```
Authorization: Token seu_token_aqui_muito_longo
Content-Type: application/json
```

**Body:**
```json
{
  "nome": "Hotel Copacabana Palace",
  "endereco": "Avenida Atlântica, 1702",
  "cidade": "Rio de Janeiro",
  "estado": "RJ",
  "pais": "Brasil",
  "telefone": "(21) 2548-7070",
  "email": "reservas@copacabanapalace.com.br"
}
```

### Atualizar Hospedagem
**Endpoint:** `PUT /hospedagens/{id}/`

### Deletar Hospedagem
**Endpoint:** `DELETE /hospedagens/{id}/`

**Headers:**
```
Authorization: Token seu_token_aqui_muito_longo
```

**Response (204):** Sem conteúdo (sucesso)

---

## 🚌 Transportes

### Listar Transportes
**Endpoint:** `GET /transportes/`

### Criar Transporte
**Endpoint:** `POST /transportes/`

**Headers:**
```
Authorization: Token seu_token_aqui_muito_longo
Content-Type: application/json
```

**Body:**
```json
{
  "tipo": "Avião",
  "empresa": "TAP Air Portugal",
  "descricao": "Voo direto Lisboa-Rio"
}
```

### Atualizar Transporte
**Endpoint:** `PUT /transportes/{id}/`

### Deletar Transporte
**Endpoint:** `DELETE /transportes/{id}/`

**Headers:**
```
Authorization: Token seu_token_aqui_muito_longo
```

**Response (204):** Sem conteúdo (sucesso)

---

## 👥 Viajantes

### Listar Viajantes
**Endpoint:** `GET /viajantes/`

### Criar Viajante
**Endpoint:** `POST /viajantes/`

**Headers:**
```
Authorization: Token seu_token_aqui_muito_longo
Content-Type: application/json
```

**Body:**
```json
{
  "nome_completo": "João Silva Santos",
  "cpf": "123.456.789-10",
  "data_nascimento": "1990-05-15",
  "celular": "(11) 98765-4321",
  "email": "joao@email.com",
  "contato_emergencia_nome": "Maria Silva",
  "contato_emergencia_telefone": "(11) 99999-8888",
  "observacoes_medicas": "Alérgico a frutos do mar"
}
```

### Atualizar Viajante
**Endpoint:** `PUT /viajantes/{id}/`

### Deletar Viajante
**Endpoint:** `DELETE /viajantes/{id}/`

**Headers:**
```
Authorization: Token seu_token_aqui_muito_longo
```

**Response (204):** Sem conteúdo (sucesso)

---

## ✈️ Viagens

### Listar Viagens
**Endpoint:** `GET /viagens/`

### Criar Viagem
**Endpoint:** `POST /viagens/`

**Headers:**
```
Authorization: Token seu_token_aqui_muito_longo
Content-Type: application/json
```

**Body:**
```json
{
  "titulo": "Viagem Rio de Janeiro - Carnaval 2026",
  "destino_id": 1,
  "hospedagem_id": 1,
  "transporte_id": 1,
  "data_inicio": "2026-02-27",
  "data_fim": "2026-03-07",
  "status": "planejada",
  "observacoes": "Pacote com entrada no desfile"
}
```

### Atualizar Viagem
**Endpoint:** `PUT /viagens/{id}/`

### Deletar Viagem
**Endpoint:** `DELETE /viagens/{id}/`

**Headers:**
```
Authorization: Token seu_token_aqui_muito_longo
```

**Response (204):** Sem conteúdo (sucesso)

### Adicionar Viajante a Viagem
**Endpoint:** `POST /viagens/{id}/adicionar_viajante/`

**Body:**
```json
{
  "viajante_id": 1,
  "status_pagamento": "pendente",
  "valor_total": 5000.00
}
```

### Listar Viajantes de uma Viagem
**Endpoint:** `GET /viagens/{id}/viajantes/`

---

## 💳 Viagem-Viajante (Registro de Pagamento)

### Listar Registros
**Endpoint:** `GET /viagem-viajantes/`

### Atualizar Pagamento
**Endpoint:** `PUT /viagem-viajantes/{id}/`

**Headers:**
```
Authorization: Token seu_token_aqui_muito_longo
Content-Type: application/json
```

**Body:**
```json
{
  "status_pagamento": "pago",
  "valor_pago": 5000.00
}
```

### Deletar Registro Viagem-Viajante
**Endpoint:** `DELETE /viagem-viajantes/{id}/`

**Headers:**
```
Authorization: Token seu_token_aqui_muito_longo
```

**Response (204):** Sem conteúdo (sucesso)

---

## 🧪 Testando no Insomnia

1. **Crie uma nova requisição**
2. **Faça login primeiro e copie o token**
3. **Nas próximas requisições, adicione o header:**
   ```
   Authorization: Token seu_token_aqui
   ```
4. **Teste os endpoints acima**

---

## 🔑 Credenciais Padrão

- **Username:** `admin`
- **Password:** `admin123`

> ⚠️ Mude a senha após o primeiro login!

---

## 📝 Status de Pagamento

- `pendente`
- `parcial`
- `pago`
- `reembolsado`

## 📝 Status de Viagem

- `planejada`
- `confirmada`
- `em_andamento`
- `concluída`
- `cancelada`
