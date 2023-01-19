import { TProduct, TPurchase, TUsers, PRODUCT_CATEGORY } from "./types"

export const users: TUsers[] = [
    {
        id: "u01",
        email: "fulano@gmail.com",
        password: "J@son"
    },
    {
        id: "u02",
        email: "ciclano@gmail.com",
        password: "Re@ct"
    },
    {
        id: "u03",
        email: "beltrano@gmail.com",
        password: "J@ava"
    }
]

export const products: TProduct[] = [
    {
        id: "p01",
        name: "Camiseta",
        price: 32,
        category: PRODUCT_CATEGORY.CLOTHES_AND_SHOES
    }, 
    {
        id: "p02",
        name: "Pulseira",
        price: 104,
        category: PRODUCT_CATEGORY.ACCESSORIES
    },
    {
        id: "p03",
        name: "IPhone 11",
        price: 6999,
        category: PRODUCT_CATEGORY.ELECTRONICS
    }
]

export const purchase: TPurchase[] = [
    {
        userId: "u01", //`${users.map((user)=> user.id)}`,
        productId: "p01", //`${products.map((product)=> product.id)}`,
        quantity: 5,
        totalPrice: 5*32
    },
    {
        userId: "u01", //`${users.map((user)=> user.id)}`,
        productId: "p02", //`${products.map((product)=> product.id)}`,
        quantity: 2,
        totalPrice: 2*104
    },
    {
        userId: "u02", //`${users.map((user)=> user.id)}`,
        productId: "p03", //`${products.map((product)=> product.id)}`,
        quantity: 1,
        totalPrice: 1*6999
    }
]


export function createUser(id:string, email:string, password:string): void{
    const newUser: TUsers = {
        id,
        email,
        password
    }
    users.push(newUser)
    console.log("Cadastro Realizado com Sucesso")
}

// createUser("09", "marina@email.com", "M@rina"))

export function getAllUsers() : TUsers[]{
    return users
}

// console.log(getAllUsers())

export function createProduct(id:string, name:string, price: number, category:PRODUCT_CATEGORY): void {
    const newProduct: TProduct = {
        id,
        name,
        price,
        category
    }
    products.push(newProduct)
    console.log("Produto criado com sucesso")
}

// createProduct("p004", "Monitor HD", 800, PRODUCT_CATEGORY.ELECTRONICS)

export function getAllProducts() : TProduct[]{
    return products
}
// console.log(getAllProducts())

export function getProductById(idSearch:string | undefined){
    for(let i =0; products.length -1; i++){
        if(products[i].id === idSearch){
            return products[i]
    }
    }
}
// console.log(getProductById("01"))

export function queryProductsByName(q:string): TProduct[]{
    return products.filter((product)=>{
        return (product.name.toLowerCase().includes(q.toLowerCase()))
    })
}

// console.log(queryProductsByName("iphone"))



function createPurchase(userId:string, productId:string, quantity:number, totalPrice: number){
    const newPurchase: TPurchase ={
        userId,
        productId,
        quantity,
        totalPrice
    }
    purchase.push(newPurchase)
    console.log("Compra realizada com sucesso")
}

// createPurchase("u003", "p004", 2, 1600)

function getAllPurchasesFromUserId (userIdToSearch:string): TPurchase[]{
    return purchase.filter((purchase)=>{
        return(purchase.userId.toLowerCase().includes(userIdToSearch.toLowerCase()))
    })
}

console.log(getAllPurchasesFromUserId("01"))


