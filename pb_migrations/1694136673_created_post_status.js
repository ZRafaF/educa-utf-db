/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "b8tl08gwhanvtbk",
    "created": "2023-09-08 01:31:13.345Z",
    "updated": "2023-09-08 01:31:13.345Z",
    "name": "post_status",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "4lbgmjsr",
        "name": "views",
        "type": "number",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": 0,
          "max": null,
          "noDecimal": true
        }
      }
    ],
    "indexes": [],
    "listRule": "",
    "viewRule": "",
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("b8tl08gwhanvtbk");

  return dao.deleteCollection(collection);
})
