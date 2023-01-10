# Exercício 3
Agora vamos praticar o método PUT, criando endpoints para automatizar a manipulação dos dados do arquivo database.ts.

Por enquanto não se preocupe em validar as entradas, foque no caso de sucesso (caminho feliz).

Obs: as alterações feitas nos dados mockados existirão apenas enquanto o **servidor estiver de pé**. Ao reiniciar o servidor, os dados serão os originais e **não incluírão as mudanças**.


## Edit User by id
- method HTTP (`PUT`)
- path ("`/user/:id`")
- body
    - email *(parâmetro opcional)*
    - password *(parâmetro opcional)*
- response
    - status 200
    - "Cadastro atualizado com sucesso"

## Edit Product by id
- method HTTP (`PUT`)
- path ("`/product/:id`")
- body
    - name *(parâmetro opcional)*
    - price *(parâmetro opcional)*
    - category *(parâmetro opcional)*
- response
    - status 200
    - "Produto atualizado com sucesso"

Lembre-se de referenciar o material para ordenar as rotas corretamente ;)
