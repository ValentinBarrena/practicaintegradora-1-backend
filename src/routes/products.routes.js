import { Router } from 'express'

import { uploader } from '../uploader.js'
import { ProductController } from '../dao/product.controller.mdb.js'

const router = Router()
const controller = new ProductController()

router.get('/', async (req, res) => {
    const products = await controller.getProducts()
    res.status(200).send({ status: 'OK', data: products })
})

router.get('/:pid', async (req, res) => {
    const productId = req.params.pid

    if (!/^[a-fA-F0-9]{24}$/.test(productId)) {
        return res.status(400).send({ status: 'Error', message: 'Invalid product ID' });
    }

    const product = await controller.getProduct(productId);
        if (product) {
            res.status(200).send({ status: 'OK', data: product });
        } else {
            res.status(400).send({ status: 'Error', message: 'Product not found' });
        }
})

router.post('/', uploader.single('thumbnail'), async (req, res) => {
    if (!req.file) return res.status(400).send({ status: 'FIL', data: 'Could not upload file' })

    const { title, description, price, code, stock, status, category } = req.body
    if (!title || !description || !price || !code || !stock) {
        return res.status(400).send({ error: 'All fields are required' })
    }

    const existingProduct = await controller.getProductByCode(parseInt(code));
        if (existingProduct) {
            return res.status(400).send({ error: 'Product with the same code already exists' });
        }

    const newProduct = {
        title,
        description,
        price,
        thumbnail: req.file.filename,
        status,
        category,
        code,
        stock
    }

    const result = await controller.addProduct(newProduct)
    res.status(200).send({ status: 'OK', data: result })
})

router.put('/:pid', async (req, res) => {
    const id = req.params.pid;
    const newContent = req.body

    const updatedProduct = await controller.updateProduct(id, newContent)

    res.status(200).send({ status: 'Updated', data: updatedProduct })
})

router.delete('/:pid', async (req, res) => {
    const id = req.params.pid;

    const deletedProduct = await controller.deleteProduct(id)

    res.status(200).send({ status: 'Deleted', data: deletedProduct })
})

export default router