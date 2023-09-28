const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const axios = require('axios');
const startServer = async ()=>{
    const port = 8080;
    const app = express();
        // Resolvers define how to fetch the types defined in your schema.
    // This resolver retrieves books from the "books" array above.
    const resolvers = {
        Todo: {
            user: async (todo)=>{
                let retData;
                const AxiosURI = `https://jsonplaceholder.typicode.com/users/${todo.id}`;
                await axios.get(AxiosURI)
                .then((res)=>{
                    retData = res.data;
                })
                .catch((err)=>{
                    console.error(err)
                })
                return retData;
            }
        },
        Query: {
            getTodos: async () => {
                const AxiosURI = 'https://jsonplaceholder.typicode.com/todos';
                let retData;
                await axios.get(AxiosURI)
                .then((res)=>{
                    retData = res.data;
                })
                .catch((err)=>{
                    console.log("ERROR OCCURED : ", err);
                })
                return retData;
            }
        },
    };
    const typeDefs = `
        #This is a comment in graphQL
        type User{
            id: ID!
            name: String!
            username: String!
            email: String!
            phone: String!
            website: String!
        }
        type Todo{
            id : ID!
            title : String!
            completed : Boolean!
            user: User
        }

        # The "Query" type is special: it lists all of the available queries that
        # clients can execute, along with the return type for each. In this
        # case, the "books" query returns an array of zero or more Books (defined above).
        type Query {
            getTodos: [Todo]
        }
    `;
    const server = new ApolloServer({
        typeDefs,
        resolvers,
    });
    app.use(bodyParser.json());
    app.use(cors());
    
    await server.start();
    app.use('/graphql', expressMiddleware(server));
    app.listen(port,()=>{
        console.log("Server Started at port 8080");
    })
}

startServer();