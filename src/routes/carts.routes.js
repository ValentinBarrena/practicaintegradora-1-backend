import { Router } from 'express'
import { CartController } from '../dao/cart.controller.mdb.js'

const router = Router()
const controller = new CartController()

router.get('/', async (req, res) => {
        const carts = await controller.getCarts()
        res.status(200).send({ status: 'OK', data: carts })
})

router.get('/:cid', async (req, res) => {
    const cart = await controller.getCart(req.params.cid)
    res.status(200).send({ status: 'OK', data: cart })
})

router.post('/', async (req, res) => {
    const { products } = req.body
    if (!products) {
        return res.status(400).send({ error: 'Products field is required' })
    }

    const newCart = {
        products
    }

        const result = await controller.addCart(newCart)
        res.status(200).send({ status: 'OK', data: result })
})

router.put('/:cid', async (req, res) => {
    const id = req.params.cid;
    const newContent = req.body

    const updatedCart = await controller.updateCart(id, newContent)

    res.status(200).send({ status: 'Updated', data: updatedCart })
})

router.delete('/:cid', async (req, res) => {
    const id = req.params.cid;

    const deletedCart = await controller.deleteCart(id)

    res.status(200).send({ status: 'Deleted', data: deletedCart })
})

export default router