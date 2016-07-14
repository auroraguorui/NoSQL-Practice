/* There are many ways to do this in MongoDB.

count() is a cursor method that takes a query and returns a number equal to the amount of documents that matched the query.
$sum is an aggregation operator availible in the $group stage, that can be used to both sum values and count the number of documents.
mapReduce can produce a sum or a count during the results stage by using JavaScript.
*/

/* 1. .count() */
db.world.count({"continent":"Africa"})

/* 2. $sum */
db.world.aggregate([
   {"$group":{
       "_id":"$continent",
       "sum of populations":{$sum:"$population"},
       "count of countries":{$sum:1}
   }}
])

/* 3. Array.sum() */
db.world.mapReduce(
   function(){emit(this.continent, this.population)},
   function(k,v){ return Array.sum(v) },
   {out:{inline:1}}
)
