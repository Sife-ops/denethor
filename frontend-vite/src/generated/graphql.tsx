import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Bookmark = {
  __typename?: 'Bookmark';
  categories: Array<Category>;
  description?: Maybe<Scalars['String']>;
  favorite?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  pk?: Maybe<Scalars['String']>;
  sk?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
};

export type Category = {
  __typename?: 'Category';
  description?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  pk?: Maybe<Scalars['String']>;
  sk?: Maybe<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  categoryCreate: Category;
  categoryDelete: Category;
  categoryUpdate: Category;
};


export type MutationCategoryCreateArgs = {
  description?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
};


export type MutationCategoryDeleteArgs = {
  sk: Scalars['String'];
};


export type MutationCategoryUpdateArgs = {
  description?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  sk: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  categoryList: Array<Category>;
  hello?: Maybe<Scalars['String']>;
};

export type CategoryCreateMutationVariables = Exact<{
  name: Scalars['String'];
  description?: InputMaybe<Scalars['String']>;
}>;


export type CategoryCreateMutation = { __typename?: 'Mutation', categoryCreate: { __typename?: 'Category', pk?: string | null, sk?: string | null, name?: string | null, description?: string | null } };

export type HelloQueryVariables = Exact<{ [key: string]: never; }>;


export type HelloQuery = { __typename?: 'Query', hello?: string | null };


export const CategoryCreateDocument = gql`
    mutation CategoryCreate($name: String!, $description: String) {
  categoryCreate(name: $name, description: $description) {
    pk
    sk
    name
    description
  }
}
    `;

export function useCategoryCreateMutation() {
  return Urql.useMutation<CategoryCreateMutation, CategoryCreateMutationVariables>(CategoryCreateDocument);
};
export const HelloDocument = gql`
    query Hello {
  hello
}
    `;

export function useHelloQuery(options?: Omit<Urql.UseQueryArgs<HelloQueryVariables>, 'query'>) {
  return Urql.useQuery<HelloQuery>({ query: HelloDocument, ...options });
};