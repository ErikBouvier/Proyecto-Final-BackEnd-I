import { Schema, model } from "mongoose";
import paginate from "mongoose-paginate-v2";

const productSchema = new Schema({
    title: {
        index: { name: 'idx_title' },
        type: String,
        required: [true, 'Nombre obligatorio'],
        uppercase: true,
        minLength: [5, 'El nombre debe tener al menos 5 caracteres'],
        maxLength: [50, 'El nombre no puede superar los 50 caracteres']
    },
    description: {
        type: String,
        required: [true, 'El estado es obligatorio']
    },
    code: {
        type: String,
        required: [true, 'El código es obligatorio'],
        unique: true,
    },
    price: {
        type: Number,
        required: [true, 'El precio es obligatorio'],
        min: [0, 'El precio no puede ser menor a 0']
    },
    status: {
        type: Boolean,
        required: [true, 'El estado es obligatorio'],
    },
    stock: {
        type: Number,
        required: [true, 'El stock es obligatorio'],
        min: [0, 'El stock no puede ser menor a 0']
    },
    category: {
        index: { name: 'idx_category' },
        type: String,
        required: [true, 'La categoría es obligatoria'],
    },
    thumbnail: {
        type: String,
        trim: true, 
    },
}, {
    timestamps: true,
    versionKey: false,
});

productSchema.plugin(paginate);

const ProductModel = model('products', productSchema);

export default ProductModel;