import express from 'express';
import routerProducts from './routes/product.router.js';
import routerCarts from './routes/cart.router.js';
import routerViewHome from './routes/home.view.router.js';
import { config as configHandlebars } from './config/handlebars.config.js';
import { config as configWesocket } from './config/websocket.config.js';
import { connectToDatabase } from "./config/mongoose.config.js";

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

configHandlebars(app);
connectToDatabase();

app.use('/api/public', express.static('./src/public'));
app.use('/', routerViewHome);
app.use('/api/products', routerProducts);
app.use('/api/carts', routerCarts);

app.use('*', (req, res) => {
    res.status(404).render('error404', { error: 'Not found' });
})

const httpServer = app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});

configWesocket(httpServer); 