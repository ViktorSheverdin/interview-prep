import { GraphQLClient } from 'graphql-request';
export const GQL_API_URL = 'http://localhost:4000/graphql';
export const gqlClient = new GraphQLClient(GQL_API_URL);
