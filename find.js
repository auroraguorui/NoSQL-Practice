/* 1. Use find() to show the details of Germany */
db.world.find({name:'Germany'})

/* 2. List all the countries in the continent of "Eurasia" */
db.world.find({continent:'Eurasia'}).pretty()

/* 3. Find the country with an area of exactly 43094 */
db.world.find({area: 43094}).pretty()

/* 4. Show each country with a population of over 250000000 */
db.world.find(
    {population:{$gt: 250000000}},
    {name:1,_id:0}
).pretty()

/* 5. List the countries in Europe that come after "S" in the alphabet */
db.world.find({  name:{'$regex':"^S"},
                 continent: 'Europe'},
              {"name":1,"_id":0})

/* 6. Find the name and capital cities for countries with a population of over 70 million */
db.world.find({population:{$gt: 70000000}}, {name:1, capital:1, _id:0})

/* 7. Find the countries that have a population of over 200 million or less than 20,000 */
db.world.find({$or:[{population: {$gt: 200000000}},
                    {population: {$lt: 20000}}]},
              {name:1,population:1,_id:0})

/* 8. Show the first document of world */
db.world.findOne()

/* 9. Get the 50th document of world */
db.world.find()[49]
db.world.find().skip(49).limit(1)

/* 10. Get all the data concerning france */
db.world.find({"name":"France"})

/* 11. Get the population of Germany */
db.world.find({"name":"Germany"},{"population":1,"_id":0})

/* MongoDB also allows comparisons. Syntax:
Mongo | MySQL
--------------
$eq   | == 
$gt   | >
$gte  | >=
$lt   | <
$lte  | <=
$ne   | !=, <>
$in   | IN
$nin  | NOT IN
*/

/* 12. List the countries with a population that's less than 1 million. */
db.world.find({"population":{"$lt":1000000}},{"name":1,"_id":0})

/* 13. Find the countries with less than 1 million people, but over 200000km2 area */
db.world.find({"population":{"$lt":1000000},"area":{"$gt":200000}},{"name":1,"_id":0})

/* 14. Find the continent of Brazil, the United Kingdom, and Ghana. */
db.world.find({"population":{"$lt":1000000},"area":{"$gt":200000}},{"name":1,"_id":0})

/* 15. Show each country that begins with G */
db.world.find({"name": /^G/},{"name":1,"continent":1,"_id":0})

/* 16. Show country name and continent for countries Brazil, United Kingdom or Ghana */
db.world.find({"name":{"$in":["Brazil","United Kingdom","Ghana"]}},{"name":1,"continent":1,"_id":0})

