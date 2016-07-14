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

/* 6. Find the name and capital cities for countries with a population of over 70 million */
db.world.find({population:{$gt: 70000000}}, {name:1, capital:1, _id:0})

/* 7. Find the countries that have a population of over 200 million or less than 20,000 */
db.world.find({$or:[{population: {$gt: 200000000}},
                    {population: {$lt: 20000}}]},
              {name:1,population:1,_id:0})
