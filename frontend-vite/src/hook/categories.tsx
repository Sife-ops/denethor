import { Category } from '../generated/graphql';
import { useState } from 'react';

export interface CategoryUI extends Category {
  selected: boolean;
  editing: boolean;
}

export interface CategoriesState {
  categories: CategoryUI[];
  categoriesUpdate: (categories: Category[]) => void;
  categoryEdit: (category: Category | string) => void;
  categoryEditClear: () => void;
  categorySelect: (category: Category | string) => void;
  categorySelectClear: () => void;
  setCategories: React.Dispatch<React.SetStateAction<CategoryUI[]>>;
}

export const useCategoriesState = (): // categories?: Category[]
CategoriesState => {
  const [categories, setCategories] = useState<CategoryUI[]>([]);

  // if (categories) {
  //   setCategoriesState(
  //     categories.map((e) => ({
  //       ...e,
  //       selected: false,
  //       editing: false,
  //     }))
  //   );
  // }

  const categoriesUpdate = (categoriesState: Category[]) => {
    setCategories((state) => {
      return categoriesState.map((e) => {
        const found = state.find((f) => f.sk === e.sk);
        if (found) {
          return {
            ...e,
            selected: found.selected,
            editing: found.editing,
          };
        } else {
          return {
            ...e,
            selected: false,
            editing: false,
          };
        }
      });
    });
  };

  const categoryToggle = (
    property: 'selected' | 'editing',
    // todo: don't use string
    category: Category | string
  ) => {
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
            [property]: !category[property],
          };
        } else {
          if (property === 'editing') {
            return {
              ...category,
              editing: false,
            };
          } else {
            return category;
          }
        }
      })
    );
  };

  const categorySelect = (category: Category | string) => {
    categoryToggle('selected', category);
  };

  const categoryEdit = (category: Category | string) => {
    categoryToggle('editing', category);
  };

  const categoryClear = (property: 'selected' | 'editing') => {
    setCategories((state) =>
      state.map((e) => ({
        ...e,
        [property]: false,
      }))
    );
  };

  const categoryEditClear = () => {
    categoryClear('editing');
  };

  const categorySelectClear = () => {
    categoryClear('selected');
  };

  return {
    categories,
    categoriesUpdate,
    categoryEdit,
    categoryEditClear,
    categorySelect,
    categorySelectClear,
    setCategories,
  };
};
