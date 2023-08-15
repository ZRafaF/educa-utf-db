migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("bh63i50xs13bm6p")

  // remove
  collection.schema.removeField("e5ru9p73")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "w6b4mddo",
    "name": "document",
    "type": "file",
    "required": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "maxSize": 5242880,
      "mimeTypes": [
        "text/plain"
      ],
      "thumbs": [],
      "protected": false
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("bh63i50xs13bm6p")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "e5ru9p73",
    "name": "document_url",
    "type": "url",
    "required": false,
    "unique": false,
    "options": {
      "exceptDomains": null,
      "onlyDomains": null
    }
  }))

  // remove
  collection.schema.removeField("w6b4mddo")

  return dao.saveCollection(collection)
})
