import { mergeTypeDefs, mergeResolvers } from "@graphql-tools/merge";

import { bookmark } from "./bookmark";
import { category } from "./category";
import { categoryCreate } from "./category-create";
import { categoryDelete } from "./category-delete";
import { categoryList } from "./category-list";
import { categoryUpdate } from "./category-update";
import { hello } from "./hello";

const typeArray = [
  categoryCreate,
  categoryDelete,
  categoryList,
  categoryUpdate,
  hello,
].map((e) => e.typeDef);

export const typeDefs = mergeTypeDefs([...typeArray, bookmark, category]);

const resolverArray = [
  categoryCreate,
  categoryDelete,
  categoryList,
  categoryUpdate,
  hello,
].map((e) => e.resolver);

export const resolvers = mergeResolvers(resolverArray);

export { Context } from "./context";
