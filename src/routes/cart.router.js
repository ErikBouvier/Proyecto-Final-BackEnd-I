import {  Router } from 'express';
import CartManager from '../managers/CartManager.js';

const router = Router();
const cartManager = new CartManager();


router.get('/', async (req, res) => {
    try {
        const carts = await cartManager.getAll(req.query);
        res.status(200).json({ status: 'success', payload: carts });
    } catch (error) {
        res.status(error.status || 500).json({ status: 'error', message: error.message });
    }
});

router.get('/:cid', async (req, res) => {
    try {
        const cart = await cartManager.getById(req.params.cid);
        res.status(200).json({ status: 'success', payload: cart });
    } catch (error) {
        res.status(error.status || 500).json({ status: 'error', message: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const cart = await cartManager.createOne(req.body);
        res.status(201).json({ status: 'success', payload: cart });
    } catch (error) {
        res.status(error.status || 500).json({ status: 'error', message: error.message });
    }
});

router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;
        const cart = await cartManager.addProduct(cid, pid, quantity || 1);
        res.status(200).json({ status: 'success', payload: cart });
    } catch (error) {
        res.status(error.status || 500).json({ status: 'error', message: error.message });
    }
});

router.put('/:cid', async (req, res) => {
    try {
        const cart = await cartManager.updateById(req.params.cid, req.body);
        res.status(200).json({ status: 'success', payload: cart });
    } catch (error) {
        res.status(error.status || 500).json({ status: 'error', message: error.message });
    }
});

router.put('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;
        const cart = await cartManager.updateQuantity(cid, pid, quantity);
        res.status(200).json({ status: 'success', payload: cart });
    } catch (error) {
        res.status(error.status || 500).json({ status: 'error', message: error.message });
    }
});

router.delete('/:cid', async (req, res) => {
    try {
        await cartManager.deleteById(req.params.cid);
        res.status(200).json({ status: 'success' });
    } catch (error) {
        res.status(error.status || 500).json({ status: 'error', message: error.message });
    }
})

router.delete('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const cart = await cartManager.removeProduct(cid, pid);
        res.status(200).json({ status: 'success', payload: cart });
    } catch (error) {
        res.status(error.status || 500).json({ status: 'error', message: error.message });
    }
});

router.delete('/:cid/products', async (req, res) => {
    try {
        const cart = await cartManager.clearCart(req.params.cid);
        res.status(200).json({ status: 'success', payload: cart });
    } catch (error) {
        res.status(error.status || 500).json({ status: 'error', message: error.message });
    }
});



export default router;