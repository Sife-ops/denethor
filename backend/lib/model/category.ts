import dynamoose from "dynamoose";
import { EntityClass, entity } from "./entity";

export class CategoryClass extends EntityClass {
  bookmark?: string;
  description?: string;
  name?: string;
}

const categorySchema = new dynamoose.Schema({
  pk: {
    type: String,
    hashKey: true,
  },
  sk: {
    type: String,
    rangeKey: true,
  },
  name: {
    type: String,
  },
  description: {
    type: String,
  },
  bookmark: {
    type: String,
    index: {
      name: "categoryBookmarkIndex",
      rangeKey: "sk",
      global: true,
    },
  },
});

export default entity<CategoryClass>(categorySchema);
