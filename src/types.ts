// export enum PRODUCT_CATEGORY {
//     ACCESSORIES = "Acessórios",
//     CLOTHES_AND_SHOES = "Roupas e calçados",
//     ELECTRONICS = "Eletrônicos"
// }

export type TUsers = {
    id: string,
    name: string,
    email: string,
    password: string
}

export type TUsersEdit = {
    name: string,
    email: string,
    password: string
}

export type TProduct = {
    id: string,
    name: string,
    price: number,
    description: string,
    image_url: string
}

export type TPurchase ={
    id: string,
    buyer: string,
    total_price: number
}

export type TCreatePurchase = {
    id: string,
    buyer: string,
    totalPrice: number,
    products: TProduct[]
}



// if (!newIdPurchase || !newBuyer) {
//     res.status(400)
//     throw new Error("Falta adicionar id, buyer e produtos.")
// }





// if(products.length <= 0){
//     res.status(400)
//     throw new Error ("Propriedade 'products' precisa ter pelo menos um objeto com id e quantidade, exemplo: {id: 'p001', quantity: 1}")
// }