migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("bh63i50xs13bm6p")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "vxgzjm0z",
    "name": "tags",
    "type": "text",
    "required": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("bh63i50xs13bm6p")

  // remove
  collection.schema.removeField("vxgzjm0z")

  return dao.saveCollection(collection)
})
