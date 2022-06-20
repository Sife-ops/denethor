import { CategoriesState, CategoryUI } from '../../hook/categories';
import { CategoryForm } from './category-form';
import { mr, mrb } from '../../style/margin';
import { useState, useEffect } from 'react';

export const Categories: React.FC<{
  categoriesState: CategoriesState;
  type: 'categoryList' | 'bookmarkCategoryList';
}> = ({ categoriesState, type }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const categories = categoriesState.categories.map((category) => (
    <Category
      key={category.sk}
      category={category}
      categoriesState={categoriesState}
      showEdit={showEdit}
    />
  ));

  return (
    <div>
      {type === 'categoryList' && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <h1 style={mr}>Categories</h1>
          <div>
            <button
              style={mr}
              onClick={() => {
                setShowAdd((s) => !s);
                setShowEdit(false);
              }}
            >
              add
            </button>
            <button
              style={mr}
              onClick={() => {
                setShowEdit((s) => !s);
                setShowAdd(false);
              }}
            >
              edit
            </button>
            <button
              onClick={() => {
                setShowEdit((s) => !s);
                setShowAdd(false);
                setShowEdit(false)
                categoriesState.categorySelectClear();
              }}
            >
              reset
            </button>
          </div>
        </div>
      )}
      {showAdd && <CategoryForm />}
      {categoriesState.categories.length > 0 ? (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
          }}
        >
          {categories}
        </div>
      ) : (
        <div>no categories</div>
      )}
    </div>
  );
};

const Category: React.FC<{
  category: CategoryUI;
  categoriesState: CategoriesState;
  showEdit: boolean;
}> = ({
  category,
  categoriesState: { categoryEdit, categoryEditClear, categorySelect },
  showEdit,
}) => {
  useEffect(() => {
    if (!showEdit) {
      categoryEditClear();
    }
  }, [showEdit]);

  const handleChange = () => {
    categorySelect(category);
  };

  return (
    <div style={mrb}>
      <div>
        <label>
          <input
            type="checkbox"
            checked={category.selected}
            onChange={handleChange}
          />
          {category.title}
        </label>
      </div>
      {showEdit && (
        <button style={mrb} onClick={() => categoryEdit(category)}>
          edit
        </button>
      )}
      {showEdit && category.editing && (
        <CategoryForm
          category={category}
          categoryEditClear={categoryEditClear}
        />
      )}
    </div>
  );
};
