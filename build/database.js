"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryProductsByName = exports.getProductById = exports.getAllProducts = exports.createProduct = exports.getAllUsers = exports.createUser = exports.purchase = exports.products = exports.users = void 0;
const types_1 = require("./types");
exports.users = [
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
];
exports.products = [
    {
        id: "01",
        name: "Camiseta",
        price: 32,
        category: types_1.PRODUCT_CATEGORY.CLOTHES_AND_SHOES
    },
    {
        id: "02",
        name: "Pulseira",
        price: 104,
        category: types_1.PRODUCT_CATEGORY.ACCESSORIES
    },
    {
        id: "03",
        name: "IPhone 11",
        price: 6999,
        category: types_1.PRODUCT_CATEGORY.ELECTRONICS
    }
];
exports.purchase = [
    {
        userId: `${exports.users.map((user) => user.id)}`,
        productId: `${exports.products.map((product) => product.id)}`,
        quantity: 5,
        totalPrice: 5 * 104
    },
    {
        userId: `${exports.users.map((user) => user.id)}`,
        productId: `${exports.products.map((product) => product.id)}`,
        quantity: 3,
        totalPrice: 3 * 32
    }
];
function createUser(id, email, password) {
    const newUser = {
        id,
        email,
        password
    };
    exports.users.push(newUser);
    console.log("Cadastro Realizado com Sucesso");
}
exports.createUser = createUser;
function getAllUsers() {
    return exports.users;
}
exports.getAllUsers = getAllUsers;
function createProduct(id, name, price, category) {
    const newProduct = {
        id,
        name,
        price,
        category
    };
    exports.products.push(newProduct);
    console.log("Produto criado com sucesso");
}
exports.createProduct = createProduct;
function getAllProducts() {
    return exports.products;
}
exports.getAllProducts = getAllProducts;
function getProductById(idSearch) {
    for (let i = 0; exports.products.length - 1; i++) {
        if (exports.products[i].id === idSearch) {
            return exports.products[i];
        }
    }
}
exports.getProductById = getProductById;
function queryProductsByName(q) {
    return exports.products.filter((product) => {
        return (product.name.toLowerCase().includes(q.toLowerCase()));
    });
}
exports.queryProductsByName = queryProductsByName;
function createPurchase(userId, productId, quantity, totalPrice) {
    const newPurchase = {
        userId,
        productId,
        quantity,
        totalPrice
    };
    exports.purchase.push(newPurchase);
    console.log("Compra realizada com sucesso");
}
function getAllPurchasesFromUserId(userIdToSearch) {
    return exports.purchase.filter((purchase) => {
        return (purchase.userId.toLowerCase().includes(userIdToSearch.toLowerCase()));
    });
}
console.log(getAllPurchasesFromUserId("01"));
//# sourceMappingURL=database.js.map