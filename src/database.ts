import { TProduct, TPurchase, TUsers } from "./types"

export const users: TUsers[] = [
    {
        id: "01",
        email: "fulano@gmail.com",
        password: "J@son"
    },
    {
        id: "02",
        email: "ciclano@gmail.com",
        password: "Re@ct"
    }
]

export const products: TProduct[] = [
    {
        id: "01",
        name: "Camiseta",
        price: 32,
        category: "Moda Feminina"
    }, 
    {
        id: "02",
        name: "Calça",
        price: 104,
        category: "Moda Masculina"
    }
]

export const purchase: TPurchase[] = [
    {
        userId: `${users.map((user)=> user.id)}`,
        productId: `${products.map((product)=> product.id)}`,
        quantity: 5,
        totalPrice: 5*104
    },
    {
        userId: `${users.map((user)=> user.id)}`,
        productId: `${products.map((product)=> product.id)}`,
        quantity: 3,
        totalPrice: 3*32
    }
]
