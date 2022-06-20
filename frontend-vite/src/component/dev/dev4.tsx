import React, { useState, useEffect } from 'react';

import {
  useCategoryListQuery,
  useBookmarkListQuery,
} from '../../generated/graphql';

export const Dev4: React.FC = () => {
  const [res] = useCategoryListQuery();
  const [res2] = useBookmarkListQuery();

  const [file, setFile] = useState('');

  const handleImport = (e: any) => {
    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0], 'UTF-8');
    fileReader.onload = (e: any) => {
      setFile(e.target.result);
    };
  };

  const fun = (a: any[]) => {
    let acc = 0;
    for (let i = 0; i < a.length; i++) {
      const children = a[i].children;
      if (children && children.length > 0) {
        acc = acc + fun(children);
      }
      acc = acc + 1;
    }
    return acc;
  };

  useEffect(() => {
    //
    if (file) {
      //
      try {
        const a = JSON.parse(file);
        console.log(a);
        console.log(fun(a.children));
      } catch {
        console.error('bad file');
      }
    }
  }, [file]);

  return (
    <div>
      <h1>import</h1>
      <input type={'file'} onChange={handleImport} />
      <div>{file}</div>

      <h1>bookmark list</h1>
      <button
        onClick={() => {
          console.log(res2.data?.bookmarkList);
        }}
      >
        test
      </button>

      <h1>category list</h1>
      <button
        onClick={() => {
          console.log(res.data?.categoryList);
        }}
      >
        test
      </button>
    </div>
  );
};
