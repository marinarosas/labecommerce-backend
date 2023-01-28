import express, { Request, Response } from 'express'
import cors from 'cors'
import { db } from './database/knex'
import { TCreatePurchase, TEditPurchase, TProduct, TPurchase, TPurchasePaid, TUsers, TUsersEdit } from '../src/types'

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

const regexEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g
const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,12}$/g
//############ USERS ############

//##createUser
app.post("/users", async (req: Request, res: Response) => {

    try {
        const { id, name, email, password } = req.body as TUsers

        const newUser: TUsers = {
            id,
            name,
            email,
            password
        }

        if (!id || !name || !email || !password) {
            res.status(404)
            throw new Error("Faltou escrever o Id, name, email ou password.")
        }

        if (typeof id !== "string") {
            res.status(400)
            throw new Error("O tipo da Id deve ser uma string")
        }

        if (id[0] !== "u") {
            res.status(400)
            throw new Error("O id deve iniciar com a letra 'u'")
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

        const [searchIdUser]: TUsers[] = await db("users").where({ id: newUser.id })

        const [searchEmail]: TUsers[] = await db("users").where({ email: newUser.email })

        if (searchIdUser) {
            res.status(400)
            throw new Error("Id já cadastrado.")
        }

        if (searchEmail) {
            res.status(400)
            throw new Error("Email já cadastrado.")
        }
        if (!email.match(regexEmail)) {
            throw new Error("Parâmetro 'email' inválido")
        }

        if (!password.match(regexPassword)) {
            res.status(400)
            throw new Error("'password' deve possuir entre 8 e 12 caracteres, com letras maiúsculas e minúsculas e no mínimo um número e um caractere especial")
        }

        if (!searchIdUser || !searchEmail) {
            await db("users").insert(newUser)
            res.status(201).send({ message: "Cadastro realizado com sucesso" })
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

        const result: TUsers = await db('users')
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

        const newName = req.body.name
        const newEmail = req.body.email
        const newPassword = req.body.password

        const [user]: TUsers[] = await db("users").where({ id: id })

        if (id[0] !== "u") {
            res.status(400)
            throw new Error("O id deve inicar com 'u'")
        }

        if (typeof newName !== "string") {
            res.status(400)
            throw new Error("O tipo da name deve ser uma string")
        }

        if (typeof newEmail !== "string") {
            res.status(400)
            throw new Error("O tipo do e-mail deve ser uma string")
        }

        if (typeof newPassword !== "string") {
            res.status(400)
            throw new Error("O tipo do password é uma string")
        }

        if (!newEmail.match(regexEmail)) {
            throw new Error("Parâmetro 'email' inválido")
        }

        if (!newPassword.match(regexPassword)) {
            res.status(400)
            throw new Error("'password' deve possuir entre 8 e 12 caracteres, com letras maiúsculas e minúsculas e no mínimo um número e um caractere especial")
        }

        const editUser: TUsersEdit = {
            name: newName || user.name,
            email: newEmail || user.email,
            password: newPassword || user.password
        }

        if (user) {

            await db("users").update(editUser).where({ id: id })

        } else {
            res.status(400)
            throw new Error("Usuário não cadastrado.")
        }

        res.status(200).send({ message: "Cadastro atualizado com sucesso" })

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

        if (id[0] !== "u") {
            res.status(400)
            throw new Error("O id deve inicar com 'u'")
        }

        const [userExist]: TUsers[] = await db("users").where({ id: id })

        const [userHavePurchase]: TPurchase[] = await db("purchases").where({ buyer: id })

        if (userExist) {
            if (userHavePurchase) {
                await db("purchases").del().where({ buyer: id })
                await db("purchases_products").del().where({ purchase_id: userHavePurchase.id })
                await db("users").del().where({ id: id })
            } else {
                await db("users").del().where({ id: id })
            }

            res.status(200).send({ message: "Usuário apagado com sucesso" })

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

        const newProduct: TProduct = {
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

        if (id[0] !== "p") {
            res.status(400)
            throw new Error("O id precisa iniciar com a letra 'p'")
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

        const [searchProductById] = await db("products").where({ id: newProduct.id })

        if (!searchProductById) {
            await db("products").insert(newProduct)
        } else {
            res.status(400)
            throw new Error("Id já está cadastrado.")
        }

        res.status(201).send({ message: "Produto cadastrado com sucesso" })

    } catch (error: any) {
        console.log(error)

        if (res.statusCode === 200) {
            res.status(500)
        }
        res.send(error.message)
    }
})

// ## getAllProducts
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
        const results: TProduct[] = await db('products').where("name", "LIKE", `%${q}%`)

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

// ## getProductsById
app.get("/products/:id", async (req: Request, res: Response) => {

    try {
        const id = req.params.id

        if (id[0] !== "p") {
            res.status(400)
            throw new Error("Faltou iniciar a Id com 'p'")
        }

        const result: TProduct[] = await db("products").where({ id: id })

        if (result.length <= 0) {
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

        const newId = req.body.id
        const newName = req.body.name
        const newPrice = req.body.price
        const newDescription = req.body.description
        const newImageUrl = req.body.image_url

        if (typeof newId != "string") {
            res.status(400)
            throw new Error("O 'id' deve ser uma string")
        }

        if (idToEdit[0] !== "p") {
            res.status(400)
            throw new Error("O id precisa iniciar com a letra 'p'")
        }

        const [product] = await db("products").where({ id: idToEdit })

        const editProduct = {
            id: newId || product.id,
            name: newName || product.name,
            price: newPrice || product.price,
            description: newDescription || product.description,
            image_url: newImageUrl || product.image_url
        }

        if (newId[0] !== "p") {
            res.status(400)
            throw new Error("O id precisa iniciar com a letra 'p'")
        }

        if (typeof newName !== "string") {
            res.status(400)
            throw new Error("O 'name' deve ser uma string.")
        }

        if (typeof newPrice !== "number") {
            res.status(400)
            throw new Error("O 'price' deve ser um número")
        }

        if (typeof newDescription !== "string") {
            res.status(400)
            throw new Error("A 'description' deve ser uma string")
        }

        if (typeof newImageUrl !== "string") {
            res.status(400)
            throw new Error("A 'description' deve ser uma string")
        }

        if (!product) {
            res.status(404)
            throw new Error("Produto não encontrado")
        }

        if (product) {
            await db("products").update(editProduct).where({ id: idToEdit })

            res.status(200).send({ message: "Produto atualizado com sucesso" })

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
        const idToDelete = req.params.id

        if (idToDelete[0] !== "p") {
            res.status(400)
            throw new Error("O id precisa iniciar com a letra 'p'")
        }

        const [productExist] = await db("products").where({ id: idToDelete })

        if (!productExist) {
            res.status(400)
            throw new Error("Produto não existe")
        }

        if (productExist) {
            await db("products").del().where({ id: idToDelete })
            res.status(200).send({ message: "Produto apagado com sucesso" })
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
        const newProducts = req.body.products 

        const {productId, quantity} = newProducts


        if (!newIdPurchase || !newBuyer) {
            res.status(400)
            throw new Error("Falta adicionar id e buyer.")
        }

        const [idExist] = await db("purchases").where({id: newIdPurchase})

        if(idExist){
            res.status(400)
            throw new Error("Id já cadastrado")
        }

        if(newIdPurchase[0] !== "p"){
            res.status(400)
            throw new Error("O id deve iniciar com 'pr'")
        }

        if(newIdPurchase[1] !== "r"){
            res.status(400)
            throw new Error("O id deve iniciar com 'pr'")
        }

        if(newBuyer[0] !== "u"){
            res.status(400)
            throw new Error("O 'buyer' deve iniciar com 'u'")
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

        const result: TCreatePurchase = {
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

//##editPurchaseById
app.put("/purchases/:id", async (req: Request, res: Response) => {

    try {
        const idToEdit = req.params.id
        const newBuyer = req.body.buyer
        const newPaid = req.body.paid

        const [purchase]: TPurchasePaid[] = await db("purchases").where({ id: idToEdit })

        if(idToEdit[0] !== "p"){
            res.status(400)
            throw new Error("O id deve iniciar com 'pr'")
        }

        if(idToEdit[1] !== "r"){
            res.status(400)
            throw new Error("O id deve iniciar com 'pr'")
        }

        if (typeof newBuyer !== "string") {
            res.status(400)
            throw new Error("'userId' e 'productId' são string.")
        }

        if(newBuyer[0] !== "u"){
            res.status(400)
            throw new Error("O 'buyer' deve iniciar com 'u'")
        }

        if(typeof newPaid !== 'number'){
            res.status(400)
            throw new Error("'paid' tem que ser 0 ou 1, sendo 0 para false e 1 para true.")
        }

        if (!purchase) {
            res.status(400)
            throw new Error("Id não cadastrado")
        }

        const bodyPurchase: TEditPurchase = {
            buyer: newBuyer || purchase.buyer,
            paid: isNaN(newPaid) ? purchase.paid : newPaid
        }

        await db("purchases").update(bodyPurchase).where({ id: idToEdit })


        res.status(201).send({
            message: "Pedido atualizado com sucesso",
            purchase: bodyPurchase
        })

    } catch (error: any) {
        console.log(error)
        if (res.statusCode === 200) {
            res.status(500)
        }
        res.send(error.message)
    }
})

//##getAllPurchase
app.get("/purchases", async (req: Request, res: Response) => {

    try {

        const result = await db("purchases")

        res.status(201).send({ purchase: result })

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

        const newIdPurchase = req.params.id

        const [idExist] = await db("purchases").where({ id: newIdPurchase })

        if (newIdPurchase[0] !== "p" && newIdPurchase[1] !== "r") {
            res.status(400)
            throw new Error("O id deve iniciar com 'pr'")
        }

        if (!idExist) {
            res.status(400)
            throw new Error("Id não cadastrado")
        }

        if (!newIdPurchase) {
            res.status(400)
            throw new Error("Falta adicionar id da compra.")
        }

        if (typeof newIdPurchase !== "string") {
            res.status(400)
            throw new Error("'id'é uma string.")
        }

        const [result] = await db("purchases").where({ id: newIdPurchase })

        res.status(201).send({ purchase: result })

    } catch (error: any) {
        console.log(error)
        if (res.statusCode === 200) {
            res.status(500)
        }
        res.send(error.message)
    }
})

//##deletePurchaseById
app.delete("/purchases/:id", async (req: Request, res: Response) => {

    try {
        const idToDelete = req.params.id

        const productDelete: TPurchase[] = await db("purchases").where({ id: idToDelete })
        const purchaseDelete: TPurchase[] = await db("purchases_products").where({ purchase_id: idToDelete })

        if(idToDelete[0] !== "p"){
            res.status(400)
            throw new Error("O id deve iniciar com 'pr'")
        }

        if(idToDelete[1] !== "r"){
            res.status(400)
            throw new Error("O id deve iniciar com 'pr'")
        }

        if (productDelete && purchaseDelete) {
            await db("purchases_products").del().where({ purchase_id: idToDelete })
            await db("purchases").del().where({ id: idToDelete })
            res.status(200).send({ message: "Compra apagada com sucesso" })

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















