import express, { Request, Response } from 'express'
import cors from 'cors'
import { db } from './database/knex'

console.log('Hello world!')

const app = express()

app.use(express.json())
app.use(cors())

app.listen(3003, () => {
    console.log("Servidor rodando na porta 3003")
})

app.get('/ping', (req: Request, res: Response) => {
    res.send('Pong!')
})


//############ USERS ############

// ## Get All Users
app.get("/users", async (req: Request, res: Response) => {

    try {
        const result = await db('users')
        res.status(200).send(result)

    } catch (error: any) {
        console.log(error)
        if (res.statusCode === 200) {
            res.status(500)
        }
        res.send(error.message)
    }
})

//##createUser
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

        const [searchIdUser] = await db("users").where({id: newUser.id})

        const [searchEmail] = await db("users").where({email: newUser.email})

        if(searchIdUser || searchEmail){
            res.status(400)
            throw new Error("Id ou email já cadastrado.")
        } else {
            if (!email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)) {
                throw new Error("Parâmetro 'email' inválido")
            }

            if (!searchIdUser || !searchEmail) {
                await db("users").insert(newUser)
                res.status(201).send({ message: "Cadastro realizado com sucesso"})
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
















//############ PRODUCTS ############

//##createProduct
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

        const [searchProductById] = await db("products").where({id: newProduct.id})

        if (!searchProductById) {
            await db("products").insert(newProduct)
        } else {
            res.status(400)
            throw new Error("Id já está cadastrado.")
        }

        res.status(201).send({ message: "Produto cadastrado com sucesso"})

    } catch (error: any) {
        console.log(error)

        if (res.statusCode === 200) {
            res.status(500)
        }
        res.send(error.message)
    }
})

// ## Get All Products
app.get("/products", async (req: Request, res: Response) => {

    try {

        const results = await db('products')
        res.status(200).send(results)

    } catch (error: any) {
        console.log(error)

        if (res.statusCode === 200) {
            res.status(500)
        }
        res.send(error.message)
    }
})

// ## getProductByName
app.get("/products/search", async (req: Request, res: Response) => {

    try {
        const q = req.query.q as string
        const results = await db('products').where("name", "LIKE", `%${q}%`)

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





















// ## Edit Product by id
app.put("/products/:id", async (req: Request, res: Response) => {

    try {

        const idToEdit = req.params.id

        if (idToEdit[0] !== "p") {
            res.status(400)
            throw new Error("O id precisa iniciar com a letra 'p'")
        }

        const newId = req.body.id
        const newName = req.body.name
        const newPrice = req.body.price
        const newDescription = req.body.description
        const newImageUrl = req.body.image_url

        const [product] = await db("products").where({ id: idToEdit})

        const editProduct = {
            id: newId || product.id,
            name: newName || product.name,
            price: newPrice || product.price,
            description: newDescription || product.description,
            image_url: newImageUrl || product.image_url
        }

        if (typeof newName !== "string") {
            res.status(400)
            throw new Error("O nome deve ser uma string.")
        }

        if (typeof newPrice !== "number") {
            res.status(400)
            throw new Error("O preço deve ser um número")
        }
        if (!product) {
            res.status(404)
            throw new Error("Produto não encontrado")
        }

        if (product) {
            await db("products").update(editProduct).where({ id: idToEdit})
        
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



































// ## Get Products by id
app.get("/products/:id", async (req: Request, res: Response) => {

    try {
        const id = req.params.id

        if (id[0] !== "p") {
            res.status(400)
            throw new Error("Faltou iniciar a Id com 'p'")
        }

        const result = await db("products").where({ id: id})

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










//############ PURCHASE ############

//##createPurchase
app.post("/purchases", async (req: Request, res: Response) => {

    try {

        const { id, buyer, productId, quantity } = req.body

        const [products] = await db("products").where({id: productId})
        
        if (!id || !buyer || !productId) {
            res.status(400)
            throw new Error("Falta adicionar id ou buyer.")
        }

        if (typeof id !== "string" &&
            typeof buyer !== "string") {
            res.status(400)
            throw new Error("'userId' e 'productId' são string e 'totalPrice' são tipo number.")
        }

        const newPurchase = {
            id,
            buyer,
            total_price: products.price * quantity
        }
        
        const newPurchaseProduct = {
            purchase_id: id,
            product_id: productId,
            quantity
        }
        const [findUser] = await db("users").where({id: newPurchase.buyer})

        if (findUser) {
            await db("purchases").insert(newPurchase)
            await db("purchases_products").insert(newPurchaseProduct)
        } else {
            res.status(400)
            throw new Error("Compra não realizada.")
        }

        res.status(201).send({ 
            message: "Compra realizado com sucesso",
            purchase: {newPurchase, newPurchaseProduct}
        })

    } catch (error: any) {
        console.log(error)
        if (res.statusCode === 200) {
            res.status(500)
        }
        res.send(error.message)
    }
})

app.get("/purchases_products", async (req: Request, res: Response) => {

    try {
        const idUser = req.params.id

        if (idUser[0] !== "u") {
            res.status(400)
            throw new Error("Faltou inicar o Id do usuário com 'u'")
        }

        const [userFind] = await db("users").where({id: idUser})
        
        if (!userFind) {
            res.status(400)
            throw new Error("Não existe o usuário")
        }

        if (userFind) {

            const purchaseFind = await db("purchases").where({buyer: idUser})

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

// ## Get User Purchases by User id
// - method HTTP (GET)
// - path ("/users/:id/purchases")
// - response
//     - status 200
//     - array de compras do user no arquivo .db
app.get("/users/:id/purchases", async (req: Request, res: Response) => {

    try {
        const idUser = req.params.id

        if (idUser[0] !== "u") {
            res.status(400)
            throw new Error("Faltou inicar o Id do usuário com 'u'")
        }

        const [userFind] = await db("users").where({id: idUser})
        
        if (!userFind) {
            res.status(400)
            throw new Error("Não existe o usuário")
        }

        if (userFind) {

            const purchaseFind = await db("purchases").where({buyer: idUser})

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

        if (productDelete) {
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

        } else {
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

