//Requerir paquetes/librerías
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const router = express.Router();
const authorize = require("../utils/auth.middleware")
const { check, validationResult } = require('express-validator');

//Requerir modelos
// const userSchema = require("../models/user.model");
const userModel = require(`../models/user.model`);

// Registrar usuario
router.post("/users/signup",
    [
        check('name')
            .not()
            .isEmpty()
            .isLength({ min: 3 })
            .withMessage('El nombre debe tener al menos 3 caracteres.'),
        check('email', 'Email is required')
            .not()
            .isEmpty(),
        check('password', 'Contraseña debe contener de 5 a 8 caracteres.')
            .not()
            .isEmpty()
            .isLength({ min: 5, max: 8 })
    ],
    (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).jsonp(errors.array());
        }
        else {
            bcrypt.hash(req.body.password, 10).then((hash) => {
                const user = new userSchema({
                    name: req.body.name,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    password: hash,
                    role: req.body.role
                });
                user.save().then((response) => {
                    res.status(201).json({
                        message: "¡Usuario creado con éxito!",
                        result: response
                    });
                }).catch(error => {
                    res.status(500).json({
                        message: "¡Ha ocurrido un error!",
                        error: error
                    });
                });
            });
        }
    });


// Iniciar sesión
router.post("/users/signin", (req, res, next) => {
    let getUser;
    userSchema.findOne({
        email: req.body.email
    }).then(user => {
        if (!user) {
            return res.status(401).json({
                message: "Fallo en el usuario."
            });
        }
        getUser = user;
        return bcrypt.compare(req.body.password, user.password);
    }).then(response => {
        if (!response) {
            return res.status(401).json({
                message: "Fallo en la respuesta."
            });
        }
        let jwtToken = jwt.sign({
            email: getUser.email,
            userId: getUser._id
        }, "longer-secret-is-better", {
            expiresIn: "8h"
        });
        res.status(200).json({
            token: jwtToken,
            expiresIn: 28800,
            _id: getUser._id
        });
    }).catch(err => {
        return res.status(401).json({
            message: "Fallo en la autentificación."
        });
    });
});

// Obtener todos los usuarios
router.get('/users', async (req, res, next) => {
    try {
        const users = await userModel.find();
        return res.status(200).json(users)
    } catch (err) {
        return next(err);
    }
})

// Obtener usuarios por rol
router.get('/users/role/:role', authorize, async (req, res, next) => {
    const { role } = req.params;
    try {
        const userByRole = await userModel.find({ role });
        return res.status(200).json(userByRole);
    } catch (err) {
        return next(err);
    }
})

// Obtener usuarios por nombre
router.get('/users/name/:name', authorize, async (req, res, next) => {
    const { name } = req.params;
    try {
        const userByName = await userModel.find({ name });
        return res.status(200).json(userByName);
    } catch (err) {
        return next(err);
    }
})

// Obtener usuarios por ID
router.get('/users/id/:_id', authorize, async (req, res, next) => {
    const { _id } = req.params;
    try {
        const userById = await userModel.findById({ _id });
        return res.status(200).json(userById);
    } catch (err) {
        return next(err);
    }
})

// Editar usuario
router.put('/users/edit/:id', authorize , async (req, res, next) => {
    try {
        const { id } = req.params
        const userModify = new userModel(req.body)
        userModify._id = id
        const userUpdated = await userModel.findByIdAndUpdate(id , userModify)
        // return res.status(200).json(userUpdated)
        return res.status(200).json({
            message: "¡Usuario actualizado con éxito!",
            old_data: userUpdated
        });
    } catch (err) {
        return next(err)
    }
})

// Eliminar usuario
router.delete('/users/delete/:id', authorize , async (req, res, next) => {
    try {
        const { id } = req.params;
        const userDeleted = await userModel.findByIdAndDelete(id);
        return res.status(200).json({
            message: "¡Usuario eliminado con éxito!",
            data: userDeleted
        });
    } catch (err) {
        return next(err);
    }
});

module.exports = router;