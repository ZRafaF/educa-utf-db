migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("_pb_users_auth_")

  // remove
  collection.schema.removeField("tg3bpbt6")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "p9psll8d",
    "name": "campus",
    "type": "select",
    "required": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "Apucarana",
        "Campo Mourão",
        "Cornélio Procópio",
        "Curitiba",
        "Dois Vizinhos",
        "Francisco Beltrão",
        "Guarapuava",
        "Londrina",
        "Medianeira",
        "Pato Branco",
        "Ponta Grossa",
        "Santa Helena",
        "Toledo"
      ]
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("_pb_users_auth_")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "tg3bpbt6",
    "name": "campus",
    "type": "text",
    "required": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  // remove
  collection.schema.removeField("p9psll8d")

  return dao.saveCollection(collection)
})
