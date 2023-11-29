import { promises as fs } from 'fs'

export class CartController {
    constructor(filePath) {
        this.filePath = filePath;
        this.carts = [];
    }

    static async incrementID() {
        try {
            const data = await fs.readFile(this.filePath, 'utf-8');
            const carts = JSON.parse(data) || [];
            const idIncrement = carts.length > 0 ? Math.max(...carts.map(cart => cart.id)) + 1 : 1;
            return idIncrement;
        } catch (err) {
            throw new Error('Error reading data from file');
        }
    }

    async saveData() {
        try {
            await fs.writeFile(this.filePath, JSON.stringify(this.carts, null, 2), 'utf-8');
        } catch (err) {
            throw new Error('Error writing data to file');
        }
    }

    async addCart(cart) {
        try {
            const newCart = {
                id: await CartController.incrementID(),
                products: []
            };
            this.carts.push(newCart);
            await this.saveData();
            return newCart;
        } catch (err) {
            return err.message;
        }
    }

    async getCarts() {
        try {
            const data = await fs.readFile(this.filePath, 'utf-8');
            this.carts = JSON.parse(data) || [];
            return this.carts;
        } catch (err) {
            return err.message;
        }
    }

    async getCart(id) {
        try {
            const cart = this.carts.find(cart => cart.id === Number(id));
            if (cart) {
                return cart;
            } else {
                throw new Error("Cart not found");
            }
        } catch (err) {
            return err.message;
        }
    }

    async updateCart(id, newContent) {
        try {
            const cartIndex = this.carts.findIndex(cart => cart.id === Number(id));
            if (cartIndex !== -1) {
                this.carts[cartIndex] = { ...this.carts[cartIndex], ...newContent };
                await this.saveData();
                return this.carts[cartIndex];
            } else {
                throw new Error("Cart not found");
            }
        } catch (err) {
            return err.message;
        }
    }

    async deleteCart(id) {
        try {
            const cartIndex = this.carts.findIndex(cart => cart.id === Number(id));
            if (cartIndex !== -1) {
                const deletedCart = this.carts.splice(cartIndex, 1);
                await this.saveData();
                return deletedCart[0];
            } else {
                throw new Error("Cart not found");
            }
        } catch (err) {
            return err.message;
        }
    }

    async addProductToCart(cartId, productId, quantity = 1) {
        try {
            const cart = this.carts.find(cart => cart.id === Number(cartId));
            if (cart) {
                const existingProductIndex = cart.products.findIndex(product => product.id === Number(productId));
                if (existingProductIndex !== -1) {
                    // Increment the quantity if the product already exists
                    cart.products[existingProductIndex].quantity += quantity;
                } else {
                    // Add the new product to the cart
                    cart.products.push({ id: Number(productId), quantity });
                }
                await this.saveData();
                return cart;
            } else {
                throw new Error("Cart not found");
            }
        } catch (err) {
            return err.message;
        }
    }
}