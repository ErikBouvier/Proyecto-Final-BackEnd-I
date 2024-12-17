import ErrorManager from "./ErrorManager.js";
import CartModel from "../models/cart.model.js";
import { Types } from "mongoose";
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
        const cart = await this.#cartModel.findById(id);

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
            };

            return await this.#cartModel.paginate({}, paginationOptions);

        } catch (error) {
            throw ErrorManager.handleError(error);
        }
    }

    async getById(id) {
        try {
            const cart = await this.#cartModel.findById(id).populate('products.product');
            if (!cart) {
                throw new ErrorManager("Carrito no encontrado", 404);
            }
            return cart;
        } catch (error) {
            throw ErrorManager.handleError(error);
        }
    }

    async createOne(data) {
        try {
            const cart = await this.#cartModel.create(data);
            return await this.getById(cart._id);

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
            return await this.getById(id);
        } catch (error) {
            throw new ErrorManager(error.message, error.code);
        }
    }

    async updateById(id, data) {
        try {
            const cart = await this.getById(id);
            data.products.forEach(newProduct => {
                const productIndex = cart.products.findIndex((item) => item.product._id.toString() === Types.ObjectId(productIndex).toString());

                if (productIndex >= 0) {
                    cart.products[productIndex].quantity += newProduct.quantity;
                } else {
                    cart.products.push({ product: newProduct.product, quantity: newProduct.quantity });
                }
            });
            
            await cart.save();
            return await this.getById(id); 
        } catch (error) {
            throw ErrorManager.handleError(error);
        }
    }
    
    async updateQuantity(cartId, productId, quantity) {
        try {
            const cart = await this.getById(cartId);
            const productIndex = cart.products.findIndex((item) => item.product._id.toString() === productId);

            if (productIndex >= 0) {
                cart.products[productIndex].quantity = quantity;
                await cart.save();
                return cart;
            } else {
                throw new ErrorManager(`El producto con Id ${productId} no existe en el carrito`, 404);
            }
        } catch (error) {
            throw ErrorManager.handleError(error);
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
            return await this.getById(id);

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

    async clearCart(cartId) {
        try {
            const cart = await this.getById(cartId);
            cart.products = [];
            await cart.save();
            return await this.getById(id);

        } catch (error) {
            throw ErrorManager.handleError(error);
        }
    }
}
