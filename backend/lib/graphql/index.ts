import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge';

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

const schemaArrays = [
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
].reduce(
  (
    a: {
      typeArray: any[];
      resolverArray: any[];
    },
    c
  ) => {
    return {
      typeArray: [...a.typeArray, c.typeDef],
      resolverArray: [...a.resolverArray, c.resolver],
    };
  },
  {
    typeArray: [],
    resolverArray: [],
  }
);

export const typeDefs = mergeTypeDefs([
  ...schemaArrays.typeArray,
  // bookmark,
  // category,
]);

export const resolvers = mergeResolvers(schemaArrays.resolverArray);

export { Context } from './context';
