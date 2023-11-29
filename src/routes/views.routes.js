import { Router } from 'express'

import { ProductController } from '../dao/product.controller.mdb.js'
import { CartController } from '../dao/cart.controller.mdb.js'
import messageModel from '../dao/models/message.model.js'

const router = Router()
const controllerProducts = new ProductController()
const controllerCarts = new CartController()

export const handleSocketEvents = (socketServer) => {
    socketServer.on('connection', async (socket) => {

        socket.on('deleteProduct', async (productId) => {
            const deletedProduct = await controllerProducts.deleteProduct(productId)
            return deletedProduct
        });

        // Obtener los mensajes existentes al conectarse un nuevo cliente
        const existingMessage = await messageModel.findOne();
        const messages = existingMessage ? existingMessage.messages : [];
        socket.emit('initial_messages', { messages });

        socket.on('new_message', async (data) => {
            console.log('New message from client:', data);

            try {
                // Obtener el documento existente (si hay alguno) o crear uno nuevo
                const existingMessage = await messageModel.findOne();
                const newMessage = existingMessage || new messageModel();

                // Agregar el nuevo mensaje al array si es válido
                if (data.message.trim() !== '') {
                    newMessage.messages.push(data.message);
                }

                // Guardar el documento modificado
                await newMessage.save();

                // Emitir el nuevo mensaje a todos los clientes conectados
                io.emit('message_added', { message: data.message });
            } catch (error) {
                console.error('Error al guardar el mensaje:', error.message);
            }
        });
    });
}

router.get('/products', async (req, res) => {
    const products = await controllerProducts.getProducts()
    res.render('products', {
        title: 'Products list', 
        products
    })
})

router.get('/carts', async (req, res) => {
    const carts = await controllerCarts.getCarts()
    res.render('carts', {title: 'Carts list', carts})
})

router.get('/socketServer', async (req, res) => {
    const products = await controllerProducts.getProducts()
    const existingMessage = await messageModel.findOne();
    const messages = existingMessage ? existingMessage.messages : []

    res.render('socketServer', { products, messages });
})



export default router