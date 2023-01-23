import express, { Request, Response } from 'express'
import cors from 'cors'
import { products, users, purchase } from "./database"
import { TProduct, TUsers, TPurchase, PRODUCT_CATEGORY } from './types'
import {db} from './database/knex'

console.log('Hello world!')

// console.table(users)
// console.table(products)
// console.table(purchase)

const app = express()

app.use(express.json())
app.use(cors())

app.listen(3003, () => {
    console.log("Servidor rodando na porta 3003")
})

app.get('/ping', (req: Request, res: Response) => {
    res.send('Pong!')
})

// ## Get All Users
// - method HTTP (GET)
// - path ("/users")
// - response
//     - status 200
//     - array de users do arquivo .db
app.get("/users", async (req: Request, res: Response) => {

    try {

        const result = await db.raw(`SELECT * FROM users`)
        res.status(200).send(result)

    } catch (error: any) {
        console.log(error)
        if (res.statusCode === 200) {
            res.status(500)
        }
        res.send(error.message)
    }
})

// ## Get All Products
// - method HTTP (GET)
// - path ("/products")
// - response
//     - status 200
//     - array de products do arquivo .db
app.get("/products", async (req: Request, res: Response) => {

    try {

        const results = await db.raw(`SELECT * FROM products`)
        res.status(200).send(results)

    } catch (error: any) {
        console.log(error)

        if (res.statusCode === 200) {
            res.status(500)
        }
        res.send(error.message)
    }
})

// ## Search Product by name
//- query params deve possuir pelo menos um caractere
app.get("/products/search", (req: Request, res: Response) => {

    try {
        const q = req.query.q as string
        const results = products.filter((product) => {
            return product.name.toLowerCase().includes(q.toLowerCase())
        })

        if (q.length < 1) {
            res.status(400)
            throw new Error("Query params deve possuir pelo menos um caractere")
        }

        if (results.length < 1) {
            res.status(404)
            throw new Error("Produto não encontrado.")
        }

        res.status(200).send(results)

    } catch (error: any) {
        console.log(error)

        if (res.statusCode === 200) {
            res.status(500)
        }
        res.send(error.message)
    }

})

// ## Create User
// - validar o body
// - extra:
//     - não deve ser possível criar mais de uma conta com a mesma id
//     - não deve ser possível criar mais de uma conta com o mesmo e-mail
app.post("/users", (req: Request, res: Response) => {

    try {
        const { id, email, password } = req.body

        const newUser = {
            id,
            email,
            password
        }

        if (!id || !email || !password) {
            res.status(404)
            throw new Error("Faltou escrever o Id, email ou password.")
        }

        if(id[0] !== "u"){
            res.status(400)
            throw new Error("O id deve iniciar com a letra 'u'")
        }

        if (typeof id !== "string") {
            res.status(400)
            throw new Error("O tipo da Id deve ser uma string")
        }

        if (typeof email !== "string") {
            res.status(400)
            throw new Error("O tipo do e-mail deve ser uma string")
        }

        if (typeof password !== "string") {
            res.status(400)
            throw new Error("O tipo do password é uma string")
        }

        const searchId = users.find((user) => {
            return user.id === newUser.id
        })

        const searchEmail = users.find((user) => {
            return user.email === newUser.email
        })

        if (searchId || searchEmail) {
            res.status(400)
            throw new Error("Id ou email já cadastrado.")
        }

        if (!email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)) {
            throw new Error("Parâmetro 'email' inválido")
        }

        users.push(newUser)
        res.status(201).send("Cadastro realizado com sucesso")

    } catch (error: any) {
        console.log(error)

        if (res.statusCode === 200) {
            res.status(500)
        }
        res.send(error.message)
    }
})

// ## Create Product
//- validar o body
//- extra:
//- não deve ser possível criar mais de um produto com a mesma id

app.post("/products", (req: Request, res: Response) => {

    try {
        const { id, name, price, category } = req.body

        const newProduct = {
            id,
            name,
            price,
            category
        }

        if (!id || !name || !price || !category) {
            res.status(404)
            throw new Error("Id, name, price ou category faltando.")
        }

        if (typeof id !== "string") {
            res.status(400)
            throw new Error("O tipo da id é uma string.")
        }

        if (typeof name !== "string") {
            res.status(400)
            throw new Error("o tipo do nome é uma string.")
        }

        if (typeof price !== "number") {
            res.status(400)
            throw new Error("O tipo do price é um número.")
        }

        if (newProduct.category !== PRODUCT_CATEGORY.ACCESSORIES &&
            newProduct.category !== PRODUCT_CATEGORY.CLOTHES_AND_SHOES &&
            newProduct.category !== PRODUCT_CATEGORY.ELECTRONICS) {
            res.status(400)
            throw new Error("o 'type' tem que ser: 'Acessórios', 'Roupas e calçados' ou 'Eletrônicos'.")
        }

        const searchProductById = products.find((product) => {
            return product.id === newProduct.id
        })

        if (searchProductById) {
            res.status(400)
            throw new Error("Id já está cadastrado.")
        }

        products.push(newProduct)
        res.status(201).send("Produto cadastrado com sucesso")

    } catch (error: any) {
        console.log(error)

        if (res.statusCode === 200) {
            res.status(500)
        }
        res.send(error.message)
    }
})

// ## Create Purchase
//- validar o body
//- extra:
//- id do usuário que fez a compra deve existir no array de usuários cadastrados
//- id do produto que foi comprado deve existir no array de produtos cadastrados
//- a quantidade e o total da compra devem estar com o cálculo correto
app.post("/purchases", (req: Request, res: Response) => {

    try {
        const { userId, productId, quantity } = req.body

        const newPurchase = {
            userId,
            productId,
            quantity,
            totalPrice: 0
        }

        if (!userId || !productId || !quantity) {
            res.status(400)
            throw new Error("Falta adicionar userId, productId, quantity ou totalPrice.")
        }

        if (typeof userId !== "string" &&
            typeof productId !== "string" &&
            typeof quantity !== "number") {
            res.status(400)
            throw new Error("'userId' e 'productId' são string e 'quantity' e 'totalPrice' são tipo number.")
        }

        const findPurchaseUser = users.find((user) => {
            return user.id === newPurchase.userId
        })

        const findPurchaseProduct = products.find((product) => {
            return product.id === newPurchase.productId
        })

        if (!findPurchaseUser) {
            res.status(400)
            throw new Error("Usuário não cadastro.")
        }

        if (!findPurchaseProduct) {
            res.status(400)
            throw new Error("Produto não cadastrado.")
        }


        if(findPurchaseProduct){
            const totalPrice = findPurchaseProduct.price * newPurchase.quantity
            newPurchase["totalPrice"] = totalPrice
            // const verifyPriceProduct = findPurchaseProduct.price * newPurchase.quantity === newPurchase.totalPrice
            // if(!verifyPriceProduct){
            //     res.status(400)
            //     throw new Error("O total não está correto.")
            // }
        }

        purchase.push(newPurchase)
        res.status(201).send("Compra realizado com sucesso")

    } catch (error: any) {
        console.log(error)
        if (res.statusCode === 200) {
            res.status(500)
        }
        res.send(error.message)
    }
})

// ## Get Products by id
//- validar que o produto existe
app.get("/products/:id", (req: Request, res: Response) => {

    try {
        const id = req.params.id

        if (id[0] !== "p") {
            res.status(400)
            throw new Error("Faltou iniciar a Id com 'p'")
        }

        const result = products.find((product) => {
            return product.id === id
        })

        if (!result) {
            res.status(400)
            throw new Error("Produto não cadastrado")
        }

        res.status(200).send(result)

    } catch (error: any) {
        console.log(error)
        if (res.statusCode === 200) {
            res.status(500)
        }
        res.send(error.message)
    }

})

// ## Get User Purchases by User id
//- validar que o produto existe
app.get("/users/:id/purchases", (req: Request, res: Response) => {

    try {
        const id = req.params.id

        if (id[0] !== "u") {
            res.status(400)
            throw new Error("Faltou inicar o Id do usuário com 'u'")
        }

        const userFind = users.find((user) => {
            return user.id === id
        })

        if (!userFind) {
            res.status(400)
            throw new Error("Não existe o usuário")
        }

        if (userFind) {
            const purchaseFind = purchase.filter((p) => {
                return p.userId === userFind.id
            })

            if (purchaseFind.length < 1) {
                res.status(400)
                throw new Error("Não existe compra cadastrado nesse usuário")
            }

            if (purchaseFind) {
                res.status(200).send(purchaseFind)

            }
        }

    } catch (error: any) {
        console.log(error)
        if (res.statusCode === 200) {
            res.status(500)
        }
        res.send(error.message)
    }
})

// ## Delete User by id
//- validar que o usuário existe
app.delete("/users/:id", (req: Request, res: Response) => {

    try {
        const id = req.params.id

        const userDelete = users.findIndex((user) => {
            return user.id === id
        })

        if (userDelete === -1) {
            res.status(400)
            throw new Error("Usuário não existe")
        }

        if (userDelete >= 0) {
            users.splice(userDelete, 1)
            res.status(200).send("Usuário apagado com sucesso")
        } else {
            res.status(404).send("Usuário não encontrado")
        }

    } catch (error: any) {
        console.log(error)
        if (res.statusCode === 200) {
            res.status(500)
        }
        res.send(error.message)
    }
})

// ## Delete Product by id
//- validar que o produto existe
app.delete("/products/:id", (req: Request, res: Response) => {

    try {
        const id = req.params.id

        const productDelete = products.findIndex((product) => {
            return product.id === id
        })

        if (productDelete === -1) {
            res.status(400)
            throw new Error("Produto não existe")
        }

        if (productDelete >= 0) {
            products.splice(productDelete, 1)
            res.status(200).send("Produto apagado com sucesso")
        } else {
            res.status(404).send("Produto não encontrado")
        }

    } catch (error: any) {
        console.log(error)
        if (res.statusCode === 200) {
            res.status(500)
        }
        res.send(error.message)
    }

})

// ## Edit User by id
//- validar que o usuário existe
//- validar o body
app.put("/users/:id", (req: Request, res: Response) => {

    try {
        const id = req.params.id

        if(id[0] !== "u"){
            res.status(400)
            throw new Error("O id deve inicar com 'u'")
        }

        const {email, password} = req.body

        const editUser ={
            email,
            password
        }

        const user = users.find((user) => {
            return user.id === id
        })

        if(!user){
            res.status(400)
            throw new Error("Usuário não cadastrado.")
        }

        if(typeof email !== "string" &&
        typeof password !== "string"){
            res.status(400)
            throw new Error("'email' e 'password' devem ser uma string.")
        }

        
        if (user) {
            user.email = editUser.email || user.email
            user.password = editUser.password || user.password
        }

        res.status(200).send("Cadastro atualizado com sucesso")

    } catch (error: any) {
        console.log(error)
        if (res.statusCode === 200) {
            res.status(500)
        }
        res.send(error.message)
    }
})

// ## Edit Product by id
// - validar que o produto existe
//- validar o body
app.put("/products/:id", (req: Request, res: Response) => {

    try {

        const id = req.params.id

        if (id[0] !== "p") {
            res.status(400)
            throw new Error("O id precisa iniciar com a letra 'p'")
        }

        const { name, price, category } = req.body

        const editProduct = {
            name,
            price,
            category
        }

        const product = products.find((product) => {
            return product.id === id
        })

        if (!product) {
            res.status(404)
            throw new Error("Produto não encontrado")
        }

        if (editProduct.category !== PRODUCT_CATEGORY.ACCESSORIES &&
            editProduct.category !== PRODUCT_CATEGORY.CLOTHES_AND_SHOES &&
            editProduct.category !== PRODUCT_CATEGORY.ELECTRONICS) {
            res.status(400)
            throw new Error("o 'type' tem que ser: 'Acessórios', 'Roupas e calçados' ou 'Eletrônicos'.")
        }

        if (typeof name !== "string") {
            res.status(400)
            throw new Error("O nome deve ser uma string.")
        }

        if (typeof price !== "number") {
            res.status(400)
            throw new Error("O preço deve ser um número")
        }

        if (product) {
            product.name = editProduct.name || product.name
            product.price = isNaN(editProduct.price) ? product.price : editProduct.price
            product.category = editProduct.category || product.category
        res.status(200).send("Produto atualizado com sucesso")

        }

    } catch (error: any) {
        console.log(error)
        if (res.statusCode === 200) {
            res.status(500)
        }
        res.send(error.message)
    }

})
