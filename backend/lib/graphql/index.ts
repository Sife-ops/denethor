import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge';
import { makeExecutableSchema } from '@graphql-tools/schema';

import { bookmark } from './bookmark';
import { bookmarkCreate } from './bookmark-create';
import { bookmarkDelete } from './bookmark-delete';
import { bookmarkList } from './bookmark-list';
import { bookmarkUpdate } from './bookmark-update';
import { category } from './category';
import { categoryCreate } from './category-create';
import { categoryDelete } from './category-delete';
import { categoryList } from './category-list';
import { categoryUpdate } from './category-update';
import { hello } from './hello';
import { netscapeImport } from './netscape-import';

const schemas = [
  bookmark,
  bookmarkCreate,
  bookmarkDelete,
  bookmarkList,
  bookmarkUpdate,
  category,
  categoryCreate,
  categoryDelete,
  categoryList,
  categoryUpdate,
  hello,
  netscapeImport,
];

const typeDefs = mergeTypeDefs(schemas.map((e) => e.typeDef));
const resolvers = mergeResolvers(schemas.map((e) => e.resolver));

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

export { Context } from './context';
