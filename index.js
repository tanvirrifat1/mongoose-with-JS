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
        // const newProduct = new Product({
        //     title: req.body.title,
        //     price: req.body.price,
        //     description: req.body.description,
        // })
        const productData = await Product.insertMany([
            {
                title: "Redmi note8 pro",
                price: 14656,
                description: 'very smart and good looking phone'
            },
            {
                title: "Google pixel phone ",
                price: 784541,
                description: 'very useful phone'
            }
        ])
        res.status(201).send(productData)
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
})

Main()
