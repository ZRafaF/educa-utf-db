/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("bh63i50xs13bm6p")

  collection.createRule = "user.id = @request.auth.id &&\n@request.data.views:isset = false"
  collection.updateRule = "user.id = @request.auth.id &&\n@request.data.views:isset = false"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("bh63i50xs13bm6p")

  collection.createRule = "user.id = @request.auth.id"
  collection.updateRule = "user.id = @request.auth.id"

  return dao.saveCollection(collection)
})
