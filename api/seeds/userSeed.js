//Requerir paquetes y librerias
const mongoose = require(`mongoose`);

//Conexión con Atlas
const dotenv = require("dotenv");
dotenv.config();
const mongoDb = process.env.MONGO_DB;

//Requerir los modelos
const User = require(`../models/user.model`);

//Creación del listado semilla
const users = [
    {
        name: "Diego",
        lastName: "Pérez",
        email: "diego@email.com",
        password: "abcdabcd", //Esta contraseña no está Hasheada
        role: "admin",
    }
];
const userDocuments = users.map(user => new User(user));
mongoose.set('strictQuery', true);
mongoose
    .connect(mongoDb, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(async () => {
        const allUsers = await User.find();
        if (allUsers.length) {
        await User.collection.drop();
        }
    })
    .catch((err) => console.log(`Error deleting data: ${err}`))
    .then(async () => {
            await User.insertMany(userDocuments);
        console.log('Database Created')
        })
    .catch((err) => console.log(`Error creating data: ${err}`))
    .finally(() => mongoose.disconnect());