# Tanui Industries Inventory API

## About the project
A basic CRUD api with HTTP endpoints to create, update, delete and get inventory.

## Technologies
- NodeJs(Express)
- Firebase DB
- Firebase cloud functions

## Usage

link: https://us-central1-tanui-inventory-api.cloudfunctions.net/inventoryAPI/ <endpoints>

### CREATE 
https://us-central1-tanui-inventory-api.cloudfunctions.net/inventoryAPI/create/

Submit a json object with the below fields on this endpoint to create an inventory item  
```sh
  {
        "name": "Item 1",
        "description": "Sample Description",
        "unitPrice": 500.00,
        "quantity": 20
}
```
### UPDATE
 https://us-central1-tanui-inventory-api.cloudfunctions.net/inventoryAPI/update/<inventory_item_id>
  Submit a json object (and modify any field) to this endpoint and specify the item to be updated
  
  ```sh
  {
   "description": "Changed Description",
  }
```
