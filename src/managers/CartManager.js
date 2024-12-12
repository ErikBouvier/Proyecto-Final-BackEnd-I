import ErrorManager from "./ErrorManager.js";
import CartModel from "../models/cart.model.js";
import { isValidId } from "../config/mongoose.config.js";


export default class CartManager {
    #cartModel;

    constructor() {
        this.#cartModel = CartModel;
    }

    async #findOneById(id) {
        if (!isValidId(id)) {
            throw new ErrorManager("Id de carrito no válido", 400);
        }

        const cart = await this.#cartModel.findById(id).populate('products.product');

        if (!cart) {
            throw new ErrorManager("Id de carrito no encontrado", 404);
        }
        return cart;
    }

    async getAll(params) {
        try {
            const paginationOptions = {
                limit: params?.limit || 10,
                page: params?.page || 1,
                populate: 'products.product',
                lean: true,
            };

            return await this.#cartModel.paginate({}, paginationOptions);

        } catch (error) {
            throw ErrorManager.handleError(error);
        }
    }

    async getById(id) {
        try {
            return await this.#findOneById(id);
        } catch (error) {
            throw ErrorManager.handleError(error);
        }
    }

    async createOne(data) {
        try {
            const cart = await this.#cartModel.create(data);
            return cart;
        } catch (error) {
            throw ErrorManager.handleError(error);
        }
    }

    async addProduct(id, productId) {
        try {
            const cart = await this.#findOneById(id);
            const productIndex = cart.products.findIndex((item) => item.product._id.toString() === productId)

            if (productIndex >= 0) {
                cart.products[productIndex].quantity++;
            } else {
                cart.products.push({ product: productId, quantity: 1 });
            }

            await cart.save();

            return cart;
        } catch (error) {
            throw new ErrorManager(error.message, error.code);
        }
    }

    async removeProduct(cartId, productId) {
        try {
            const cart = await this.getById(cartId);
            const initialLength = cart.products.length;
            cart.products = cart.products.filter((item) => item.product._id.toString() !== productId);

            if (cart.products.length === initialLength) {
                throw new ErrorManager(`El producto con Id ${productId} no existe en el carrito`, 404);
            }

            await cart.save();
            return cart;
        } catch (error) {
            throw ErrorManager.handleError(error);
        }
    }

    async deleteById(id) {
        try {
            const cart = await this.#findOneById(id);
            if (!cart) {
                throw new Error(`El carrito de Id ${id} no existe`, 404);
            }
    
            await cart.deleteOne();
    
        } catch (error) {
            throw ErrorManager.handleError(error);
        }
    }
}