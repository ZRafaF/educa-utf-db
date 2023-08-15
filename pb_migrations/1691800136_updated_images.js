migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("2zuy20mt429f5t5")

  // remove
  collection.schema.removeField("lydgjt4k")

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("2zuy20mt429f5t5")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "lydgjt4k",
    "name": "cration",
    "type": "date",
    "required": false,
    "unique": false,
    "options": {
      "min": "",
      "max": ""
    }
  }))

  return dao.saveCollection(collection)
})
