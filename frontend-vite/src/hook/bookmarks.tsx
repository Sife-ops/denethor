import { Bookmark } from '../generated/graphql';
import { useState } from 'react';

export interface BookmarkUI extends Bookmark {
  selected: boolean;
  editing: boolean;
}

export interface BookmarksState {
  bookmarks: BookmarkUI[];
  setBookmarks: React.Dispatch<React.SetStateAction<BookmarkUI[]>>;
  bookmarksUpdate: (bookmarks: Bookmark[]) => void;
}

export const useBookmarksState = (): BookmarksState => {
  const [bookmarks, setBookmarks] = useState<BookmarkUI[]>([]);

  const bookmarksUpdate = (bookmarks: Bookmark[]) => {
    setBookmarks((state) => {
      return bookmarks.map((e) => {
        const found = state.find((f) => f.sk === e.sk);
        if (found) {
          return {
            ...e,
            selected: found.selected,
            editing: found.editing,
          };
        } else {
          return {
            ...e,
            selected: false,
            editing: false,
          };
        }
      });
    });
  };

  return {
    bookmarks,
    bookmarksUpdate,
    setBookmarks,
  };
};
