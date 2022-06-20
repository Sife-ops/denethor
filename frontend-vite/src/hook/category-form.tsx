import { useState } from 'react';

export const useCategoryFormState = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const reset = () => {
    setTitle('');
    setDescription('');
  };

  return {
    description,
    title,
    reset,
    setDescription,
    setTitle,
  };
};
