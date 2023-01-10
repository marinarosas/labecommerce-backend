import express, { Request, Response } from 'express'
import cors from 'cors'
import { products, users, purchase } from "./database"
import { TProduct, TUsers, TPurchase, PRODUCT_CATEGORY } from './types'

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
app.get("/users", (req: Request, res: Response)=>{
    res.status(200).send(users)
})

// ## Get All Products
app.get("/products", (req: Request, res: Response)=>{
    res.status(200).send(products)
})


// ## Search Product by name
app.get("/products/search", (req: Request, res: Response)=>{
    const q = req.query.q as string
    const results = products.filter((product)=>{
        return product.name.toLowerCase().includes(q.toLowerCase())
    })
    res.status(200).send(results)
})

// ## Create User
app.post("/users", (req: Request, res: Response)=>{
    const {id, email, password} = req.body as TUsers

    const newUser: TUsers = {
        id,
        email,
        password
    }
    users.push(newUser)
    res.status(201).send("Cadastro realizado com sucesso")
})

// ## Create Product
app.post("/products", (req: Request, res: Response) =>{
    const {id, name, price, category} = req.body as TProduct
    
    const newProduct: TProduct = {
        id,
        name,
        price,
        category
    }

    products.push(newProduct)
    res.status(201).send("Produto cadastrado com sucesso")
})

// ## Create Purchase
app.post("/purchases", (req: Request, res: Response)=>{
    const {userId, productId, quantity, totalPrice} = req.body as TPurchase
   
    const newPurchase: TPurchase = {
        userId,
        productId,
        quantity,
        totalPrice
    }
    purchase.push(newPurchase)
    res.status(201).send("Compra realizado com sucesso")
})

// ## Get Products by id
app.get("/products/:id", (req: Request, res: Response)=>{
    const id = req.params.id 

    const result = products.find((product)=>{
        return product.id === id
    })

    res.status(200).send(result)
})

// ## Get User Purchases by User id
app.get("/users/:id/purchases", (req: Request, res: Response)=>{
    const id = req.params.id

    const userFind = users.find((user)=>{
        return user.id === id
    })

    if(userFind){
        const purchaseFind = purchase.filter((p)=>{
            return p.userId === userFind.id
        })

        if(purchaseFind){
            res.status(200).send(purchaseFind)

        }
    }

})

// ## Delete User by id
app.delete("/users/:id", (req: Request, res: Response)=>{
    const id = req.params.id

    const userDelete = users.findIndex((user)=>{
        return user.id === id
    })

    if(userDelete >= 0){
        users.splice(userDelete, 1)
        res.status(200).send("User apagado com sucesso")
    } else {
        res.status(404).send("User não encontrado")
    }
})

// ## Delete Product by id
app.delete("/products/:id", (req: Request, res: Response)=>{
    const id = req.params.id 

    const productDelete = products.findIndex((product)=>{
        return product.id === id
    })

    if(productDelete >= 0){
        products.splice(productDelete, 1)
        res.status(200).send("Produto apagado com sucesso")
    } else{
        res.status(404).send("Produto não encontrado")
    }
})

// ## Edit User by id
app.put("/users/:id", (req: Request, res: Response)=>{
    const id = req.params.id

    const newEmail = req.body.email as string || undefined
    const newPassword = req.body.password as string || undefined

    const user = users.find((user)=>{
        return user.id === id
    })

    if(user){
        user.email = newEmail || user.email
        user.password = newPassword || user.password
    }

    res.status(200).send("Cadastro atualizado com sucesso")
})

// ## Edit Product by id
app.put("/products/:id", (req: Request, res: Response)=>{
    const id = req.params.id

    const newName = req.body.name as string || undefined
    const newPrice = req.body.price as number 
    const newCategory = req.body.category as PRODUCT_CATEGORY || undefined

    const product = products.find((product)=>{
        return product.id === id
    })

    if(product){
        product.name = newName || product.name
        product.price = isNaN(newPrice) ? product.price : newPrice
        product.category = newCategory || product.category
    }
    res.status(200).send("Produto atualizado com sucesso")
})
