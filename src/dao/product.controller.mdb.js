import productModel from './models/product.model.js'

export class ProductController {
    constructor() {}

    async addProduct(product) {
        try {
            await productModel.create(product)
            return "Added product"
        } catch (err) {
            return err.message
        }
    }

    async getProducts() {
        try {
            const products = await productModel.find().lean()
            return products
        } catch (err) {
            return err.message
        }
        
    }

    async getProduct(id) {
        try {
            const product = await productModel.findById(id)
            return product
        } catch (err) {
            return err.message
        }
    }

    async updateProduct(id, newContent) {
        try {
            const product = await productModel.findByIdAndUpdate(id, newContent, { new: true })
            return product
        } catch (err) {
            return err.message
        }
    }

    async deleteProduct(id) {
        try {
            const product = await productModel.findByIdAndDelete(id)
            return product
        } catch (err) {
            return err.message
        }
    }

    async getProductByCode(code) {
        try {
            const products = await this.getProducts();
            return products.find(product => product.code === code) || null;
        } catch (err) {
            return err.message;
        }
    }
}