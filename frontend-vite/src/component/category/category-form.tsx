import { mrb } from '../../style/margin';
import { useCategoryFormState } from '../../hook/category-form';
import { useEffect } from 'react';

import {
  useCategoryCreateMutation,
  useCategoryUpdateMutation,
  useCategoryDeleteMutation,
  Category,
} from '../../generated/graphql';

export const CategoryForm: React.FC<{
  category?: Category;
  setEditing?: React.Dispatch<React.SetStateAction<boolean>>;
}> = (p) => {
  const { description, title, reset, setDescription, setTitle } =
    useCategoryFormState();

  const [_, categoryCreate] = useCategoryCreateMutation();
  const [__, categoryUpdate] = useCategoryUpdateMutation();
  const [___, categoryDelete] = useCategoryDeleteMutation();

  useEffect(() => {
    if (p.category) {
      setTitle(p.category.title);
      setDescription(p.category.description);
    }
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    let res;
    if (p.category) {
      res = await categoryUpdate({
        description,
        title,
        sk: p.category.sk,
      });
    } else {
      res = await categoryCreate({
        description,
        title,
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
        placeholder="title"
        value={title}
        style={mrb}
        onChange={(e) => {
          setTitle(e.target.value);
        }}
      />
      <br />
      <input
        placeholder="description"
        value={description}
        style={mrb}
        onChange={(e) => {
          setDescription(e.target.value);
        }}
      />
      <br />
      <button style={mrb} type={'submit'}>
        submit
      </button>
      {p.category && <button onClick={handleDelete}>delete</button>}
    </form>
  );
};
