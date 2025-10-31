# API Contract

Com exceção do endpoint de health check, todas as respostas seguem o padrão JSON abaixo:

```json
{
  "success": true,
  "data": {},
  "error": {
    "code": null,
    "message": null
  }
}
```

Quando `success` for `false`, o campo `data` pode conter informações adicionais (por exemplo, `data.errors` em erros de validação).

---

## POST /users/register

Cria um novo usuário.

- **Headers:** `Content-Type: application/json`
- **Body:**
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "minimo6"
  }
  ```

### Resposta de sucesso (201)
```json
{
  "success": true,
  "data": {
    "id": "usr_123",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "error": {
    "code": null,
    "message": null
  }
}
```

### Códigos de erro
| Status | Código                 | Mensagem                 | Observação |
| ------ | ---------------------- | ------------------------ | ---------- |
| 400    | VALIDATION_ERROR       | Validation failed        | `data.errors` contém os erros de validação por campo |
| 409    | CONFLICT               | Email already registered |            |
| 500    | INTERNAL_SERVER_ERROR  | Internal server error    |            |

---

## POST /auth/login

Autentica o usuário e retorna os tokens.

- **Headers:** `Content-Type: application/json`
- **Body:**
  ```json
  {
    "email": "jane@example.com",
    "password": "minimo6"
  }
  ```

### Resposta de sucesso (200)
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "usr_123",
      "name": "Jane Doe",
      "email": "jane@example.com"
    },
    "accessToken": "<jwt>",
    "refreshToken": "<token>"
  },
  "error": {
    "code": null,
    "message": null
  }
}
```

### Códigos de erro
| Status | Código                 | Mensagem              | Observação |
| ------ | ---------------------- | --------------------- | ---------- |
| 400    | VALIDATION_ERROR       | Validation failed     | `data.errors` contém os erros de validação por campo |
| 401    | UNAUTHORIZED           | Invalid credentials   |            |
| 500    | INTERNAL_SERVER_ERROR  | Internal server error |            |

---

## POST /auth/refresh

Recebe um refresh token válido e retorna um novo access token.

- **Headers:** `Content-Type: application/json`
- **Body:**
  ```json
  {
    "refreshToken": "<token>"
  }
  ```

### Resposta de sucesso (200)
```json
{
  "success": true,
  "data": {
    "accessToken": "<jwt>"
  },
  "error": {
    "code": null,
    "message": null
  }
}
```

### Códigos de erro
| Status | Código                 | Mensagem                 | Observação |
| ------ | ---------------------- | ------------------------ | ---------- |
| 400    | VALIDATION_ERROR       | Validation failed        | `data.errors` contém os erros de validação por campo |
| 401    | UNAUTHORIZED           | Invalid refresh token    |            |
| 500    | INTERNAL_SERVER_ERROR  | Internal server error    |            |

---

## GET /auth/me

Retorna os dados do usuário autenticado.

- **Headers:** `Authorization: Bearer <access token>`
- **Body:** nenhum

### Resposta de sucesso (200)
```json
{
  "success": true,
  "data": {
    "id": "usr_123",
    "name": "Jane Doe",
    "email": "jane@example.com"
  },
  "error": {
    "code": null,
    "message": null
  }
}
```

### Códigos de erro
| Status | Código                 | Mensagem              | Observação |
| ------ | ---------------------- | --------------------- | ---------- |
| 401    | UNAUTHORIZED           | Unauthorized          |            |
| 404    | NOT_FOUND              | User not found        |            |
| 500    | INTERNAL_SERVER_ERROR  | Internal server error |            |

---

## POST /items

Cria um novo item associado ao usuário autenticado.

- **Headers:**
  - `Authorization: Bearer <access token>`
  - `Content-Type: application/json`
- **Body:**
  ```json
  {
    "title": "Geladeira",
    "description": "Geladeira em bom estado",
    "lat": -23.561684,
    "lng": -46.625378
  }
  ```

### Resposta de sucesso (201)
```json
{
  "success": true,
  "data": {
    "id": "itm_123",
    "title": "Geladeira",
    "description": "Geladeira em bom estado",
    "lat": -23.561684,
    "lng": -46.625378,
    "ownerId": "usr_123",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "owner": {
      "id": "usr_123",
      "name": "Jane Doe",
      "email": "jane@example.com"
    }
  },
  "error": {
    "code": null,
    "message": null
  }
}
```

### Códigos de erro
| Status | Código                 | Mensagem              | Observação |
| ------ | ---------------------- | --------------------- | ---------- |
| 400    | VALIDATION_ERROR       | Validation failed     | `data.errors` contém os erros de validação por campo |
| 401    | UNAUTHORIZED           | Unauthorized          |            |
| 500    | INTERNAL_SERVER_ERROR  | Internal server error |            |

---

## GET /items

Lista os itens disponíveis.

- **Headers:** nenhum obrigatório
- **Body:** nenhum

### Resposta de sucesso (200)
```json
{
  "success": true,
  "data": [
    {
      "id": "itm_123",
      "title": "Geladeira",
      "description": "Geladeira em bom estado",
      "lat": -23.561684,
      "lng": -46.625378,
      "ownerId": "usr_123",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "owner": {
        "id": "usr_123",
        "name": "Jane Doe",
        "email": "jane@example.com"
      }
    }
  ],
  "error": {
    "code": null,
    "message": null
  }
}
```

### Códigos de erro
| Status | Código                 | Mensagem              | Observação |
| ------ | ---------------------- | --------------------- | ---------- |
| 500    | INTERNAL_SERVER_ERROR  | Internal server error |            |
