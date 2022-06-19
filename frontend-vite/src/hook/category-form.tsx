import { useState } from 'react';

export const useCategoryFormState = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const reset = () => {
    setName('');
    setDescription('');
  };

  return {
    description,
    name,
    reset,
    setDescription,
    setName,
  };
};
