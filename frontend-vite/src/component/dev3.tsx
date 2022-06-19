import { useState, useEffect } from 'react';
import {
  Category as CategoryType,
  useCategoryListQuery,
  useCategoryCreateMutation,
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

interface CategoriesState {
  categories: CategorySelectable[];
  categoryToggle: (category: CategoryType | string) => void;
  setCategories: React.Dispatch<React.SetStateAction<CategorySelectable[]>>;
  categoriesUpdate: (categories: CategoryType[]) => void;
}

const useCategoriesState = (): CategoriesState => {
  const [categories, setCategories] = useState<CategorySelectable[]>([]);

  const categoriesUpdate = (categories: CategoryType[]) => {
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
    categoriesUpdate,
  };
};

const useCategoryFormState = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  return {
    description,
    name,
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
          const { description, name } = categoryFormState;
          const res = await categoryCreate({
            name,
            description,
          });
          console.log(res);
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
