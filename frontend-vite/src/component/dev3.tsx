import { useState, useEffect } from 'react';
import { useCategoryFormState } from '../hook/category-form';

import {
  CategoriesState,
  CategorySelectable,
  useCategoriesState,
} from '../hook/categories';

import {
  useCategoryCreateMutation,
  useCategoryListQuery,
  useCategoryUpdateMutation,
  useCategoryDeleteMutation,
  Category as CategoryType,
} from '../generated/graphql';

const Category: React.FC<{
  category: CategorySelectable;
  categoriesState: CategoriesState;
  type: 'categoryList' | 'bookmarkCategoryList';
}> = ({ category, categoriesState: { categoryToggle }, type }) => {
  const [editing, setEditing] = useState(false);

  const handleClick = () => {
    categoryToggle(category);
  };

  return (
    <div>
      {type === 'categoryList' && (
        <button onClick={() => setEditing((s) => !s)}>edit</button>
      )}
      <label>
        <input
          type="checkbox"
          checked={category.selected}
          onClick={handleClick}
        />
        {category.name}
      </label>
      {/* <br /> */}
      {editing && <CategoryForm category={category} setEditing={setEditing} />}
    </div>
  );
};

const Categories: React.FC<{
  categoriesState: CategoriesState;
  type: 'categoryList' | 'bookmarkCategoryList';
}> = ({ categoriesState, type }) => {
  if (categoriesState.categories.length < 1) {
    return <div>no categories</div>;
  }

  const categories = categoriesState.categories.map((category) => (
    <Category
      key={category.sk}
      category={category}
      categoriesState={categoriesState}
      type={type}
    />
  ));

  return (
    //
    <div>{categories}</div>
  );
};

const CategoryForm: React.FC<{
  category?: CategoryType;
  setEditing?: React.Dispatch<React.SetStateAction<boolean>>;
}> = (p) => {
  const { description, name, reset, setDescription, setName } =
    useCategoryFormState();

  const [_, categoryCreate] = useCategoryCreateMutation();
  const [__, categoryUpdate] = useCategoryUpdateMutation();
  const [___, categoryDelete] = useCategoryDeleteMutation();

  useEffect(() => {
    if (p.category) {
      setName(p.category.name);
      setDescription(p.category.description);
    }
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    let res;
    if (p.category) {
      res = await categoryUpdate({
        description,
        name,
        sk: p.category.sk,
      });
    } else {
      res = await categoryCreate({
        description,
        name,
      });
    }
    console.log(res);
    if (!res.error) {
      if (p.setEditing) {
        p.setEditing(false);
      }
      reset();
    } else {
      console.error(res.error);
    }
  };

  const handleDelete = async (e: any) => {
    e.preventDefault();
    const res = await categoryDelete({
      sk: p.category?.sk!,
    });
    console.log(res);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="name"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
        }}
      />
      <br />
      <input
        placeholder="description"
        value={description}
        onChange={(e) => {
          setDescription(e.target.value);
        }}
      />
      <br />
      <button type={'submit'}>submit</button>
      {p.category && <button onClick={handleDelete}>delete</button>}
    </form>
  );
};

export const Dev3: React.FC = () => {
  const [categoryListRes] = useCategoryListQuery();

  const categoriesState = useCategoriesState();
  //   const { categoriesUpdate } = categoriesState;

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
