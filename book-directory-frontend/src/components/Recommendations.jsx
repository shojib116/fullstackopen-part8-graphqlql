import { useQuery } from "@apollo/client";
import { BOOKS_BY_GENRE, USER_INFO } from "../queries";

const Recommendations = () => {
  const result = useQuery(USER_INFO);
  const favoriteGenre = result.loading ? null : result.data.me.favoriteGenre;
  const booksByGenre = useQuery(BOOKS_BY_GENRE, {
    variables: { genre: favoriteGenre ? favoriteGenre : "" },
    fetchPolicy: "no-cache",
  });

  if (result.loading || booksByGenre.loading)
    return <div>loading your favorite books...</div>;

  const books = booksByGenre.data.allBooks;

  return (
    <div>
      <h2>recommendations</h2>
      <p>
        books in your favorite genre <b>{favoriteGenre}</b>
      </p>
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
    </div>
  );
};

export default Recommendations;
