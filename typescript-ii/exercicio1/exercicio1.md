# Exercício 1
Hoje vimos alguns usos mais complexos do type e também como declarar enum.<br>
Vamos refatorar nosso type de product para utilizar enum na propriedade category.

## Refatore o type da entidade product no types.ts
- lembre-se de referenciar o material assíncrono
- utilize um enum para definir pelo menos 3 categorias (você pode escolher, mas deixamos alguns exemplos abaixo)
    - ACCESSORIES = "Acessórios",
    - CLOTHES_AND_SHOES = "Roupas e calçados",
    - ELECTRONICS = "Eletrônicos"

## Refatore o mock de products no database.ts
- com a mudança acima no type, o array de products no database.ts começará a dar erro
- corrija atribuindo o valor do enum à propriedade category dos objetos
