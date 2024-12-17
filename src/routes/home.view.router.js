import ProductManager from "../managers/ProductManager.js";
import CartManager from "../managers/CartManager.js";
import { Router } from "express";

const router = Router();
const cartManager = new CartManager();
const productManager = new ProductManager();

router.get("/realTimeProducts", async (req, res) => {
    try {
        const { page = 1, limit = 10, sort } = req.query;
        const products = await productManager.getAll({ page, limit, sort });
        res.render("realTimeProducts", { 
            title: "Real Time", 
            products: products.docs, 
            pagination: {
                totalPages: products.totalPages,
                prevPage: products.prevPage,
                nextPage: products.nextPage,
                hasPrevPage: products.hasPrevPage,
                hasNextPage: products.hasNextPage,
                page: products.page,
                limit: products.limit
            }
        });
    } catch (error) {
        res.status(500).send(`<h1>Error</h1><h3>${error.message}</h3>`);
    }
});

router.get("/formNewProduct", async (req, res) => {
    try {
        res.render("formNewProduct", { title: "Formulario de Producto" });
    } catch (error) {
        res.status(500).send(`<h1>Error</h1><h3>${error.message}</h3>`);
    }
});

router.get("/products/:pid", async (req, res) => {
    try {
        const product = await productManager.getById(req.params.pid);
        res.render("productDetail", { title: "Detalle del Producto", product });
    } catch (error) {
        res.status(500).send(`<h1>Error</h1><h3>${error.message}</h3>`);
    }
});

router.post('/api/carts/create', async (req, res) => {
    try {
        const products = req.body.products || [];
        const newCart = await cartManager.createOne({ products });
        res.status(201).json({ status: 'success', payload: newCart });
    } catch (error) {
        res.status(500).send(`<h1>Error</h1><h3>${error.message}</h3>`);
    }
});

router.post('/api/carts/:cartId/add', async (req, res) => {
    try {
        const { cartId } = req.params;
        const { productId } = req.body;
        await cartManager.addProduct(cartId, productId);
        res.status(200).send('Producto agregado al carrito');
    } catch (error) {
        res.status(500).send(`<h1>Error</h1><h3>${error.message}</h3>`);
    }
});

router.post('/api/carts/:cartId/remove', async (req, res) => {
    try {
        const { cartId } = req.params;
        const { productId } = req.body;
        await cartManager.removeProduct(cartId, productId);
        res.status(200).send('Producto eliminado del carrito');
    } catch (error) {
        res.status(500).send(`<h1>Error</h1><h3>${error.message}</h3>`);
    }
});

router.get('/cart/:cartId', async (req, res) => {
    try {
        const { cartId } = req.params;
        const cart = await cartManager.getById(cartId);

        res.render('cart', { cartId, products: cart.products });
    } catch (error) {
        res.status(500).send(`<h1>Error</h1><h3>${error.message}</h3>`);
    }
});

export default router;