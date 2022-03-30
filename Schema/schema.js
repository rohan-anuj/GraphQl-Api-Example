//Importing all essential packages
const {GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLNonNull, GraphQLInt, GraphQLList} =require("graphql")
const slqite3=require("sqlite3")
const db=new slqite3.Database("./database.json")


// creating tables
const CreateTable=()=>{
        const Querii=`CREATE TABLE IF NOT EXISTS Books(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            AuthorId INTEGER
            
            )`

            const QueriiAuth=`CREATE TABLE IF NOT EXISTS Authors(
            
                AuthorId INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT

                
                )`

                db.exec(QueriiAuth)

            db.exec(Querii)

}


CreateTable()

//Declaring BookType
const BookType=new GraphQLObjectType({
    name:"Books",
    description:"All the books are here",
    fields:()=>({
        name:{
            type:GraphQLString,
        },
        id:{
            type:new GraphQLNonNull(GraphQLInt),
        },
        AuthorId:{
            type:GraphQLInt
        }
    })
})

//Declaring Author type
const AuthorType=new GraphQLObjectType({
    name:"AuthorType",
    description:"Authors list and details",
    fields:()=>({
        AuthorId:{
            type:GraphQLInt
        },
        name:{
            type:GraphQLString
        }

    })
})


// Declaring Root Query 

const rootType= new GraphQLObjectType({
    name:"Query",
    description:"All Queries Here",
    fields:()=>({
        Book:{
            type:BookType,
            args:{
                id:{
                    type:GraphQLInt
                }
            },
            resolve:(parent,args)=>{
                return new Promise((resolve,reject)=>{
            
                    db.all(`select * from Books where id=(?)`,args.id,(err,rows)=>{
                        if(err){
                            reject(err)
                        }
                        else{
                            resolve(rows[0])
                        }
                    })
                })

            }

        },
        Books:{
            type:new GraphQLList(BookType),
            resolve:()=>{
                return new Promise((resolve,reject)=>{
                    db.all("select * from Books",(err,rows)=>{
                        if(err){
                            reject(err)
                        }
                        else{
                            resolve(rows)
                        }
                    })
                    
                })
            }
     
        },
        Authors:{
            type:new GraphQLList(AuthorType),
            resolve:()=>{
                return new Promise((resolve,reject)=>{
                    db.all("select * from Authors",(err,rows)=>{
                        if(err){
                            reject(err)
                        }
                        else{
                            resolve(rows)
                        }
                    })
                    
                })

            }

        }

    })
})

//Mutation data 
const rootMutation=new GraphQLObjectType({
    name:"mutation",
    description:"Mutating data",
    fields:()=>({
        //add book mutation field
        addbook:{
            type:BookType,
            //arguments
            args:{
                name:{type:GraphQLString
                },
                AuthorId:{
                    type:GraphQLInt
                },

            },
            resolve:(parent,args)=>{
                console.log(args.name)
                return new Promise((resolve,reject)=>{
                    db.run(`INSERT into Books (name,AuthorId) values (?,?)`,args.name,args.AuthorId,(err)=>{
                        if(err){
                            reject(err)
                        }
                        db.all(`select last_insert_rowid() as id `,(err,row)=>{
                            if(err){
                                reject(err)
                            }
                            else{
                            
                                resolve({
                                    id:row[0].id,
                                    name:args.name,
                                    AuthorId:args.AuthorId
                                })
                            }
                        })

                    })

                })
            }
                
        
        },
        addAuthor:{
            type:AuthorType,
            args:{
                AuthorId:{
                    type:GraphQLInt
                },
                name:{
                    type:GraphQLString
                },

            },
            resolve:(parent,args)=>{
                return new Promise((resolve,reject)=>{
                    db.run("Insert Into Authors (name) values (?)",args.name,(err)=>{
                        if(err){
                            reject(err)
                        }
                        db.all("select last_insert_rowid() as id",(err,row)=>{
                            if(err){
                                reject(err)
                            }
                            else{
                            
                                resolve({
                                    AuthorId:row[0].id,
                                    name:args.name

                                })
                            }
                        })
                    })
                })
            }
        }

    })
})



const Schema=new GraphQLSchema({
    query:rootType,
    mutation:rootMutation

})


module.exports=Schema
