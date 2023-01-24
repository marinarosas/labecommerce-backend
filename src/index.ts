import express, { Request, Response } from 'express'
import cors from 'cors'
import { products, users, purchase } from "./database"
// import { TProduct, TUsers, TPurchase, PRODUCT_CATEGORY } from './types'
import { db } from './database/knex'

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
// - method HTTP (GET)
// - path ("/product/search")
// - query params
//     - q
// - response
//     - status 200
//     - array do resultado da busca no arquivo .db
app.get("/products/search", async (req: Request, res: Response) => {

    try {
        const q = req.query.q as string
        const results = await db.raw(`SELECT * FROM products
        WHERE name LIKE '${q}';`)

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
// - method HTTP (POST)
// - path ("/users")
// - body
//     - id
//     - name
//     - email
//     - password
//     - createdAt
// - response
//     - status 201
//     - "Cadastro realizado com sucesso"
app.post("/users", async (req: Request, res: Response) => {

    try {
        const { id, name, email, password } = req.body

        const newUser = {
            id,
            name,
            email,
            password
        }

        if (!id || !name || !email || !password) {
            res.status(404)
            throw new Error("Faltou escrever o Id, name, email ou password.")
        }

        if (id[0] !== "u") {
            res.status(400)
            throw new Error("O id deve iniciar com a letra 'u'")
        }

        if (typeof id !== "string") {
            res.status(400)
            throw new Error("O tipo da Id deve ser uma string")
        }

        if (typeof name !== "string") {
            res.status(400)
            throw new Error("O tipo da name deve ser uma string")
        }

        if (typeof email !== "string") {
            res.status(400)
            throw new Error("O tipo do e-mail deve ser uma string")
        }

        if (typeof password !== "string") {
            res.status(400)
            throw new Error("O tipo do password é uma string")
        }

        const [searchIdUser] = await db.raw(
            `SELECT * FROM users
            WHERE id = "${newUser.id}"`
        )

        const [searchEmail] = await db.raw(
            `SELECT * FROM users
            WHERE email = ${newUser.email}`
        )

        if (!email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)) {
            throw new Error("Parâmetro 'email' inválido")
        }

        if (!searchIdUser || !searchEmail) {
            await db.raw(`INSERT INTO users (id, name, email, password)
            VALUES
            ('${newUser.id}', '${newUser.name}', '${newUser.email}', '${newUser.password}')`)

            users.push(newUser)
            res.status(201).send("Cadastro realizado com sucesso")
        } else {
            res.status(400)
            throw new Error("Id ou email já cadastrado.")
        }

    } catch (error: any) {
        console.log(error)

        if (res.statusCode === 200) {
            res.status(500)
        }
        res.send(error.message)
    }
})

// ## Create Product
// - method HTTP (POST)
// - path ("/products")
// - body
//     - id
//     - name
//     - price
//     - description
//     - imageUrl
// - response
//     - status 201
//     - "Produto cadastrado com sucesso"

app.post("/products", async (req: Request, res: Response) => {

    try {
        const { id, name, price, description, image_url } = req.body

        const newProduct = {
            id,
            name,
            price,
            description,
            image_url
        }

        if (!id || !name || !price || !description || !image_url) {
            res.status(404)
            throw new Error("Id, name, price, description ou image_url faltando.")
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

        if (typeof description !== "string") {
            res.status(400)
            throw new Error("O tipo da descrição é uma string.")
        }

        if (typeof image_url !== "string") {
            res.status(400)
            throw new Error("O tipo do endereço (url) da imagem é uma string.")
        }

        // const searchProductById = products.find((product) => {
        //     return product.id === newProduct.id
        // })


        const [searchProductById] = await db.raw(`
            SELECT * FROM products
            WHERE id= "${id}"
        `)
        if (!searchProductById) {
            await db.raw(`INSERT INTO products (id, name, price, description, image_url)
            VALUES ('${newProduct.id}', '${newProduct.name}', ${newProduct.price}, ${newProduct.description}, '${newProduct.image_url}'`)
        } else {
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
// - method HTTP (POST)
// - path ("/purchases")
// - body
//     - id
//     - buyer
//     - totalPrice
//     - createdAt
//     - paid

// - response
//     - status 201
//     - "Compra cadastrada com sucesso"
app.post("/purchases", async (req: Request, res: Response) => {

    try {
        const { id, buyer, total_price } = req.body

        const newPurchase = {
            id,
            buyer,
            total_price
        }

        if (!id || !buyer || !total_price) {
            res.status(400)
            throw new Error("Falta adicionar id, buyer ou total_price.")
        }

        if (typeof id !== "string" &&
            typeof buyer !== "string" &&
            typeof total_price !== "number") {
            res.status(400)
            throw new Error("'userId' e 'productId' são string e 'total_price' são tipo number.")
        }

        const [findPurchase] = await db.raw(`
            SELECT * FROM purchases
            WHERE id = "${newPurchase.id}"
        `)

        if (findPurchase) {
            await db.raw(`
            INSERT INTO purchases(id, buyer, total_price)
            VALUES ('${newPurchase.id}', '${newPurchase.buyer}', ${newPurchase.total_price}`)
        } else {
            res.status(400)
            throw new Error("Compra não realizada.")
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
// - method HTTP (GET)
// - path ("/products/:id")
// - response
//     - status 200
//     - objeto encontrado do arquivo .db
app.get("/products/:id", async (req: Request, res: Response) => {

    try {
        const id = req.params.id

        if (id[0] !== "p") {
            res.status(400)
            throw new Error("Faltou iniciar a Id com 'p'")
        }

        const result = await db.raw(`
            SELECT * FROM products
            WHERE id = '${id}'
        `)

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
// - method HTTP (GET)
// - path ("/users/:id/purchases")
// - response
//     - status 200
//     - array de compras do user no arquivo .db
app.get("/users/:id/purchases", async (req: Request, res: Response) => {

    try {
        const id = req.params.id

        if (id[0] !== "u") {
            res.status(400)
            throw new Error("Faltou inicar o Id do usuário com 'u'")
        }

        const [userFind] = await db.raw(`
            SELECT * FROM users
            WHERE id = '${id}'
        `)

        if (!userFind) {
            res.status(400)
            throw new Error("Não existe o usuário")
        }

        if (userFind) {
    
            const purchaseFind = await db.raw(`
            SELECT * FROM purchases_products
            WHERE buyer = "${id}"
            `)

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
app.delete("/users/:id", async (req: Request, res: Response) => {

    try {
        const id = req.params.id

        // const userDelete = users.findIndex((user) => {
        //     return user.id === id
        // })

        const [userExist] = await db.raw(`
            SELECT * FROM user
            WHERE id= "${id}"
        `)

        if (userExist) {
            await db.raw(`
            DELETE FROM users
            WHERE id = '${id}'
            `)
            
            res.status(200).send("Usuário apagado com sucesso")

        } else {
            res.status(400)
            throw new Error("Usuário não existe")
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
app.delete("/products/:id", async (req: Request, res: Response) => {

    try {
        const id = req.params.id

        const productDelete = await db.raw(`
            SELECT FROM products
            WHERE id = '${id}'
        `)

        if (productDelete){
            await db.raw(`
            DELETE FROM products
            WHERE id = '${id}'
            `)
            res.status(200).send("Produto apagado com sucesso")
            
        } else {
            res.status(400)
            throw new Error("Produto não existe")
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
app.put("/users/:id", async (req: Request, res: Response) => {

    try {
        const id = req.params.id

        if (id[0] !== "u") {
            res.status(400)
            throw new Error("O id deve inicar com 'u'")
        }

        const { name, email, password } = req.body

        const editUser = {
            name, 
            email,
            password
        }

        // const user = users.find((user) => {
        //     return user.id === id
        // })

        const [user] = await db.raw(`
            SELECT * FROM users
            WHERE id = "${id}"
        `)

        if (typeof name !== "string" &&
            typeof email !== "string" &&
            typeof password !== "string") {
            res.status(400)
            throw new Error("'email' e 'password' devem ser uma string.")
        }

        if (user) {
            await db.raw(`
            UPDATE users
            SET 
                name =  "${editUser.name || user.name}",
                email = "${editUser.email || user.email}",
                password = "${editUser.password || user.password}"
            WHERE id = "${id}"
            `)
            
        }else{
            res.status(400)
            throw new Error("Usuário não cadastrado.")
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

        const { name, price, } = req.body

        const editProduct = {
            name,
            price
        }

        const product = products.find((product) => {
            return product.id === id
        })

        if (!product) {
            res.status(404)
            throw new Error("Produto não encontrado")
        }

        if (typeof name !== "string") {
            res.status(400)
            throw new Error("O nome deve ser uma string.")
        }

        if (typeof price !== "number") {
            res.status(400)
            throw new Error("O preço deve ser um número")
        }

        // if (product) {
        //     product.name = editProduct.name || product.name
        //     product.price = isNaN(editProduct.price) ? product.price : editProduct.price
        //     product.category = editProduct.category || product.category
        // res.status(200).send("Produto atualizado com sucesso")

        // }

    } catch (error: any) {
        console.log(error)
        if (res.statusCode === 200) {
            res.status(500)
        }
        res.send(error.message)
    }

})
