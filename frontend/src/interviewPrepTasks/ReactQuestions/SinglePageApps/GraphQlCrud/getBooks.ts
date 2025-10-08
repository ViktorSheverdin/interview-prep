import { request } from 'graphql-request';

import { GetBooksDocument } from '../../../../gql/graphql';
import { GQL_API_URL } from '../../../../graphQlClient';

export const getBooks = () => {
  return request(GQL_API_URL, GetBooksDocument);
};
