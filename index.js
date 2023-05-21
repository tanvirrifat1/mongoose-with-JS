const express = require('express')
const mongoose = require("mongoose")
const app = express()
const port = 5000

// create schema
const productSchema = new mongoose.Schema({
    title: String,
    price: Number,
    description: String,
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


app.get('/', (req, res) => {
    res.send('Hello World!')
})

Main()
