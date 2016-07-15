/* For this example MapReduce takes the form:
db.<collection>.map_reduce(
    map=<function>,
    reduce=<function>,
    out=<collection>
)
*/


/* 1. 
This example returns the population of all the continents.
In the map stage, emit(k,v) selects the fields to to turn into tuples, where k is the key and v is the value. 
The key will be the continents and the values will be the populations.
The reduce will sum all the values associated with each key. 
Finally the out specifies that the output is to be inline rather than a collection, allowing it to printed it to screen.
*/
from bson.code import Code
pp.pprint(
    db.world.map_reduce(
        map=Code("function(){emit(this.continent, this.population)}"), 
        reduce=Code("""function(key, values){
                           return Array.sum(values)
                       }
                    """),
        out={"inline":1},
    )
)


/* 2. 
query can be used to filter the input documents to map.
Find the GDP for each continent, but only include data from countries that start with the letter A or B.
*/
from bson.code import Code
temp = db.world.map_reduce(
        query={"name": {"$regex":"^(A|B)"}},
        map=Code("function(){emit(this.continent, this.gdp)}"), 
        reduce=Code("""function(key, values){
                           return Array.sum(values)
                      }
                   """),
        out={"inline":1},
)

pp.pprint(
   temp["results"]
)


/* 3. 
scope takes in a document:{} and lets you create global variables.
It's syntax is: scope={}.
Using scope, list all the countries with a higher population than Mexico.
*/
mexico_data = db.world.find_one({"name":"Mexico"})
pp.pprint(mexico_data)

from bson.code import Code
temp = db.world.map_reduce(
        scope = {"MEXICO":mexico_data},
        map = Code("""function(){
                         if (this.population > MEXICO.population) emit(this.name, this.population)
                      }
                   """), 
        reduce=Code("function(key, values){return values}"),
        out={"inline":1},
)
pp.pprint(
   temp["results"]
)


/* 4. 
sort and limit
Sort allows us to sort the input documents that are passed to map
Limit is self explanatory and also applies to the input documents that are passed to map
Get the five countries with the highest GDPs
*/
from bson.code import Code
temp = db.world.map_reduce(
        query={"gdp":{"$ne":None}},
        sort={"gdp":-1},
        limit=5,
        map=Code("function(){emit(this.name, this.gdp)}"), 
        reduce=Code("function(key, values){return values}"),
        out={"inline":1},
)

pp.pprint(
   temp["results"]
)

/* 5.
finalize is an optional additional step that allows you to modify the data produce by reduce
Show the top 15 countries by population, then show their population as a percentage of Mexico's population.
*/
mexico_data = db.world.find_one({"name":"Mexico"})

from bson.code import Code
temp = db.world.map_reduce(
        scope = {"MEXICO":mexico_data},
        query={"population":{"$ne":None}},
        sort={"population":-1},
        limit=15,
        map=Code("function(){emit(this.name, this.population)}"), 
        reduce=Code("function(key, values){return values}"),
        out={"inline":1},
        finalize=Code("""function(key, values){
                             return 100*(values/MEXICO.population)+"%"
                         }
                      """)
)

pp.pprint(
   temp["results"]
)

/* 6. 
Rounding can also be performed by using JavaScript.
Show the top 15 countries by population, then show their population as a whole number percentage of Mexico's population.
*/
mexico_data = db.world.find_one({"name":"Mexico"})

from bson.code import Code
temp = db.world.map_reduce(
        scope = {"MEXICO":mexico_data},
        query={"population":{"$ne":None}},
        sort={"population":-1},
        limit=15,
        map=Code("function(){emit(this.name, this.population)}"), 
        reduce=Code("function(key, values){return values}"),
        out={"inline":1},
        finalize=Code("""function(key, values){
                             return Math.round(100*(values/MEXICO.population))+"%"
                         }
                      """)
)

pp.pprint(
   temp["results"]
)


/* 7. 
Find the total population of the each continent
*/
from bson.code import Code
temp = db.world.map_reduce(
    map=Code("function(){emit(this.continent, this.population)}"),
    reduce=Code("""function(key, values){
      return Array.sum(values);
    }"""),
    out={"inline":1})
pp.pprint(temp["results"])

/* 8.
Use the previous answer to find the population of the world to the nearest million
How to round to the nearest million
Use the JavaScript round function : Math.round(population/1000000)*1000000
*/
title = "World Population in Millions"

from bson.code import Code
temp = db.world.map_reduce(
    scope = {"title":title},
    map=Code("function(){emit(title,this.population)}"),
    reduce=Code("""function(key, values){
      return Math.round(Array.sum(values)/1000000)*1000000;
    }"""),
    out={"inline":1})
pp.pprint(temp["results"])

/* 9.
Count number of countries by first letter
*/
from bson.code import Code
temp = db.world.map_reduce(
    map=Code("function(){emit(this.name[0],1)}"),
    reduce=Code("""function(key, values){
      return Array.sum(values);
    }"""),
    out={"inline":1})
pp.pprint(temp["results"])


/* 10. 
Show the number of countries on each continent
*/
from bson.code import Code
temp = db.world.map_reduce(
    map=Code("function(){emit(this.continent, 1)}"),
    reduce=Code("""function(key, values){
      return Array.sum(values);
    }"""),
    out={"inline":1})
pp.pprint(temp["results"])

/* 11. 
Show the smallest 3 countries name and area (ignore areas of 0 or None)
*/
from bson.code import Code
temp = db.world.map_reduce(
        query={"area":{"$nin":[None, 0]}},
        sort={"area":1},
        limit=3,
        map=Code("function(){emit(this.name, this.area)}"), 
        reduce=Code("function(key, values){return values}"),
        out={"inline":1}
)

pp.pprint(
   temp["results"]
)

/* 12.
Return the first and last country based on name order for each continent
*/


/* 13.
Return country name or capital city that starts with a letter 'M'
*/
from bson.code import Code
temp = db.world.map_reduce(
        map=Code("function(){if (this.name.match('^M')) emit(this.name, 0); if (this.capital.match('^M')) emit(this.capital, 0)}"), 
        reduce=Code("function(key, values){return Math.min(values)}"),
        out={"inline":1}
)
pp.pprint(
   temp["results"]
)

/* 14.
Show the first and last city for each letter and the count of cities
*/


/* 15.
Show country count for countries in the ranges

 0 to 1000000
 1000000 to 2000000
 2000000 to 3000000
 3000000 to 5000000
 5000000 to 10000000
 10000000 to 15000000
 More than 15000000  
*/
data1 = "0 TO 1000000"
data2 = "1000000 TO 2000000"
data3 = "2000000 TO 3000000"
data4 = "3000000 TO 5000000"
data5 = "5000000 TO 10000000"
data6 = "10000000 TO 15000000"
data7 = "MORE THAN 15000000"

from bson.code import Code
temp = db.world.map_reduce(
    scope = {"data1":data1, "data2":data2, "data3":data3, "data4":data4, "data5":data5, "data6":data6, "data7":data7},
    map=Code("function(){if (this.population< 1000000) emit(data1,1); else if (this.population< 2000000) emit(data2,1); else if (this.population< 3000000)  emit(data3,1); else if (this.population< 5000000) emit(data4,1); else if (this.population< 10000000) emit(data5,1); else if (this.population< 15000000) emit(data6,1); else emit(data7, 1)}"),
    reduce=Code("""function(key, values){
      return Array.sum(values);
    }"""),
    out={"inline":1})
pp.pprint(temp["results"])



