const express = require('express')
const mongoose = require("mongoose")
const app = express()
const port = 5000

// middleWare
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// create schema
const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    createdAr: {
        type: Date,
        default: Date.now
    }
})

// create model
const Product = mongoose.model("Products", productSchema)

// mongoose connection
async function Main() {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/TestPracticeDB");
        console.log("Database connection successfully");

        app.listen(port, () => {
            console.log(`Example app listening on port ${port}`)
        })
    } catch (err) {
        console.log(`failed to connect database`, err);
    }
}

// all API are here
app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.post('/products', async (req, res) => {
    try {
        const newProduct = new Product({
            title: req.body.title,
            price: req.body.price,
            description: req.body.description,
        })
        const productData = await newProduct.save()
        res.status(201).send(productData)
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
})

app.get('/products', async (req, res) => {
    try {
        const products = await Product.find()
        if (products) {
            res.status(200).send({
                success: true,
                message: 'return all product',
                data: products
            })
        } else {
            res.status(404).send({
                success: false,
                message: 'products not found'
            })
        }
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
})

app.get('/products/:id', async (req, res) => {
    try {
        const id = req.params.id
        const product = await Product.findOne({ _id: id })
        if (product) {
            res.status(200).send({
                success: true,
                message: 'return single product',
                data: product
            })
        } else {
            res.status(404).send({
                success: false,
                message: 'products not found'
            })
        }
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
})

Main()
