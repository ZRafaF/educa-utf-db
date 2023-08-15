migrate((db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("1vukysxjzlvqo5s");

  return dao.deleteCollection(collection);
}, (db) => {
  const collection = new Collection({
    "id": "1vukysxjzlvqo5s",
    "created": "2023-08-12 00:03:17.629Z",
    "updated": "2023-08-12 00:04:57.561Z",
    "name": "posts_content",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "e1qg9mu0",
        "name": "img_name",
        "type": "file",
        "required": false,
        "unique": false,
        "options": {
          "maxSelect": 1,
          "maxSize": 5242880,
          "mimeTypes": [
            "image/jpeg",
            "image/png",
            "image/vnd.mozilla.apng"
          ],
          "thumbs": [],
          "protected": false
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
})
