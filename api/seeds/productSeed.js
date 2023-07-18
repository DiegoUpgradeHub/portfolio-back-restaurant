//Requerir paquetes y librerias
const mongoose = require(`mongoose`);

//Conexión con Atlas
const dotenv = require("dotenv");
dotenv.config();
const mongoDb = process.env.MONGO_DB;

//Requerir los modelos
const Product = require(`../models/product.model`);

//Creación del listado semilla
const products = [
    {
        name: "roasted beet salad",
        price: 9.50,
        ingredients: "A roasted beet salad tossed with roasted carrots and a chèvre green goddess dressing that’s as colorful as it is delectable.",
        image: "https://www.tasteofhome.com/wp-content/uploads/2018/01/Warm-Roasted-Beet-Salad_EXPS_TGCBBZ17_40612_B05_10_1b-4.jpg",
        category: "salats",
    },
    {
        name: "couscous salad",
        price: 9.50,
        ingredients: "with fresh parsley, mint, spring onions & tomatoes.",
        image: "https://wholefoodsoulfoodkitchen.com/wp-content/uploads/2022/08/vegan-couscous-salad-recipe-1.jpg",
        category: "salats",
    },
    {
        name: "falafel plate",
        price: 13.50,
        ingredients: "with salad bouquet, hummus, wedges and garlic yoghurt dip.",
        image: "https://thefastrecipe.com/wp-content/uploads/2022/02/falafel-plate.jpg",
        category: "main",
    },
    {
        name: "curried roast vegetables",
        price: 13.50,
        ingredients: "Seasonal vegetables in coconut curry sauce, served with basmati rice.",
        image: "https://www.justonecookbook.com/wp-content/uploads/2020/02/Vegetarian-Curry-4400-II.jpg",
        category: "main",
    },
    {
        name: "home burger",
        price: 13.50,
        ingredients: "fried zucchini slices, red onions, tomatoes, pickles and vegan cocktail sauce, served with wedges, ketchup & vegan mayo.",
        image: "https://images.eatsmarter.de/sites/default/files/styles/576x432/public/veganer-linsen-burger-655181.jpg",
        category: "main",
    },
    {
        name: "lentils soup",
        price: 13.50,
        ingredients: "made with mostly pantry ingredients but includes hearty greens and a squeeze of lemon for bright, fresh flavor.",
        image: "https://mymoorishplate.com/wp-content/uploads/2019/03/Lentil-Soup-1-500x500.jpg",
        category: "main",
    }
];
const productDocuments = products.map(product => new Product(product));
mongoose.set('strictQuery', true);
mongoose
    .connect(mongoDb, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(async () => {
        const allProducts = await Product.find();
        if (allProducts.length) {
        await Product.collection.drop();
        }
    })
    .catch((err) => console.log(`Error deleting data: ${err}`))
    .then(async () => {
            await Product.insertMany(productDocuments);
        console.log('Database Created')
        })
    .catch((err) => console.log(`Error creating data: ${err}`))
    .finally(() => mongoose.disconnect());