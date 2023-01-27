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

// ## Edit User by id
app.put("/users/:id", async (req: Request, res: Response) => {

    try {
        const id = req.params.id

        const [user] = await db("users").where({id: id})

        if (id[0] !== "u") {
            res.status(400)
            throw new Error("O id deve inicar com 'u'")
        }

        const newName = req.body.name
        const newEmail = req.body.email
        const newPassword = req.body.password

        const editUser = {
            name: newName || user.name,
            email: newEmail || user.email,
            password: newPassword || user.password
        }

        
        if (typeof newName !== "string" &&
            typeof newEmail !== "string" &&
            typeof newPassword !== "string") {
            res.status(400)
            throw new Error("'email' e 'password' devem ser uma string.")
        }

        if (user) {

            await db("users").update(editUser).where({id:id})

        } else {
            res.status(400)
            throw new Error("Usuário não cadastrado.")
        }

        res.status(200).send({ message: "Cadastro atualizado com sucesso"})

    } catch (error: any) {
        console.log(error)
        if (res.statusCode === 200) {
            res.status(500)
        }
        res.send(error.message)
    }
})

// ## Delete User by id
app.delete("/users/:id", async (req: Request, res: Response) => {

    try {
        const id = req.params.id

        const [userExist] = await db("users").where({id: id})

        if (userExist) {
            await db("users").del().where({id: id})
            res.status(200).send({ message: "Usuário apagado com sucesso"})

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
        
            res.status(200).send({ message: "Produto atualizado com sucesso"})

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
app.delete("/products/:id", async (req: Request, res: Response) => {

    try {
        const id = req.params.id

        const productDelete = await db("products").where({ id: id})
        
        if (productDelete) {
            await db("products").del().where({id: id})
            res.status(200).send({message: "Produto apagado com sucesso"})

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

//############ PURCHASE ############

//##createPurchase
app.post("/purchases", async (req: Request, res: Response) => {

    try {

        const newIdPurchase = req.body.id
        const newBuyer = req.body.buyer
        const newProducts = req.body.products //---ISSO É UM ARRAYYYYYYYYYYYY

        const {productId, quantity} = newProducts

        const [idExist] = await db("purchases").where({id: newIdPurchase})

        if(idExist){
            res.status(400)
            throw new Error("Id já cadastrado")
        }

        if(newIdPurchase[0] !== "p" && newIdPurchase[1] !== "r"){
            res.status(400)
            throw new Error("O id deve iniciar com 'pr'")
        }

        if (!newIdPurchase || !newBuyer|| !newProducts) {
            res.status(400)
            throw new Error("Falta adicionar id, buyer e produtos.")
        }

        if (typeof newIdPurchase !== "string" &&
            typeof newBuyer !== "string") {
            res.status(400)
            throw new Error("'userId' e 'productId' são string.")
        }

        let newPriceTotal = 0

        const bodyPurchase = {
            id: newIdPurchase,
            buyer: newBuyer,
            total_price: newPriceTotal
        }

        await db("purchases").insert(bodyPurchase)

        const products = []

        for(let item of newProducts){
            const [addItem] = await db("products").where({ id: item.id})
            newPriceTotal += addItem.price * item.quantity
            await db("purchases_products").insert({purchase_id: newIdPurchase , product_id: item.id, quantity: item.quantity})
            const completeProduct = {
                ...addItem,
                quantity
            }
            products.push(completeProduct)
        }

        await db("purchases").update({total_price: newPriceTotal}).where({ id: newIdPurchase})

        const result = {
            id: bodyPurchase.id,
            buyer: bodyPurchase.buyer,
            totalPrice: newPriceTotal,
            products
        }

        res.status(201).send({ 
            message: "Pedido realizado com sucesso",
            purchase: result
        })

    } catch (error: any) {
        console.log(error)
        if (res.statusCode === 200) {
            res.status(500)
        }
        res.send(error.message)
    }
})






















//##editPurchase
app.put("/purchases", async (req: Request, res: Response) => {

    try {

        const newIdPurchase = req.body.id
        const newBuyer = req.body.buyer
        const newProducts = req.body.products //---ISSO É UM ARRAYYYYYYYYYYYY

        const {productId, quantity} = newProducts

        const [purchase] = await db("purchases").where({id: newIdPurchase})

        if(purchase){
            res.status(400)
            throw new Error("Id já cadastrado")
        }

        if(newIdPurchase[0] !== "p" && newIdPurchase[1] !== "r"){
            res.status(400)
            throw new Error("O id deve iniciar com 'pr'")
        }

        if (!newIdPurchase || !newBuyer|| !newProducts) {
            res.status(400)
            throw new Error("Falta adicionar id, buyer e produtos.")
        }

        if (typeof newIdPurchase !== "string" &&
            typeof newBuyer !== "string") {
            res.status(400)
            throw new Error("'userId' e 'productId' são string.")
        }

        let newPriceTotal = 0

        const bodyPurchase = {
            id: newIdPurchase || purchase.id ,
            buyer: newBuyer || purchase.buyer,
            total_price: newPriceTotal
        }

        await db("purchases").update(bodyPurchase)

        const products = []

        for(let item of newProducts){
            const [addItem] = await db("products").where({ id: item.id})
            newPriceTotal += addItem.price * item.quantity
            await db("purchases_products").update({
                purchase_id: newIdPurchase || purchase.id,
                product_id: item.id || addItem.id, 
                quantity: item.quantity || addItem.quantity})
            const completeProduct = {
                ...addItem,
                quantity
            }
            products.push(completeProduct)
        }

        await db("purchases").update({total_price: newPriceTotal}).where({ id: newIdPurchase})

        const result = {
            id: bodyPurchase.id,
            buyer: bodyPurchase.buyer,
            totalPrice: newPriceTotal,
            products
        }

        res.status(201).send({ 
            message: "Pedido atualizado com sucesso",
            purchase: result
        })

    } catch (error: any) {
        console.log(error)
        if (res.statusCode === 200) {
            res.status(500)
        }
        res.send(error.message)
    }
})



//##getPurchaseById
app.get("/purchases/:id", async (req: Request, res: Response) => {

    try {

        const newIdPurchase = req.body.id

        const [idExist] = await db("purchases").where({id: newIdPurchase})

        if (idExist) {

            const [cart] = await db("purchases")
                .select(
                    "purchases.id AS purchaseId",
                    "purchases.total_price AS totalPrice",
                    "purchases.created_at AS createdAt",
                    "purchases.paid",
                    "purchases.delivered_at AS deliveredAt",
                    "users.id AS buyerId",
                    "users.email",
                    "users.name")
                .innerJoin("users", "purchases.buyer_id", "=", "users.id")
                .where({ id: newIdPurchase })

            const purchaseProducts = await db("purchase_products")
                .select("purchase_products.product_id AS id",
                    "products.name",
                    "products.price",
                    "products.description",
                    "products.url_image AS urlImage",
                    "purchase_products.quantity")
                .innerJoin("products", "products.id", "=", "purchase_products.product_id")
                .where({ purchase_id: newIdPurchase })

            const result = { ...cart, productsList: purchaseProducts }

            res.status(200).send(result)

        } else {
            res.status(404)
            throw new Error("Compra não encontrada");

        }

        // if(!idExist){
        //     res.status(400)
        //     throw new Error("Id não cadastrado")
        // }

        // if(newIdPurchase[0] !== "p" && newIdPurchase[1] !== "r"){
        //     res.status(400)
        //     throw new Error("O id deve iniciar com 'pr'")
        // }

        // if (!newIdPurchase) {
        //     res.status(400)
        //     throw new Error("Falta adicionar id da compra.")
        // }

        // if (typeof newIdPurchase !== "string") {
        //     res.status(400)
        //     throw new Error("'id'é uma string.")
        // }

        // const [result] = await db("purchases").where({ id: newIdPurchase})

        // res.status(201).send({ purchase: result})

    } catch (error: any) {
        console.log(error)
        if (res.statusCode === 200) {
            res.status(500)
        }
        res.send(error.message)
    }
})


//##deletePurchaseById
app.delete("/purchase/:id", async (req: Request, res: Response) => {

    try {
        const idToDelete = req.params.id

        const productDelete = await db("purchases").where({id: idToDelete})

        if(idToDelete[0] !== "p" && idToDelete[1] !== "r"){
            res.status(400)
            throw new Error("O id deve iniciar com 'pr'")
        }

        if (productDelete) {
            await db("purchases").del().where({id: idToDelete})
            res.status(200).send({ message: "Produto apagado com sucesso"})

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
