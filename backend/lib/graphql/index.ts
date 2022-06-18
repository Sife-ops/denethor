import { mergeTypeDefs } from "@graphql-tools/merge";

import { entity } from "./type/entity";
import { categoryCreate } from "./operation/category-create";
import { categoryDelete } from "./operation/category-delete";

const typeArray = [categoryCreate, categoryDelete].map((e) => e.typeDef);
export const typeDefs = mergeTypeDefs([...typeArray, entity]);

export { Context } from "./context";
