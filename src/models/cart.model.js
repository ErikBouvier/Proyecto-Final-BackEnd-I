import { Schema, model } from "mongoose";
import paginate from "mongoose-paginate-v2";

const cartSchema = new Schema({
    products: [
        {
            product: {
                type: Schema.Types.ObjectId,
                ref: "products",
                required: [true, 'El nombre del producto es obligatorio'],
            },
            quantity: {
                type: Number,
                required: [true, 'La cantidad de productos es obligatoria'],
                min: [1, 'La cantidad no puede ser menor a 1'],
            },
            _id: false,
        },
    ],
}, {
    timestamps: true,
    versionKey: false,
});

cartSchema.plugin(paginate);

const CartModel = model('cart', cartSchema);

export default CartModel;