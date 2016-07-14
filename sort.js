/* 1. Sort all the documents in world by continent descending, then name ascending. Show only name and continent. */
db.world.find({},{continent:1,name:1,_id:0}).sort({"continent":-1,"name":1})

