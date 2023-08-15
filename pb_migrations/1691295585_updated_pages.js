migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("bh63i50xs13bm6p")

  collection.name = "posts"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("bh63i50xs13bm6p")

  collection.name = "pages"

  return dao.saveCollection(collection)
})
