import { connect, Types } from "mongoose";

export const connectToDatabase = async () => {
    const URL = 'mongodb+srv://pablo15:pablo15@pablobb.n3iax.mongodb.net/ProyectoFinal';

    try {
        await connect(URL);
        console.log('Conectado a la base de datos');
    } catch (error) {
        console.log('Error al conectar a la base de datos');
    }
};

export const isValidId = (id) => {
    return Types.ObjectId.isValid(id);
}