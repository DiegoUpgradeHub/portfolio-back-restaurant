//Imports
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

//Importamos la conexion a la db y creación de la función para la conexión a la BBDD
const { connect } = require('./api/utils/connect.js');

// Express APIs
const user = require('./api/routes/user.routes');
const products = require('./api/routes/product.routes');

//Ejecutamos la funcion que conecta con la db
connect();

// Configuración de express
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cors());

// Aquí indicamos las rutas a usar
app.use('/public', express.static('public'));

app.use('/api', user)
app.use('/api', products)
app.use('/', (req, res, next) => {
    res.send('Place the right endpoint to find the data. ;)');
})

// Definimos el puerto desde el dotenv y si no lo hubiera el 4000
const port = process.env.PORT || 4000;
const server = app.listen(port, () => {
    console.log('Connected to port ' + port)
})

// Manejamos los errores
app.use((req, res, next) => {
    setImmediate(() => {
        next(new Error('Something went wrong'));
    });
});

app.use(function (err, req, res, next) {
    console.error(err.message);
    if (!err.statusCode) err.statusCode = 500;
    res.status(err.statusCode).send(err.message);
});