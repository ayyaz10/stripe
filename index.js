require('dotenv').config() // load all envoirnment variables
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json())
app.use(express.static("public"))

const PUBLISABLE_KEY = "pk_test_51NVwfyJYfAOHgc927UaDYGPJLyzGtD1tKsPJtS0WfjXFTUn9hHAAbQeJIbhmEXPdKsQRh19SSYkBWophCRmbvMSb00qPm0NmAI";
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY)


const storeItems = new Map([
    [1, {priceInCents: 10000, name: "Productivity course"}],
    [2, {priceInCents: 30000, name: "Communication skill course"}]
])

app.post('/create-checkout-session', async (req, res) => {
    // console.log(req.body.items)
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items: req.body.items.map(item => {
                const storeItem = storeItems.get(item.id)
                console.log(storeItem)
                return {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: storeItem.name
                        },
                        unit_amount: storeItem.priceInCents
                    },
                    quantity: item.quantity
                }
            }),
            success_url: `${process.env.SERVER_URL}/success.html`,
            cancel_url: `${process.env.SERVER_URL}/cancel.html`
        })
        res.json({url: session.url})
    } catch (e) {
        res.status(500).json({error: e.message})
    }
})

app.listen(PORT, () => {
    console.log(`App is listening on ${PORT}`)
})