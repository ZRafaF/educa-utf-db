migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("1vukysxjzlvqo5s")

  // update
  collection.schema.addField(new SchemaField({
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
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("1vukysxjzlvqo5s")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "e1qg9mu0",
    "name": "field",
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
  }))

  return dao.saveCollection(collection)
})
