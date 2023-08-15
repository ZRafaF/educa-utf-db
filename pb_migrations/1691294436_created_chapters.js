migrate((db) => {
  const collection = new Collection({
    "id": "rsfdgabpnxudduu",
    "created": "2023-08-06 04:00:36.534Z",
    "updated": "2023-08-06 04:00:36.534Z",
    "name": "chapters",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "9fjgwwly",
        "name": "title",
        "type": "text",
        "required": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "eunoapnw",
        "name": "pages",
        "type": "relation",
        "required": false,
        "unique": false,
        "options": {
          "collectionId": "bh63i50xs13bm6p",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": null,
          "displayFields": []
        }
      },
      {
        "system": false,
        "id": "11kqmby7",
        "name": "creator",
        "type": "relation",
        "required": false,
        "unique": false,
        "options": {
          "collectionId": "_pb_users_auth_",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": []
        }
      },
      {
        "system": false,
        "id": "go9twzt6",
        "name": "rating",
        "type": "number",
        "required": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null
        }
      },
      {
        "system": false,
        "id": "pkpjrn3x",
        "name": "visible",
        "type": "bool",
        "required": false,
        "unique": false,
        "options": {}
      }
    ],
    "indexes": [],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("rsfdgabpnxudduu");

  return dao.deleteCollection(collection);
})
