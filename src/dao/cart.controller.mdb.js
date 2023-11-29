import cartModel from './models/cart.model.js'
import productModel from './models/product.model.js'

export class CartController {
    constructor() {
    }

    async addCart(cart) {
        try{    
            await cartModel.create(cart)
            return "Cart created"
        } catch (err) {
            return err.message
        }
    }

    async getCarts() {
        try {
            return await cartModel.find().populate({ path: 'products', model: productModel }).lean();  
        } catch (err) {
            return err.message
        }
    }

    async getCart(id) {
        try {
            const cart = await cartModel.findById(id).populate({ path: 'products', model: productModel }).lean()
            return cart === null ? 'Cart not founded' : cart
        } catch (err) {
            return err.message
        }
    }

    async updateCart(id, newContent) {
        try {
            const cart = await cartModel.findByIdAndUpdate(id, newContent, { new: true })
            return cart
        } catch (err) {
            return err.message
        }
    }

    async deleteCart(id) {
        try {
            const cart = await cartModel.findByIdAndDelete(id)
            return cart
        } catch (err) {
            return err.message
        }
    }
}