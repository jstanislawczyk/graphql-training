# graphql-training
This is sample GraphQL application. It contains configuration for GraphQL endpoint, 
database connection, dependency injection, validation and logging. This app may be used as 
initial application skeleton

## Technologies used
* Node 14
* ApolloServer
* Typescript
* TypeGraphQl
* TypeORM
* ClassValidator
* Mocha + Sinon + Chai
* SuperTest
* ESLint
* Config
* Winston
* Nodemon
* TSNode
* NPM

## Prerequisites
* Installed Node 14
* Installed NPM
* Configured local or remote MySQL Server

## Info
Database config uses default MySQL configuration and it can be changed using 
environment variables (check `config/default.js` file)

Server starts at `http://localhost:4000/` <br />
Default GraphQL endpoint is `http://localhost:4000/graphql` `(POST)` <br />
Sample query:
```
{
    getBooks {
        id,
        title,
        author,
        isPublished
    }
}
```
