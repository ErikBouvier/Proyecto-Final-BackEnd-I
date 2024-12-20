import ErrorManager from './ErrorManager.js';
import ProductModel from '../models/product.model.js';
import { isValidId } from '../config/mongoose.config.js';
import { convertToBoolean } from '../utils/converter.js';

export default class ProductManager {
    #productModel;

    constructor() {
        this.#productModel = ProductModel;
    }


    async #findOneById(id) {
        if (!isValidId(id)) {
            throw new ErrorManager('Id de producto no válido', 400);
        }
        
        const product = await this.#productModel.findById(id);

        if (!product) {
            throw new ErrorManager('Id de producto no encontrado', 404);
        }
        return product;
    }

    async getAll(params){
        try {
            const $and = [];
            if (params?.title) $and.push({ title: { $regex: params.title, $options: 'i' } });
            const filters = $and.length > 0 ? { $and } : {};

            const sort = {
                asc: { title: 1 },
                desc: { title: -1 },
            };

            const paginationOptions = {
                limit: params?.limit || 10,
                page: params?.page || 1,
                sort: sort[params?.sort] ?? {},
            };

            return await this.#productModel.paginate(filters, paginationOptions);
        } catch (error) {
            throw ErrorManager.handleError(error);
        }
    }

    async getById(id){
        try {
            return await this.#findOneById(id);
        } catch (error) {
            throw ErrorManager.handleError(error);
        }
    }

    async createOne(data){
        try {
            const product = await this.#productModel.create({
                ...data,
                status: convertToBoolean(data.status),
            })
            
            return product;
        } catch (error){
            throw ErrorManager.handleError('error al cargar', error);
        }
    }

    async updateById(id, data){
        try {
            const product = await this.#findOneById(id);
            const newValues = {
                ...product,
                ...data,
                status: data.status ? convertToBoolean(data.status) : product.status,
            };

            product.set(newValues);
            product.save();

            return product;
        } catch (error) {
            throw ErrorManager.handleError(error);
        }
    } 
    
    async deleteById(id) {
        try {
            const product = await this.#findOneById(id);
            await product.deleteOne();
        } catch (error) {
            throw ErrorManager.handleError(error);
        }
    }
}

