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

        const [userHavePurchase] = await db("purchases").where({buyer: id})
        
        if (userExist) {
            if(userHavePurchase){
                await db("purchases").del().where({buyer: id})
                await db("purchases_products").del().where({purchase_id: userHavePurchase.id})
                await db("users").del().where({id: id})
            } else {
                await db("users").del().where({id: id})
                
            }

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
        const newProducts = req.body.products //---ISSO É UM OBJETO QUE SERA INSERIDO EM UM ARRAY

        const {productId, quantity} = newProducts //= purchase_products

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
            total_price: newPriceTotal// = 0
        }

        await db("purchases").insert(bodyPurchase) 

        const products = [] // [{},{}]

        for(let item of newProducts){ // = item = {purchase_id, producst_id, quantity} --> purchases_products Tabela
            const [addItem] = await db("products").where({ id: item.id}) // addItem = {id, name, price, description, image_Url}
            newPriceTotal += addItem.price * item.quantity// 30 + 40 = 70
            await db("purchases_products") // tabela - purchase_id, product_id, quantity
            .insert({purchase_id: newIdPurchase , product_id: item.id, quantity: item.quantity})
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





//##getAllPurchase
app.get("/purchases", async (req: Request, res: Response) => {

    try {

        const result = await db("purchases")

        res.status(201).send({ purchase: result})

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

        const [idExist] = await db("purchases").where({id: newIdPurchase})

        if(newIdPurchase[0] !== "p" && newIdPurchase[1] !== "r"){
            res.status(400)
            throw new Error("O id deve iniciar com 'pr'")
        }

        if(!idExist){
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

        const [result] = await db("purchases").where({ id: newIdPurchase})

        res.status(201).send({ purchase: result})

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

        const productDelete = await db("purchases").where({id: idToDelete})
        const purchaseDelete = await db("purchases_products").where({purchase_id: idToDelete})

        if(idToDelete[0] !== "p" && idToDelete[1] !== "r"){
            res.status(400)
            throw new Error("O id deve iniciar com 'pr'")
        }

        if (productDelete && purchaseDelete) {
            await db("purchases_products").del().where({purchase_id: idToDelete})
            await db("purchases").del().where({id: idToDelete})
            res.status(200).send({ message: "Compra apagada com sucesso"})

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






















//##editPurchaseById
app.put("/purchases/:id", async (req: Request, res: Response) => {

    try {
        const idToEdit = req.params.id
        const newBuyer = req.body.buyer
        const newPaid = req.body.paid
    
        const [purchase] = await db("purchases").where({id: idToEdit})

        if(!purchase){
            res.status(400)
            throw new Error("Id não cadastrado")
        }

        if (typeof newBuyer !== "string") {
            res.status(400)
            throw new Error("'userId' e 'productId' são string.")
        }

        const bodyPurchase = {
            buyer: newBuyer || purchase.buyer,
            paid: isNaN(newPaid) ? purchase.paid : newPaid
        }

        await db("purchases").update(bodyPurchase).where({id: idToEdit})

    
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







