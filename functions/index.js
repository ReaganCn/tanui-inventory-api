const express = require('express');

const functions = require("firebase-functions");
const admin = require('firebase-admin');
const cors = require('cors');

admin.initializeApp();
const app = express();
const db = admin.firestore();


// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.post('/create', async (req, res) => {
    const item = {
        name: req.body.name,
        description: req.body.description,
        unitPrice: req.body.unitPrice,
        quantity: req.body.quantity
    }
    const inventory_item = await db.collection('inventory').add(item)

    res.json({message: `${item.name} added to inventory!`})
})



exports.inventoryAPI = functions.https.onRequest(app)
