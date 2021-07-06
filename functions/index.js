const express = require('express');

const functions = require("firebase-functions");
const admin = require('firebase-admin');
const cors = require('cors');
const firebaseHelper = require('firebase-functions-helper')

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

    const inventory_item = await db.collection('inventory').add(item);
    let inventoryDocument = db.collection('inventory').doc(inventory_item.id)
    const doc = await inventoryDocument.get();

    if(!doc.exists){
        res.status(500).send("Internal Server Error")
    }else {
        res.json({ID: doc.id, Item : doc.data(), Message: "Successfully added to inventory"})
    }
})

app.put('/update/:itemId', async (req, res) => {

    let inventoryDocument = db.collection('inventory').doc(req.params.itemId)

    const updated_item = await inventoryDocument.update(req.body)
    
    //const updated_item = await firebaseHelper.firestore.updateDocument(db, 'inventory', req.params.itemId, req.body);

    const doc = await inventoryDocument.get();

    if(!doc.exists){
        res.status(500).send("Internal Server Error")
    }else {
        res.json({ID: doc.id, Item : doc.data(), Message: "Update Successful"})
    }

    
})




exports.inventoryAPI = functions.https.onRequest(app)
