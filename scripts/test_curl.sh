#!/usr/bin/env bash
set -euo pipefail

HOST="${1:-http://localhost:8888}"

echo "== Register =="
curl -s -X POST "$HOST/register" -H 'Content-Type: application/json'   -d '{"email":"a@a.com","password":"secret123"}' | jq . || true

echo "== Login =="
TOKEN=$(curl -s -X POST "$HOST/login" -H 'Content-Type: application/json'   -d '{"email":"a@a.com","password":"secret123"}' | jq -r .access_token)
echo "TOKEN=$TOKEN"

echo "== Create Todo =="
curl -s -X POST "$HOST/todos" -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json'   -d '{"message":"Buy milk","date":"2025-10-01"}' | jq .

echo "== List Todos =="
curl -s "$HOST/todos" -H "Authorization: Bearer $TOKEN" | jq .
