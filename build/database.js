"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.purchase = exports.products = exports.users = void 0;
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
        category: "Moda Feminina"
    },
    {
        id: "02",
        name: "Calça",
        price: 104,
        category: "Moda Masculina"
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
//# sourceMappingURL=database.js.map