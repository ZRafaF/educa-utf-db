migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("_pb_users_auth_")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "uc9ve2gc",
    "name": "favorite_posts",
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

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "w74petkd",
    "name": "favorite_chapters",
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
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "quluyrsj",
    "name": "uploaded_images",
    "type": "relation",
    "required": false,
    "unique": false,
    "options": {
      "collectionId": "2zuy20mt429f5t5",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": null,
      "displayFields": []
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("_pb_users_auth_")

  // remove
  collection.schema.removeField("uc9ve2gc")

  // remove
  collection.schema.removeField("w74petkd")

  // remove
  collection.schema.removeField("quluyrsj")

  return dao.saveCollection(collection)
})
