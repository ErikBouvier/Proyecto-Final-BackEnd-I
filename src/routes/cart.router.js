import {  Router } from 'express';
import CartManager from '../managers/CartManager.js';

const router = Router();
const cartManager = new CartManager();

router.post('/', async (req, res) => {
    try {
        const cart = await cartManager.createOne(req.body);
        res.status(201).json({ status: 'success', payload: cart });
    } catch (error) {
        res.status(error.status || 500).json({ status: 'error', message: error.message });
    }
});

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

router.delete('/:pid', async (req, res) => {
    try {
        await cartManager.deleteById(req.params.pid);
        res.status(200).json({ status: 'success' });
    } catch (error) {
        res.status(error.status || 500).json({ status: 'error', message: error.message });
    }
})



export default router;