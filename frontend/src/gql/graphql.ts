/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = T | null | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

/** This represents an author with books */
export type Author = {
  __typename?: 'Author';
  books?: Maybe<Array<Maybe<Book>>>;
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
};

/** This represents a book written by an author */
export type Book = {
  __typename?: 'Book';
  author?: Maybe<Author>;
  authorId: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
};

/** Root Mutation */
export type Mutation = {
  __typename?: 'Mutation';
  /** Adds new author */
  addAuthor?: Maybe<Author>;
  /** Add a book */
  addBook?: Maybe<Book>;
};


/** Root Mutation */
export type MutationAddAuthorArgs = {
  name: Scalars['String']['input'];
};


/** Root Mutation */
export type MutationAddBookArgs = {
  authorId: Scalars['Int']['input'];
  name: Scalars['String']['input'];
};

/** Root Query */
export type Query = {
  __typename?: 'Query';
  /** Single of authors */
  author?: Maybe<Author>;
  /** List of authors */
  authors?: Maybe<Array<Maybe<Author>>>;
  /** Single book */
  book?: Maybe<Book>;
  /** List of books */
  books?: Maybe<Array<Maybe<Book>>>;
};


/** Root Query */
export type QueryAuthorArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
};


/** Root Query */
export type QueryBookArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
};

export type GetBooksQueryVariables = Exact<{ [key: string]: never; }>;


export type GetBooksQuery = { __typename?: 'Query', books?: Array<{ __typename?: 'Book', id: number, name: string, author?: { __typename?: 'Author', name: string } | null } | null> | null };


export const GetBooksDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetBooks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"books"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"author"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<GetBooksQuery, GetBooksQueryVariables>;