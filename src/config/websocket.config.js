import { Server } from 'socket.io';
import ProductManager  from '../managers/ProductManager.js';
import CartManager from '../managers/CartManager.js';

const productManager = new ProductManager();
const cartManager = new CartManager();

export const config = (httpServer) => {
    const socketServer = new Server(httpServer);

    socketServer.on('connection', async (socket) => {
        socketServer.emit('products-list', { products: await productManager.getAll() });
        
        socket.on('new-product', async (data) => {
            try {
                await productManager.createOne(data);
                const updatedProducts = await productManager.getAll();
                socketServer.emit('products-list', { products: updatedProducts });
            } catch (error) {
                socketServer.emit('error-message', { message: error.message });
            }
        });

        socket.on('delete-product', async (data) => {
            try {
                await productManager.deleteById(data.id);
                socketServer.emit('products-list', { products: await productManager.getAll() });
            } catch (error) {
                socketServer.emit('error-message', { message: error.message });
            }
        });

        socket.on('add-to-cart', async ({ cartId, productId }) => {
            if (!cartId || !productId) {
                return socket.emit('error', 'Faltan los datos necesarios.');
            }
            try {
                await cartManager.addProduct(cartId, productId);
                const cart = await cartManager.getById(cartId);
                socketServer.emit('cart-updated', cart);
            } catch (error) {
                socket.emit('error', `Error al agregar el producto al carrito: ${error.message}`);
            }
        });

        socket.on('remove-from-cart', async ({ cartId, productId }) => {
            try {
                await cartManager.removeProduct(cartId, productId);
                const cart = await cartManager.getById(cartId);
                socketServer.emit('cart-updated', cart);
            } catch (error) {
                socket.emit('error', error.message);
            }
        });

        socket.on('clear-cart', async ({ cartId }) => {
            try {
                const clearedCart = await cartManager.clearCart(cartId); 
                socketServer.emit('cart-cleared', { message: 'Carrito vaciado con éxito', cart: clearedCart });
            } catch (error) {
                socket.emit('error-message', { message: error.message }); 
            }
        });

        socket.on('sort-products', async ({ order }) => {
            try {
                const products = await productManager.getAll({ sort: order }); 
                socket.emit('products-list', { products: products.docs }); 
            } catch (error) {
                socket.emit('error-message', { message: error.message });
            }
        });
    });
};