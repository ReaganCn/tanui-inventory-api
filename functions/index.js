const express = require("express");

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors");

admin.initializeApp();
const app = express();
const db = admin.firestore();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CREATE ITEM

app.post("/create", async (req, res) => {

  try {
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
  }catch (error){
      res.send("Failed to add a new inventory item. Confirm that you are submitting the correct fields as defined on Github.")
  }
  
});

// UPDATE ITEM

app.put("/update/:itemId", async (req, res) => {
  let inventoryDocument = db.collection("inventory").doc(req.params.itemId);

  try{
    const updated_item = await inventoryDocument.update(req.body);

    const doc = await inventoryDocument.get();
  
    if (!doc.exists) {
      res.status(500).send("Internal Server Error");
    } else {
      res
        .status(200)
        .json({ ID: doc.id, Item: doc.data(), Message: "Update Successful" });
    }
  } catch(error){
      res.send("Update failed. Please use a valid Id")
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

  try{
    await inventoryDocument.delete();

    res
      .status(200)
      .json({ ID: req.params.itemId, Message: "Deleted Successfully" });
  }catch (error){
    res.send("Delete failed. Please use a valid Id")
  }

});

exports.inventoryAPI = functions.https.onRequest(app);
