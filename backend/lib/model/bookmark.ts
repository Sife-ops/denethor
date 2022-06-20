import dynamoose from 'dynamoose';
import { EntityClass, entity } from './entity';

export class BookmarkClass extends EntityClass {
  description: string;
  favorite: boolean;
  title: string;
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
  title: {
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

export const bookmarkModel = entity<BookmarkClass>(bookmarkSchema);
