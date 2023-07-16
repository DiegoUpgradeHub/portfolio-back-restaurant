//Requerir paquetes o librerias
const express = require(`express`);
const router = express.Router();
const authorize = require("../utils/auth.middleware")

//Requerir modelos
const Product = require(`../models/product.model`);

//Obtener todas los productos
router.get('/products', async (req, res, next) => {
	try {
		const products = await Product.find();
		return res.status(200).json(products)
	} catch (err) {
		return next(err);
	}
});

//Obtener productos por categoría
router.get('/products/category/:category', async (req, res, next) => {
	const { category } = req.params;

	try {
		const productByCategory = await Product.find({ category });
		return res.status(200).json(productByCategory);
	} catch (err) {
		return next(err);
	}
});

//Obtener productos por nombre
router.get('/products/name/:name', async (req, res, next) => {
	const { name } = req.params;

	try {
		const productByName = await Product.find({ name });
		return res.status(200).json(productByName);
	} catch (err) {
		return next(err);
	}
});

//Crear nuevo producto
router.post('/products/create', async (req, res, next) => {
    try {
        const newProduct = new Product({
            name: req.body.name,
            price: req.body.price,
            ingredients: req.body.ingredients,
            image: req.body.image,
            category: req.body.category
        });

        const createdProduct = await newProduct.save();
        return res.status(201).json(createdProduct);
    } catch (err) {
        return next(err);
    }
});

//Eliminar producto por id
router.delete('/products/delete/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const productDeleted = await Product.findByIdAndDelete(id);
        return res.status(200).json(productDeleted);
    } catch (err) {
        return next(err);
    }
});

//Editar producto por id
router.put('/products/edit/:id', async (req, res, next) => {
    try {
        const { id } = req.params 
        const productModify = new Product(req.body) 
        productModify._id = id 
        const productUpdated = await Product.findByIdAndUpdate(id , productModify)
        return res.status(200).json(productUpdated)
    } catch (err) {
        return next(err)
    }
});

module.exports = router;