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
        required: [true, 'product title is required'],
        minLength: [5, 'required minimum 5 character'],
        maxLength: [15, 'required maximum 15 character'],

    },
    price: {
        type: Number,
        required: true
    },
    raiting: {
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
            raiting: req.body.raiting,
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
        const price = req.query.price
        const raiting = req.query.raiting
        let products

        if (price && raiting) {
            products = await Product.find({
                $and: [{ price: { $gt: price } }, { raiting: { $gt: raiting } }]
            })
        } else {
            products = await Product.find()
        }

        if (products) {
            res.status(200).send({
                success: true,
                message: 'return all product',
                data: products
            })
        } else {
            f
            res.status(404).send({
                success: false,
                message: 'products not found'
            })
        }
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
})

app.delete('/products/:id', async (req, res) => {
    try {
        const id = req.params.id
        const product = await Product.deleteOne({ _id: id })

        if (product) {
            res.status(200).send({
                success: true,
                message: 'deleted single product',
                data: product
            })
        } else {
            res.status(404).send({
                success: false,
                message: 'products not delete'
            })
        }


    } catch (error) {
        res.status(404).send({ message: error.message })
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

app.put("/products/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const updatedProduct = await Product.findByIdAndUpdate({ _id: id }, {
            $set: {
                title: req.body.title,
                price: req.body.price,
                description: req.body.description,
                raiting: req.body.raiting
            }
        }, { new: true }
        )

        if (updatedProduct) {
            res.status(200).send({
                success: true,
                message: 'updated single product',
                data: updatedProduct
            })
        } else {
            res.status(404).send({
                success: false,
                message: 'products not not updated'
            })
        }

    } catch (error) {
        res.status(404).send({ message: error.message })
    }
})

Main()
