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