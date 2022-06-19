import { useState, useEffect } from 'react';
import {
  Category as CategoryType,
  useCategoryListQuery,
} from '../generated/graphql';

interface CategorySelectable extends CategoryType {
  selected: boolean;
}

const Category: React.FC<{
  category: CategorySelectable;
  categoriesState: CategoriesState;
}> = ({ category, categoriesState: { categoryToggle } }) => {
  const handleClick = () => {
    categoryToggle(category);
    console.log('sup')
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
  categoriesState: CategoriesState;
}> = ({ categoriesState }) => {
  if (categoriesState.categories.length < 1) {
    return null;
  }

  const categories = categoriesState.categories.map((category) => (
    <Category
      key={category.sk}
      category={category}
      categoriesState={categoriesState}
    />
  ));

  return (
    //
    <div>{categories}</div>
  );
};

interface CategoriesState {
  categories: CategorySelectable[];
  categoryToggle: (category: CategoryType | string) => void;
  setCategories: React.Dispatch<React.SetStateAction<CategorySelectable[]>>;
}

const useCategoriesState = (): CategoriesState => {
  const [categories, setCategories] = useState<CategorySelectable[]>([]);

  const categoryToggle = (category: CategoryType | string) => {
    let sk: string;
    if (typeof category === 'string') {
      sk = category;
    } else {
      sk = category.sk;
    }

    setCategories((state) =>
      state.map((category) => {
        if (category.sk === sk) {
          return {
            ...category,
            selected: !category.selected,
          };
        } else {
          return category;
        }
      })
    );
  };

  return {
    categories,
    categoryToggle,
    setCategories,
  };
};

export const Dev3: React.FC = () => {
  const [categoryListRes] = useCategoryListQuery();

  const categoriesState = useCategoriesState();
  const { categories, categoryToggle, setCategories } = categoriesState;

  useEffect(() => {
    const { fetching, data } = categoryListRes;

    if (!fetching && data) {
      setCategories(
        // todo: merge with existing
        data.categoryList.map((e) => ({
          ...e,
          selected: false,
        }))
      );
    }
  }, [categoryListRes.fetching]);

  return (
    <div>
      <h1>dev3</h1>
      <Categories categoriesState={categoriesState} />
    </div>
  );
};
