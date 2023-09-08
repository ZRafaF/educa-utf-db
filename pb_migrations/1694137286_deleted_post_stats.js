/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("b8tl08gwhanvtbk");

  return dao.deleteCollection(collection);
}, (db) => {
  const collection = new Collection({
    "id": "b8tl08gwhanvtbk",
    "created": "2023-09-08 01:31:13.345Z",
    "updated": "2023-09-08 01:34:05.868Z",
    "name": "post_stats",
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
      },
      {
        "system": false,
        "id": "0eo7wnhb",
        "name": "post",
        "type": "relation",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "bh63i50xs13bm6p",
          "cascadeDelete": true,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": null
        }
      },
      {
        "system": false,
        "id": "yfftna0i",
        "name": "liked_by",
        "type": "relation",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "_pb_users_auth_",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": null,
          "displayFields": null
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
})
