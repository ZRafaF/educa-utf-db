/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("rsfdgabpnxudduu")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ct7jbfnh",
    "name": "description",
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
  const collection = dao.findCollectionByNameOrId("rsfdgabpnxudduu")

  // remove
  collection.schema.removeField("ct7jbfnh")

  return dao.saveCollection(collection)
})
