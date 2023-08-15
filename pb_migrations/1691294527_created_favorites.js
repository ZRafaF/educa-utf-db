migrate((db) => {
  const collection = new Collection({
    "id": "ahiavlp804n7ncg",
    "created": "2023-08-06 04:02:07.917Z",
    "updated": "2023-08-06 04:02:07.917Z",
    "name": "favorites",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "q2ocf6ip",
        "name": "user",
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
        "id": "gl3kx9hz",
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
        "id": "8li6gq8n",
        "name": "chapters",
        "type": "relation",
        "required": false,
        "unique": false,
        "options": {
          "collectionId": "rsfdgabpnxudduu",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": null,
          "displayFields": []
        }
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
  const collection = dao.findCollectionByNameOrId("ahiavlp804n7ncg");

  return dao.deleteCollection(collection);
})
