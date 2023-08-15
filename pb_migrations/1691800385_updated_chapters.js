migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("rsfdgabpnxudduu")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "11kqmby7",
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
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("rsfdgabpnxudduu")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "11kqmby7",
    "name": "creator",
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
  }))

  return dao.saveCollection(collection)
})
