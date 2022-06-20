import React, { useState, useEffect } from 'react';

import {
  useCategoryListQuery,
  useBookmarkListQuery,
  useNetscapeImportMutation,
} from '../../generated/graphql';

export const Dev4: React.FC = () => {
  const [categoryListRes] = useCategoryListQuery();
  const [bookmarkListRes] = useBookmarkListQuery();
  const [_, netscapeImport] = useNetscapeImportMutation();

  const [file, setFile] = useState('');

  useEffect(() => {
    if (file) {
      console.log(file);
      // const a = cheerio.load(file)

      // try {
      //   // const a = bookmarksToJSON(file);
      //   // console.log(a);
      // } catch {
      //   console.error('frick');
      // }

      // try {
      //   const a = JSON.parse(file);
      //   console.log(a);
      //   console.log(fun(a.children));
      // } catch {
      //   console.error('bad file');
      // }
    }
  }, [file]);

  const handleImport = (e: any) => {
    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0], 'UTF-8');
    fileReader.onload = (e: any) => {
      setFile(e.target.result);
    };
  };

  // firefox backup
  const fun = (
    a: any[]
  ): Array<{ iconuri: string; title: string; uri: string }> => {
    let acc: any[] = [];
    for (let i = 0; i < a.length; i++) {
      const { children, uri, title, iconuri } = a[i];
      if (children && children.length > 0) {
        acc = [...acc, ...fun(children)];
      }
      if (uri) {
        acc = [
          ...acc,
          {
            uri,
            title,
            iconuri,
          },
        ];
      }
    }
    return acc;
  };

  return (
    <div>
      <h1>import</h1>
      <input type={'file'} onChange={handleImport} />
      <button
        onClick={async () => {
          const res = await netscapeImport({
            html: file,
          });
          if (res.data) {
            const json = JSON.parse(res.data.netscapeImport);
            console.log(json);
          }
        }}
      >
        test
      </button>

      <h1>bookmark list</h1>
      <button
        onClick={() => {
          console.log(bookmarkListRes.data?.bookmarkList);
        }}
      >
        test
      </button>

      <h1>category list</h1>
      <button
        onClick={() => {
          console.log(categoryListRes.data?.categoryList);
        }}
      >
        test
      </button>
    </div>
  );
};
