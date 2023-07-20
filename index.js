const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

const PUBLISABLE_KEY = "pk_test_51NVwfyJYfAOHgc927UaDYGPJLyzGtD1tKsPJtS0WfjXFTUn9hHAAbQeJIbhmEXPdKsQRh19SSYkBWophCRmbvMSb00qPm0NmAI";
const SECRET_KEY = "sk_test_51NVwfyJYfAOHgc92MOn29rqXY3ZRzvipo1suxMXIZTM7kPgCrHJMOZCr2bKN2Fpny02NekmDO3yWqmB2WgNUmOJ0002j7NAUCt";
const stripe = require('stripe')(SECRET_KEY)

app.set("view engine", "ejs")

app.get('/', (req, res) => {
    res.render("Home", {
        key: PUBLISABLE_KEY
    })
})

app.post('/payment', (req, res) => {
    stripe.customers.create({
        email: req.body.stripeEmail,
        source: req.body.stripeToken,
        name: 'Gautam Sharma',
        address: {
            line1: "165 Choi East Attock",
            postal_code: "64300",
            city: "Attock",
            state: "Attock",
            country: "India"
        }
    })
    .then((customer) => {
        return stripe.charges.create({
            amount: 7000,
            description: "Web Development Product",
            currency: 'USD',
            customer: customer.id
        })
    })
    .then((charge) => {
        console.log(charge)
        res.send("Success")
    })
    .catch(error => {
        res.send(error)
    })
})

app.listen(PORT, () => {
    console.log(`App is listening on ${PORT}`)
})