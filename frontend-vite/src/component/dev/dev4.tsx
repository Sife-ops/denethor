import React from 'react';

import {
  useCategoryListQuery,
  useBookmarkListQuery,
} from '../../generated/graphql';

export const Dev4: React.FC = () => {
  const [res] = useCategoryListQuery();
  const [res2] = useBookmarkListQuery();

  return (
    <div>
      <h1>bookmark list</h1>
      <button
        onClick={() => {
          console.log(res2.data?.bookmarkList);
        }}
      >
        test
      </button>

      <h1>category list</h1>
      <button
        onClick={() => {
          console.log(res.data?.categoryList);
        }}
      >
        test
      </button>
    </div>
  );
};
