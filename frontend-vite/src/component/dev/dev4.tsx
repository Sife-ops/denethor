import React from 'react';
import { useCategoryListQuery } from '../../generated/graphql';

export const Dev4: React.FC = () => {
  const [res] = useCategoryListQuery();

  return (
    <div>
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
