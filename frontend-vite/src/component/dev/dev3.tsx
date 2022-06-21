import { Categories } from '../category/categories';
import { useBookmarksState, BookmarksState } from '../../hook/bookmarks';
import { useCategoriesState, CategoriesState } from '../../hook/categories';
import { useEffect } from 'react';

import {
  useCategoryListQuery,
  useBookmarkListQuery,
  Bookmark as BookmarkType,
} from '../../generated/graphql';

export const Dev3: React.FC = () => {
  const [categoryListRes] = useCategoryListQuery();
  const [bookmarkListRes] = useBookmarkListQuery();

  const categoriesState = useCategoriesState();
  const bookmarksState = useBookmarksState();

  useEffect(() => {
    const { fetching, data } = categoryListRes;
    if (!fetching && data) {
      categoriesState.categoriesUpdate(data.categoryList);
    }
  }, [categoryListRes.data]);

  useEffect(() => {
    const { fetching, data } = bookmarkListRes;
    if (!fetching && data) {
      bookmarksState.bookmarksUpdate(data.bookmarkList);
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
        <Bookmarks
          bookmarksState={bookmarksState}
          categoriesState={categoriesState}
        />
      )}
    </div>
  );
};

// todo: animated spinner
const Loading: React.FC = () => {
  return <div>Loading...</div>;
};

const Bookmark: React.FC<{
  bookmark: BookmarkType;
  categoriesState: CategoriesState;
}> = ({ categoriesState, bookmark }) => {
  const bookmarkCategoriesState = useCategoriesState();

  useEffect(() => {
    if (bookmark.categories) {
      bookmarkCategoriesState.setCategories(
        categoriesState.categories.map((e) => {
          if (bookmark.categories?.find((f) => f.sk === e.sk)) {
            return {
              ...e,
              selected: true,
            };
          } else {
            return {
              ...e,
              selected: false,
            };
          }
        })
      );
    }
  }, [categoriesState.categories]);

  return (
    <div>
      <div>title: {bookmark.title}</div>
      <div>description: {bookmark.description || 'none'}</div>
      <div>url: {bookmark.url}</div>
      <div>
        <div>categories</div>
        <Categories
          categoriesState={bookmarkCategoriesState}
          type={'bookmarkCategoryList'}
        />
      </div>
      <button>edit</button>
      <br />
    </div>
  );
};

const Bookmarks: React.FC<{
  bookmarksState: BookmarksState;
  categoriesState: CategoriesState;
}> = ({ bookmarksState: { bookmarks }, categoriesState }) => {
  if (bookmarks.length < 1) {
    return <div>no bookmarks</div>;
  }

  return (
    <div>
      {bookmarks.map((bookmark) => (
        <Bookmark
          key={bookmark.sk}
          bookmark={bookmark}
          categoriesState={categoriesState}
        />
      ))}
    </div>
  );
};
