import React from "react";
import { Auth } from "aws-amplify";

import {
  useHelloQuery,
  useCategoryCreateMutation,
  useBookmarkCreateMutation,
  useCategoryListQuery,
  useBookmarkListQuery,
  Category,
  useBookmarkDeleteMutation,
  useBookmarkUpdateMutation,
} from "../../generated/graphql";

export const Dev2: React.FC = () => {
  const [description, setDescription] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [url, setUrl] = React.useState("");
  const [favorite, setFavorite] = React.useState(false);
  const [sk, setSk] = React.useState("");
  const [categories, setCategories] = React.useState<
    Array<Category & { selected: boolean }>
  >([]);

  // const [helloRes] = useHelloQuery();
  const [_, categoryCreate] = useCategoryCreateMutation();
  const [__, bookmarkCreate] = useBookmarkCreateMutation();
  const [categoryListRes] = useCategoryListQuery();
  // const [bookmarkListRes] = useBookmarkListQuery();
  const [___, bookmarkDelete] = useBookmarkDeleteMutation();
  const [____, bookmarkUpdate] = useBookmarkUpdateMutation();

  React.useEffect(() => {
    if (categoryListRes.fetching === false && categoryListRes.data) {
      const categories = categoryListRes.data?.categoryList.map((e) => ({
        ...e,
        selected: false,
      }));
      setCategories(categories);
    }
  }, [categoryListRes.fetching]);

  // if (!bookmarkListRes.fetching && bookmarkListRes.data) {
  //   console.log(bookmarkListRes);
  // }

  return (
    <div>
      <h1>bookmark delete</h1>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const res = await bookmarkDelete({
            sk,
          });
          console.log(res);
        }}
      >
        <input
          placeholder="sk"
          onChange={(e) => setSk(e.target.value)}
          value={sk}
        />
        <br />
        <button type="submit">submit</button>
      </form>

      <h1>category list</h1>
      {categories.length > 0 &&
        categories.map((category) => (
          <div key={category.sk}>
            <label>{category.title}</label>
            <input
              checked={category.selected}
              type={"checkbox"}
              onClick={() => {
                setCategories((state) =>
                  state.map((c) => {
                    if (c.sk === category.sk) {
                      return {
                        ...c,
                        selected: !c.selected,
                      };
                    }
                    return c;
                  })
                );
              }}
            />
          </div>
        ))}

      <h1>bookmark create/update</h1>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const res = await bookmarkCreate({
            description,
            favorite,
            title,
            url,
            categories: categories
              .filter((e) => e.selected === true)
              .map((e) => e.sk),
          });
          console.log(res);
        }}
      >
        <input
          placeholder="title"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
        />
        <br />
        <input
          placeholder="description"
          onChange={(e) => setDescription(e.target.value)}
          value={description}
        />
        <br />
        <input
          placeholder="url"
          onChange={(e) => setUrl(e.target.value)}
          value={url}
        />
        <br />
        <input
          type={"checkbox"}
          onChange={() => setFavorite((s) => !s)}
          checked={favorite}
        />
        <br />
        <button type="submit">create</button>
      </form>
      <button
        onClick={async () => {
          const res = await bookmarkUpdate({
            sk,
            title,
            url,
            description,
            favorite,
            categories: categories
              .filter((e) => e.selected === true)
              .map((e) => e.sk),
          });
        }}
      >
        update
      </button>

      <h1>category create</h1>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const res = await categoryCreate({
            title,
            description,
          });
          console.log(res);
        }}
      >
        <input
          placeholder="title"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
        />
        <br />
        <input
          placeholder="description"
          onChange={(e) => setDescription(e.target.value)}
          value={description}
        />
        <br />
        <button type="submit">submit</button>
      </form>

      <h1>amplify refresh</h1>
      <button
        onClick={async () => {
          const res = await Auth.currentSession();
          console.log(res);
        }}
      >
        test
      </button>

      {/* <h1>hello query</h1>
      {helloRes.fetching ? (
        <div>loading</div>
      ) : (
        <div>{JSON.stringify(helloRes)}</div>
      )} */}
    </div>
  );
};
