import dynamoose from "dynamoose";
import { EntityClass, entity } from "./entity";

export class BookmarkClass extends EntityClass {
  description?: string;
  favorite?: boolean;
  name: string;
  url: string;
}

const bookmarkSchema = new dynamoose.Schema({
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
  url: {
    type: String,
  },
  favorite: {
    type: Boolean,
  },
});

export default entity<BookmarkClass>(bookmarkSchema);
