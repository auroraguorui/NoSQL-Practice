/* Rounding is easy inside a MapReduce as it is possible to use the Math object provided by JavaScript.
More information on Math can be found here.

At the time of writing the aggregation() method has no rounding functions, though it is still doable with $mod and $multiply, as shown here by the lead project manager at MongoDB
*/


/* Using MapReduce */
temp = db.world.map_reduce(
        query={"name":"United Kingdom"},
        map=Code("function(){emit(this.name, this.population)}"), 
        reduce=Code("function(key, values){return values}"),
        finalize=Code("function(key,values){return Math.round(values/1000000)}"),
        out={"inline":1},
)
pp.pprint(
   temp["results"]
)


/* Using Aggregate */
pp.pprint(list(
    db.world.aggregate([
        {"$match": {"name":"United Kingdom"}},
        {"$project":{
            "_id":1, "name":1, "population":{"$divide":["$population",1000000]}
        }},
        {"$project":{
            "_id":0, "name":1, "population in millions":{"$divide":[
                {"$subtract":[
                    {"$multiply":['$population',100]},
                    {"$mod":[{"$multiply":['$population',100]}, 1]}
                    ]},100
            ]}
        }}
    ])
))
