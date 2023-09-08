/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("b8tl08gwhanvtbk")

  // add
  collection.schema.addField(new SchemaField({
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
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("b8tl08gwhanvtbk")

  // remove
  collection.schema.removeField("0eo7wnhb")

  return dao.saveCollection(collection)
})
