import { Categories } from '../category/categories';
import { useCategoriesState } from '../../hook/categories';
import { useEffect, useState } from 'react';

import {
  useCategoryListQuery,
  useBookmarkListQuery,
  Bookmark as BookmarkType,
} from '../../generated/graphql';

export const Dev3: React.FC = () => {
  const [categoryListRes] = useCategoryListQuery();
  const [bookmarkListRes] = useBookmarkListQuery();

  const categoriesState = useCategoriesState();
  const [bookmarks, setBookmarks] = useState<BookmarkType[]>([]);

  useEffect(() => {
    const { fetching, data } = categoryListRes;
    if (!fetching && data) {
      categoriesState.categoriesUpdate(data.categoryList);
    }
  }, [categoryListRes.data]);

  useEffect(() => {
    const { fetching, data } = bookmarkListRes;
    if (!fetching && data) {
      setBookmarks(data.bookmarkList);
    }
  }, [bookmarkListRes.data]);

  return (
    <div>
      {categoryListRes.fetching ? (
        <Loading />
      ) : (
        <Categories categoriesState={categoriesState} type={'categoryList'} />
      )}
      {bookmarkListRes.fetching ? (
        <Loading />
      ) : (
        <Bookmarks bookmarks={bookmarks} />
      )}
    </div>
  );
};

// todo: animated spinner
const Loading: React.FC = () => {
  return <div>Loading...</div>;
};

const Bookmark: React.FC<{ bookmark: BookmarkType }> = (p) => {
  return (
    //
    <div>{p.bookmark.title}</div>
  );
};

const Bookmarks: React.FC<{ bookmarks: BookmarkType[] }> = (p) => {
  if (p.bookmarks.length < 1) {
    return (
      //
      <div>no bookmarks</div>
    );
  }

  return (
    <div>
      {p.bookmarks.map((bookmark) => (
        <Bookmark key={bookmark.sk} bookmark={bookmark} />
      ))}
    </div>
  );
};
