import { CategoriesState, CategorySelectable } from '../../hook/categories';
import { CategoryForm } from './category-form';
import { mrb } from '../../style/margin';
import { useState } from 'react';

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
        <div>
          <button style={mrb} onClick={() => setShowAdd((s) => !s)}>
            add
          </button>
          <button style={mrb} onClick={() => setShowEdit((s) => !s)}>
            edit
          </button>
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
  category: CategorySelectable;
  categoriesState: CategoriesState;
  showEdit: boolean;
}> = ({ category, categoriesState: { categoryToggle }, showEdit }) => {
  const [editing, setEditing] = useState(false);

  const handleChange = () => {
    categoryToggle(category);
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
        <button style={mrb} onClick={() => setEditing((s) => !s)}>
          edit
        </button>
      )}
      {editing && <CategoryForm category={category} setEditing={setEditing} />}
    </div>
  );
};
