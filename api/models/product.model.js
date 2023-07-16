//Requerir paquetes o librerias
const mongoose = require(`mongoose`);
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

//Creación del esquema de los productos
const productSchema = new Schema(
    {
        name: {
            type: String, 
            required: true,
            unique: true, //En este campo indicamos que solo puede haber un producto con este nombre
        },
        price: {
            type: Number, required: true 
        },
        ingredients: {
            type: String, required: true
        },
        image: { 
            type: String, required: true 
        },
        category: {
            type: String, required: true
        }
    },
    {
        collection: 'products',
    } 
);

//Le indicamos a través del campo unique en el Schema que nos lo valide gracias al plugin instalado y su mensaje al matchearlo si existiera
productSchema.plugin(uniqueValidator, { message: 'Ya existe un producto con este nombre.' });
module.exports = mongoose.model('Product', productSchema);