import { useState, useEffect } from 'react';

import {
  CategoriesState,
  CategorySelectable,
  useCategoriesState,
} from '../hook/categories';

import {
  useCategoryCreateMutation,
  useCategoryListQuery,
} from '../generated/graphql';

const Category: React.FC<{
  category: CategorySelectable;
  categoriesState: CategoriesState;
}> = ({ category, categoriesState: { categoryToggle } }) => {
  const handleClick = () => {
    categoryToggle(category);
  };

  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={category.selected}
          onClick={handleClick}
        />
        {category.name}
      </label>
    </div>
  );
};

const Categories: React.FC<{
  categories: CategorySelectable[];
  categoriesState: CategoriesState;
}> = (p) => {
  if (p.categories.length < 1) {
    return <div>no categories</div>;
  }

  const categories = p.categories.map((category) => (
    <Category
      key={category.sk}
      category={category}
      categoriesState={p.categoriesState}
    />
  ));

  return (
    //
    <div>{categories}</div>
  );
};

const useCategoryFormState = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const reset = () => {
    setName('');
    setDescription('');
  };

  return {
    description,
    name,
    reset,
    setDescription,
    setName,
  };
};

export const Dev3: React.FC = () => {
  const [categoryListRes] = useCategoryListQuery();

  const categoriesState = useCategoriesState();
  const { categories, categoriesUpdate } = categoriesState;

  const [_, categoryCreate] = useCategoryCreateMutation();
  const categoryFormState = useCategoryFormState();

  useEffect(() => {
    const { fetching, data } = categoryListRes;
    if (!fetching && data) {
      categoriesUpdate(data.categoryList);
    }
  }, [categoryListRes.data]);

  return (
    <div>
      <h1>Categories</h1>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const { description, name, reset } = categoryFormState;
          const res = await categoryCreate({
            name,
            description,
          });
          if (!res.error) {
            reset();
          } else {
            console.error(res.error);
          }
        }}
      >
        <input
          placeholder="name"
          value={categoryFormState.name}
          onChange={(e) => {
            categoryFormState.setName(e.target.value);
          }}
        />
        <br />
        <input
          placeholder="description"
          value={categoryFormState.description}
          onChange={(e) => {
            categoryFormState.setDescription(e.target.value);
          }}
        />
        <br />
        <button type={'submit'}>submit</button>
      </form>
      <br />
      <Categories categories={categories} categoriesState={categoriesState} />
    </div>
  );
};
