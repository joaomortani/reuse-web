#!/bin/bash
# Defina a URL base do backend
API_URL="http://localhost:3000"

# Dados do usuário de teste (e-mail único via timestamp)
USER_NAME="Usuário Teste"
USER_EMAIL="user$(date +%s)@example.com"
USER_PASSWORD="senha123"

echo "==> Registrando usuário..."
register_response=$(curl -s -X POST "$API_URL/users/register" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"$USER_NAME\",\"email\":\"$USER_EMAIL\",\"password\":\"$USER_PASSWORD\"}")
echo "Resposta registro: $register_response"

echo "==> Fazendo login..."
login_response=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$USER_EMAIL\",\"password\":\"$USER_PASSWORD\"}")
echo "Resposta login: $login_response"

# Extrai accessToken e refreshToken do JSON (sem jq)
access_token=$(echo "$login_response" | sed -n 's/.*"accessToken":"\([^"]*\)".*/\1/p')
refresh_token=$(echo "$login_response" | sed -n 's/.*"refreshToken":"\([^"]*\)".*/\1/p')
echo "AccessToken: $access_token"
echo "RefreshToken: $refresh_token"

echo "==> Criando item..."
create_item_response=$(curl -s -X POST "$API_URL/items" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $access_token" \
  -d '{"title":"Mesa de madeira","description":"Mesa em bom estado","lat":-22.9068,"lng":-43.1729,"category":"Furniture","condition":"USED","images":["https://example.com/mesa.jpg"]}')
echo "Resposta criar item: $create_item_response"

echo "==> Listando itens do usuário..."
mine_response=$(curl -s "$API_URL/items/mine" \
  -H "Authorization: Bearer $access_token")
echo "Meus itens: $mine_response"

echo "==> Listando itens públicos (página 1, 10 por página)..."
list_response=$(curl -s "$API_URL/items?page=1&limit=10")
echo "Itens públicos: $list_response"

echo "==> Buscando itens próximos (raio de 2 km)..."
nearby_response=$(curl -s "$API_URL/items/nearby?lat=-22.9068&lng=-43.1729&radius=2")
echo "Itens próximos: $nearby_response"

echo "==> Listando Top itens..."
top_response=$(curl -s "$API_URL/items/top")
echo "Top itens: $top_response"

echo "==> Renovando access token via refresh..."
refresh_response=$(curl -s -X POST "$API_URL/auth/refresh" \
  -H "Content-Type: application/json" \
  -d "{\"refreshToken\":\"$refresh_token\"}")
echo "Resposta refresh: $refresh_response"
new_access_token=$(echo "$refresh_response" | sed -n 's/.*"accessToken":"\([^"]*\)".*/\1/p')
echo "Novo AccessToken: $new_access_token"

echo "==> Fazendo logout (revogando refresh token)..."
logout_response=$(curl -s -X POST "$API_URL/auth/logout" \
  -H "Content-Type: application/json" \
  -d "{\"refreshToken\":\"$refresh_token\"}")
echo "Resposta logout: $logout_response"