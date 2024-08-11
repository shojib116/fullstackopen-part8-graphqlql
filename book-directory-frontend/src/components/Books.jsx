import { useQuery, useSubscription } from "@apollo/client";
import { ALL_BOOKS, BOOK_ADDED, BOOKS_BY_GENRE } from "../queries";
import { useState } from "react";

const filterList = [
  "refactoring",
  "agile",
  "patterns",
  "design",
  "crime",
  "classic",
  "all genres",
];

const Filters = ({ filter, setFilter }) => {
  return (
    <div>
      {filterList.map((value) => (
        <FilterItem
          value={value}
          filter={filter}
          setFilter={setFilter}
          key={value}
        />
      ))}
    </div>
  );
};

const FilterItem = ({ value, filter, setFilter }) => {
  return (
    <button onClick={() => setFilter(value)} disabled={filter === value}>
      {value}
    </button>
  );
};

const Books = () => {
  const defaultFilter = "all genres";
  const [filter, setFilter] = useState(defaultFilter);
  const result =
    filter === defaultFilter
      ? useQuery(ALL_BOOKS, { fetchPolicy: "no-cache" })
      : useQuery(BOOKS_BY_GENRE, {
          variables: { genre: filter },
          fetchPolicy: "no-cache",
        });

  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      const book = data.data.bookAdded;
      window.alert(`${book.title} by ${book.author.name} added`);
    },
  });

  if (result.loading) {
    return (
      <div>
        <h2>books</h2>
        <p>loading books...</p>
      </div>
    );
  }

  const books = result.data.allBooks;

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.id}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Filters filter={filter} setFilter={setFilter} />
    </div>
  );
};

export default Books;
