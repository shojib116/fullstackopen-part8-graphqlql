import { useState } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import { Link, Route, Routes } from "react-router-dom";

const App = () => {
  const [page, setPage] = useState("authors");

  return (
    <div>
      <div>
        <Link to="/authors">authors</Link> <Link to="/">books</Link>{" "}
        <Link to="/add-book">add book</Link>
      </div>
      <Routes>
        <Route path="/" element={<Books />} />
        <Route path="/authors" element={<Authors />} />
        <Route path="/add-book" element={<NewBook />} />
      </Routes>
    </div>
  );
};

export default App;
