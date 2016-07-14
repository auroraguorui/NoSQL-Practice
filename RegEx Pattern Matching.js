/* 1. 
You can use '$regex':"^B" to get all the countries that start with B.
Find the countries that start with Y
*/
pp.pprint(list(
    db.world.find({"name":{'$regex':"^Y"}},{"name":1,"_id":0})
))

/* 2. 
You can use '$regex':"a$" to get all the countries that end with a.
Find the countries that end with y
*/
pp.pprint(list(
    db.world.find({"name":{'$regex':"y$"}},{"name":1,"_id":0})
))

/* 3. 
Luxembourg has an x, so does one other country, list them both
Find the countries that contain the letter x
*/
pp.pprint(list(
    db.world.find({"name":{'$regex':"x"}},{"name":1,"_id":0})
))

/* 4. 
Iceland and Switzerland end with land but where are the others?
Find the countries that end with land
*/
pp.pprint(list(
    db.world.find({"name":{'$regex':"land$"}},{"name":1,"_id":0})
))

/* 5. 
Columbia starts with a C and ends with ia - there are two other countries like this.
You can use .* to match any amount of any characters except newlines.
Find the countries that start with C and end with ia
*/
pp.pprint(list(
    db.world.find({"name":{'$regex':"^C.*ia$"}},{"name":1,"_id":0})
))

/* 6. 
Greece has a double e, who has a double o
Find the country that has oo in its name
*/
pp.pprint(list(
    db.world.find({"name":{'$regex':"oo"}},{"name":1,"_id":0})
))

/* 7.
Bahamas has three a, who else?
Find the country that has three or more a in the name
[Aa] matches both capital and lowercase A.
*/
pp.pprint(list(
    db.world.find({"name":{'$regex':"(.*[aA].*){3}"}},{"name":1,"_id":0})
))

/* 8.
India and Angola have n as their second character.
.* Indicates zero or more characters, . indicates just one.
Find the countries that have "t" as the second character.
*/
pp.pprint(list(
    db.world.find({"name":{'$regex':"^.t"}},{"name":1,"_id":0})
))

/* 9.
Lesotho and Moldova both have two o characters seperated by two other characters.
Find the countries that have two "o" characters separated by two others.
*/
pp.pprint(list(
    db.world.find({"name":{'$regex':"o..o"}},{"name":1,"_id":0})
))

/* 10.
Cuba and Togo have four character names.
Find the countries that have exactly four characters
*/
pp.pprint(list(
    db.world.find({"name":{'$regex':"^.{4}$"}},{"name":1,"_id":0})
))

/* 11.
The capital of Luxembourg is Luxembourg. Show all the countries where the capital is the same as the name of the country
How to compare two fields
You can compare two fields by using where 
db.<collection>.find({"$where":"this.<field1> <<operator>> this.<field2>"})
Where uses JavaScript on each document,this means you are able to call string methods such as .match()
Find the country where the name is the capital city.
*/
pp.pprint(list(
    db.world.find({"$where":"this.name == this.capital"},{"name":1,"_id":0})
))

/* 12.
The capital of Mexico is Mexico City. Show all the countries where the capital has the country together with the word "City".
Find the country where the capital is the country plus "City".
*/
pp.pprint(list(
    db.world.find({"$where":"this.capital == this.name+' City'"},{"name":1,"_id":0})
))

/* 13.
Find the capital and the name where the capital includes the name of the country.
You should include countries like Luxembourg where the capital is Luxembourg, and countries like Mexico where the capital is Mexico City
*/
pp.pprint(list(
    db.world.find({"$where":"this.capital.match(this.name)"},{"name":1,"_id":0})
))

/* 14.
Find the capital and the name where the capital is an extension of name of the country.
You should include Mexico City as it is longer than Mexico. You should not include Luxembourg as the capital is the same as the country.
Useful wildcards
. matches a single character.
* matches zero or more of the previous character or string if a string is given in brackets, eg: (abc)*
+ matches one or more of the previous character or string.
.* is the same as '0 or more characters' and .+ is the same as "at least one character"
*/
pp.pprint(list(
    db.world.find({"$where":"this.capital.match('^'+this.name+'.+$')"},{"name":1,"capital":1,"_id":0})
))
