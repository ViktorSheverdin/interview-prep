import {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull,
} from 'graphql';
import { createHandler } from 'graphql-http/lib/use/express';
import express from 'express';

const authors = [
  { id: 1, name: 'J. K. Rowling' },
  { id: 2, name: 'J. R. R. Tolkien' },
  { id: 3, name: 'Brent Weeks' },
];

const books = [
  { id: 1, name: 'Harry Potter and the Chamber of Secrets', authorId: 1 },
  { id: 2, name: 'Harry Potter and the Prisoner of Azkaban', authorId: 1 },
  { id: 3, name: 'Harry Potter and the Goblet of Fire', authorId: 1 },
  { id: 4, name: 'The Fellowship of the Ring', authorId: 2 },
  { id: 5, name: 'The Two Towers', authorId: 2 },
  { id: 6, name: 'The Return of the King', authorId: 2 },
  { id: 7, name: 'The Way of Shadows', authorId: 3 },
  { id: 8, name: 'Beyond the Shadows', authorId: 3 },
];

const AuthorType: GraphQLObjectType = new GraphQLObjectType({
  name: 'Author',
  description: 'This represents an author with books',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLInt) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    books: {
      type: new GraphQLList(BookType),
      resolve: (author) => {
        return books.filter((book) => book.authorId === author.id);
      },
    },
    // books: {
    //   type: new GraphQLList(BookType),
    //   resolve: (author) => {
    //     return books.find((book) => book.authorId === author.id);
    //   },
    // },
  }),
});

const BookType: GraphQLObjectType = new GraphQLObjectType({
  name: 'Book',
  description: 'This represents a book written by an author',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLInt) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    authorId: { type: new GraphQLNonNull(GraphQLString) },
    author: {
      type: AuthorType,
      resolve: (book) => {
        return authors.find((author) => author.id === book.authorId);
      },
    },
  }),
});

const RootQueryType = new GraphQLObjectType({
  name: 'Query',
  description: 'Root Query',
  fields: () => ({
    books: {
      type: new GraphQLList(BookType),
      description: 'List of books',
      resolve: () => books,
    },
    authors: {
      type: new GraphQLList(AuthorType),
      description: 'List of authors',
      resolve: () => authors,
    },
  }),
});

// Construct a schema
const schema = new GraphQLSchema({
  query: RootQueryType,
});

const app = express();

// Create and use the GraphQL handler.
app.use(
  '/graphql',
  createHandler({
    schema: schema,
  })
);

// Start the server at port
app.listen(4000);
console.log('Running a GraphQL API server at http://localhost:4000/graphql');

// CURL
// curl -X POST \
//   -H "Content-Type: application/json" \
//   --data '{"query":"{ books {name author {name}} }"}' \
//   http://localhost:4000/graphql

// CURL
// curl -X POST \
//   -H "Content-Type: application/json" \
//   --data '{"query":"{ authors {name books {name}} }"}' \
//   http://localhost:4000/graphql
