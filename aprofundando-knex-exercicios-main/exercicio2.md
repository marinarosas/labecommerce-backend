# Exercício 2
Crie o seguinte endpoint com query builder:

## Get Purchase by id
- method HTTP (GET)
- path ("/purchases/:id")
- response
  - status 200
  - um objeto contendo:
    - id da compra
    - valor total da compra
    - quando foi criada
    - status do pagamento
    - id de quem fez a compra
    - email de quem fez a compra
    - nome de quem fez a compra

## Exemplo de saída (output)
```typescript
// GET /purchases/:id sendo id = "pur001"
// status 200 OK
{
  purchaseId: "pur001",
  totalPrice: 1321.25,
  createdAt: "2023-01-20 16:15:22",
  isPaid: false,
  buyerId: "u002",
  email: "fulana@email.com",
  name: "Fulana"
}
```
