migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ahiavlp804n7ncg")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "gl3kx9hz",
    "name": "posts",
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
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ahiavlp804n7ncg")

  // update
  collection.schema.addField(new SchemaField({
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
  }))

  return dao.saveCollection(collection)
})
