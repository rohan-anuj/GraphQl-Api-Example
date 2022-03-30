const express=require("express")
const app=express()
const expressGraphQL=require("express-graphql").graphqlHTTP
const Schema=require("./Schema/schema")




//Middleware
app.use("/graphQl",expressGraphQL({
    graphiql:true,
    schema:Schema


}))



//PORT 
const PORT=process.env.PORT || 5000


// Listening On Port
app.listen(PORT,()=>console.log(PORT))