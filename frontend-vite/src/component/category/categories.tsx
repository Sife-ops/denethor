import { CategoriesState, CategorySelectable } from '../../hook/categories';
import { CategoryForm } from './category-form';
import { useState } from 'react';

export const Categories: React.FC<{
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

const Category: React.FC<{
  category: CategorySelectable;
  categoriesState: CategoriesState;
  type: 'categoryList' | 'bookmarkCategoryList';
}> = ({ category, categoriesState: { categoryToggle }, type }) => {
  const [editing, setEditing] = useState(false);

  const handleChange = () => {
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
          onChange={handleChange}
        />
        {category.name}
      </label>
      {/* <br /> */}
      {editing && <CategoryForm category={category} setEditing={setEditing} />}
    </div>
  );
};
