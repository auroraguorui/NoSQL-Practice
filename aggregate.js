/* 1. $match performs queries in a similar way to find(), Show all the details for France */
db.world.aggregate([
    {$match:{name:"France"}}
])

db.world.find(
    {name: /France/}
)

/* 2. limit sets the amount of documents to be handed to the next stage in the pipeline. Return the first document */
db.world.aggregate([
    {$limit:1}
])

/* 3. $project selects what fields to display.
It can also has the ability to create new fields and to compare fields against each other without using $where

Show the name and population density of all Asian countries. (population/area)
Note that "density" is a new field, made from the result of dividing two existing fields, and that $divide is an aggregate function.

Dealing with division by 0
To avoid diving by 0 insert a $match to remove any countries with 0 area (Vatican City), then pipe these results through to $project
There is no need to check if values are null, MongoDB will ignore these documents.
*/
db.world.aggregate([
    {$match:{area:{$ne:0}, continent:"Asia"}},
    {$project:{
        _id:0,
        name:1,
        density: {$divide: ["$population","$area"]}
    }}
])

/* 4. Because aggregate is a pipeline stages may be repeated, and stages don't have to be used in a specific order.
Show the name of Asian countries with a density that's over 500 people per km2. (population/area)
*/
db.world.aggregate([
   {$match:{area:{$ne:0},continent:"Asia"}},
   {$project:{
       _id:0,
       name:1,
       density: {$divide: ["$population","$area"]}
   }},
   {$match:{density:{$gt:500}}}
])

/* 5. $sort allows ordering of the results set, where 1 is ascending and -1 is descending.
Note that not including $match is the same as {"$match":{}}

Show the name of all countries in descending order.
*/
db.world.aggregate([
    {"$project":{
        "_id":0,
        "name":1,
    }},
    {"$sort":{
        "name":-1
    }}  
])


/* Grouping
Grouping provides accumulator operations such as $sum
All groups must have an _id. To see why this is useful imagine the following:

So far you've been using the collection world
As every country has a continent, it would make sense to have countries as a nested document inside continents: e.g:

The code to group by continent is "_id":"$continent"
If instead the question was to group by country the code would be "_id":"$name".
To operate over the whole document (which would have the same effect as "_id":"$name") "_id":"null" or "_id":None can be used.

*/


/* 6. $max and $min can be used to get the largest and smallest values in a group.

Get the smallest and largest GDPs of each continent. 
*/
db.world.aggregate([
    {$group:{
        _id:"$continent",
        min:{$min:"$gdp"},
        max:{$max:"$gdp"}
    }},
    {$project:{
        _id:1,
        min:1,
        max:1
    }}
])

/* 7. Some other useful aggregate functions to know are $sum and average: $avg
This example combines all the material in these examples.

Order the continents in descending order by total GDP, Include the average GDP for each country.
*/
db.world.aggregate([
    {$group:{
        _id:"$continent",
        "Total GDP": {"$sum": "$gdp"},
        "Average GDP": {"$avg": "$gdp"}
    }},
    {$sort:{
        "Total GDP":-1
    }},
    {$project:{
        Area:"$_id",
        "Total GDP": 1,
        "Average GDP":1,
        _id:0
    }}
])

/* 8. Using Conditions
$cond is similar to a CASE statement in other languages.
It has the form "$cond": [{<comparison> :[<field or value>,<field or value>]},<true case>,<false case>]
*/
db.world.aggregate([
    {$group:{
        _id:{
            $cond: [{"$eq":["$continent","Eurasia"]},"Europe","$continent"]
        },
        area:{$sum: "$area"}
    }},
    {$sort:{
        area: -1
    }},
    {$project:{
        _id:1,
        area:1
    }}
])

/* 9. Give the name and the per capita GDP for those countries with a population of at least 200 million. */
db.world.aggregate([
    {$match:{
        population:{$gte:200000000}
    }},
    {$project:{
        _id:0,
        name:1,
        "per capita GDP": {$divide: ['$gdp','$population']}
    }}
])

/* 10. Give the name and the population density of all countries. Ignore results where the density is "None". */
db.world.aggregate([
    {$project:{
        _id:0,
        name:1,
        density: {$divide: ["$population","$area"]}
    }},
    {$match:{
        density: {$ne:null}
    }}
])

/* 11. Show the name and population in millions for the countries of the continent South America. 
Divide the population by 1000000 to get population in millions. */
db.world.aggregate([
    {$match:{
         continent: "South America"
    }},
    {$project:{
        _id:0,
        name:1,
        population: {$divide: ["$population",1000000]}
    }}
])

/* 12. Show the name and population density for France, Germany, and Italy */
db.world.aggregate([
    {$match:{
        name: {$in:['France','Germany','Italy']},
        population: {$ne: null},
        area: {$ne: 0}
    }},
    {$project:{
        _id:0,
        name:1,
        "population density": {$divide: ["$population","$area"]}
    }}
])

/* 13. Order the continents by area from most to least. */
db.world.aggregate([
    {$group:{
        _id:"$continent",
        area:{$sum: "$area"}
    }},
    {$sort:{
        area: -1
    }},
    {$project:{
        _id:1,
        area:1
    }}
])


/* 14. Print a list of names for countries in the continent of "North America" change United States to USA */
db.world.aggregate([
  {$match:{
      continent:"North America"
  }},
  {$project:{
      _id:0,
      name: {$cond: [{"$eq":["$name","United States"]},"USA","$name"]}
  }}
])

/* 15. Combine North America and South America to America, and then list the continents by area. Biggest first. */
db.world.aggregate([
    {$group:{
        _id:{
            "$cond": [
                { "$or": [ 
                          { "$eq": [ "$continent", "North America" ] },
                          { "$eq": [ "$continent", "South America" ] }
                         ]},    
                  "America", 
                  "$continent"
                  ]
                },
        area:{$sum: "$area"}
    }},
    {$sort:{
        area: -1
    }},
    {$project:{
        _id:1,
        area:1
    }}
])

/* 16. Show the name and the continent for countries beginning with N - but replace the continent Oceania with Australasia. */
db.world.aggregate([
    {$match:{
        name:{$regex:/^N/}
    }},
    {$project:{
        _id:0,
        name:1,
        continent: {
            $cond: [{"$eq": ["$continent", "Oceania"]}, "Australasia", "$continent"]
        }
    }}
])


/* 17. Show the name and the continent but:
    substitute Eurasia for Europe and Asia.
    substitute America - for each country in North America or South America or Caribbean.
Only show countries beginning with A or B
If you're struggling you may want to experiment with $and,$or, etc.
*/
db.world.aggregate([
    {$match:{
        name:{$regex:/^[AB]/}
    }},
    {$project:{
        _id:0,
        name:1,
        continent: {
            $concat: [{
                $cond: [ { $or: [{ $eq: ["$continent", "Europe"] }, 
                                 { $eq: ["$continent", "Asia"] }  
                        ] }, "Eurasia", "" ]            }, {
                $cond: [ { $or: [{ $eq: ["$continent", "North America"] }, 
                                 { $eq: ["$continent", "South America"] },
                                 { $eq: ["$continent", "Caribbean"] }  
                        ] }, "America", "" ]
            }, {
                $cond: [ { $or: [{ $eq: ["$continent", "North America"] }, 
                                 { $eq: ["$continent", "South America"] },
                                 { $eq: ["$continent", "Caribbean"] },
                                 { $eq: ["$continent", "Europe"] }, 
                                 { $eq: ["$continent", "Asia"] }
                        ] }, "", "$continent"]
            }]
        }
    }}
])

/* 18. Put the continents right... 
    Oceania becomes Australasia
    Countries in Eurasia and Turkey go to Europe/Asia
    Caribbean islands starting with 'B' go to North America, other Caribbean islands go to South America
Show the name, the original continent and the new continent of all countries.
*/
