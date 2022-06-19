import { Category } from '../generated/graphql';
import { useState } from 'react';

export interface CategorySelectable extends Category {
  selected: boolean;
}

export interface CategoriesState {
  categories: CategorySelectable[];
  categoryToggle: (category: Category | string) => void;
  setCategories: React.Dispatch<React.SetStateAction<CategorySelectable[]>>;
  categoriesUpdate: (categories: Category[]) => void;
}

export const useCategoriesState = (): CategoriesState => {
  const [categories, setCategories] = useState<CategorySelectable[]>([]);

  const categoriesUpdate = (categories: Category[]) => {
    setCategories((state) => {
      return categories.map((category) => {
        const found = state.find((c) => c.sk === category.sk);
        if (found) {
          return {
            ...category,
            selected: found.selected,
          };
        } else {
          return {
            ...category,
            selected: false,
          };
        }
      });
    });
  };

  const categoryToggle = (category: Category | string) => {
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
    categoriesUpdate,
  };
};
