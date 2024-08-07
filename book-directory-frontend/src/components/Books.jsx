import { useQuery } from "@apollo/client";
import { ALL_BOOKS } from "../queries";
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
  const result = useQuery(ALL_BOOKS);
  const [filter, setFilter] = useState(defaultFilter);

  if (result.loading) {
    return <div>loading books...</div>;
  }

  const books =
    filter === defaultFilter
      ? result.data.allBooks
      : result.data.allBooks.filter((book) => book.genres.includes(filter));

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
