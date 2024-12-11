import { Router } from 'express';
import ProductManager from '../managers/ProductManager.js';
import uploader from '../utils/uploader.js';

const router = Router();
const productManager = new ProductManager();

router.get('/', async (req, res) => {
    try {
        const products = await productManager.getAll(req.query);
        res.status(200).json({ status: 'success', payload: products });
    } catch (error) {
        res.status(error.status || 500).json({ status: 'error', message: error.message });
    }
});

router.get('/:pid', async (req, res) => {
    try {
        const product = await productManager.getById(req.params.pid);
        res.status(200).json({ status: 'success', payload: product });
    } catch (error) {
        res.status(error.status || 500).json({ status: 'error', message: error.message });
    }
});

router.post('/', uploader.single('image'), async (req, res) => {
    try {
        const product = await productManager.createOne(req.body, req.file);
        res.status(201).json({ status: 'success', payload: product });
    } catch (error) {
        res.status(error.status || 500).json({ status: 'error', message: error.message });
    }
});

router.put('/:pid', uploader.single('image'), async (req, res) => {
    try {
        const product = await productManager.updateById(req.params.pid, req.body, req.file);
        res.status(200).json({ status: 'success', payload: product });
    } catch (error) {
        res.status(error.status || 500).json({ status: 'error', message: error.message });
    }
});

router.delete('/:pid', async (req, res) => {
    try {
        await productManager.deleteById(req.params.pid);
        res.status(200).json({ status: 'success' });
    } catch (error) {
        res.status(error.status || 500).json({ status: 'error', message: error.message });
    }
})

export default router;