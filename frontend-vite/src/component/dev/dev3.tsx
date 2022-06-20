import { Categories } from '../category/categories';
import { CategoryForm } from '../category/category-form';
import { useCategoriesState } from '../../hook/categories';
import { useCategoryListQuery } from '../../generated/graphql';
import { useEffect } from 'react';

export const Dev3: React.FC = () => {
  const [categoryListRes] = useCategoryListQuery();

  const categoriesState = useCategoriesState();

  useEffect(() => {
    const { fetching, data } = categoryListRes;
    if (!fetching && data) {
      categoriesState.categoriesUpdate(data.categoryList);
    }
  }, [categoryListRes.data]);

  return (
    <div>
      <h1>Categories</h1>
      <CategoryForm />
      <br />
      <Categories categoriesState={categoriesState} type={'categoryList'} />
    </div>
  );
};
