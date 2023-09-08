/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("b8tl08gwhanvtbk")

  collection.name = "post_stats"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("b8tl08gwhanvtbk")

  collection.name = "post_status"

  return dao.saveCollection(collection)
})
