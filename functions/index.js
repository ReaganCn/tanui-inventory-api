const express = require("express");

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors");
const firebaseHelper = require("firebase-functions-helper");

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

// CREATE ITEM

app.post("/create", async (req, res) => {
  const item = {
    name: req.body.name,
    description: req.body.description,
    unitPrice: req.body.unitPrice,
    quantity: req.body.quantity,
  };

  const inventory_item = await db.collection("inventory").add(item);
  let inventoryDocument = db.collection("inventory").doc(inventory_item.id);
  const doc = await inventoryDocument.get();

  if (!doc.exists) {
    res.status(500).send("Internal Server Error");
  } else {
    res
      .status(200)
      .json({
        ID: doc.id,
        Item: doc.data(),
        Message: "Successfully added to inventory",
      });
  }
});

// UPDATE ITEM

app.put("/update/:itemId", async (req, res) => {
  let inventoryDocument = db.collection("inventory").doc(req.params.itemId);

  const updated_item = await inventoryDocument.update(req.body);

  const doc = await inventoryDocument.get();

  if (!doc.exists) {
    res.status(500).send("Internal Server Error");
  } else {
    res
      .status(200)
      .json({ ID: doc.id, Item: doc.data(), Message: "Update Successful" });
  }
});

// VIEW/GET ITEMS
app.get("/get", async (req, res) => {
  let inventoryCollection = db.collection("inventory");

  await inventoryCollection
    .get()
    .then((snapshot) => {
      const allDocuments = snapshot.docs.map((doc) => {
        return { id: doc.id, ...doc.data() };
      });
      res.status(200).send(allDocuments);
    })
    .catch((err) => res.status(500).send(err));
});

// DELETE AN ITEM

app.delete("/delete/:itemId", async (req, res) => {
  let inventoryDocument = db.collection("inventory").doc(req.params.itemId);

  await inventoryDocument.delete();

  res
    .status(200)
    .json({ ID: req.params.itemId, Message: "Deleted Successfully" });
});

exports.inventoryAPI = functions.https.onRequest(app);
