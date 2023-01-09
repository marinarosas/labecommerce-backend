import express, { application, Request, Response } from 'express'
import cors from 'cors'
import { products, users, purchase } from "./database"
import { TProduct, TUsers, TPurchase } from './types'

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

