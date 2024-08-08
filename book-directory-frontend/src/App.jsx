import { useEffect, useState } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import { useApolloClient } from "@apollo/client";
import Recommendations from "./components/Recommendations";

const App = () => {
  const linkStyle = { textDecoration: "none", color: "black" };
  const [token, setToken] = useState(null);

  const client = useApolloClient();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("library-user-token");
    if (token) setToken(token);
  }, []);

  const logout = () => {
    setToken(null);
    localStorage.removeItem("library-user-token");
    client.resetStore();
    navigate("/");
  };

  return (
    <div>
      <div>
        <button>
          <Link to="/authors" style={linkStyle}>
            authors
          </Link>
        </button>{" "}
        <button>
          <Link to="/" style={linkStyle}>
            books
          </Link>
        </button>{" "}
        {token && (
          <button>
            <Link to="/add-book" style={linkStyle}>
              add book
            </Link>
          </button>
        )}{" "}
        {token && (
          <button>
            <Link to="/recommendations" style={linkStyle}>
              recommend
            </Link>
          </button>
        )}{" "}
        {token && <button onClick={logout}>logout</button>}{" "}
        {!token && (
          <button>
            <Link to="/login" style={linkStyle}>
              login
            </Link>
          </button>
        )}
      </div>
      <Routes>
        <Route path="/" element={<Books />} />
        <Route path="/authors" element={<Authors />} />
        <Route path="/add-book" element={<NewBook />} />
        <Route path="/add-book" element={<NewBook />} />
        <Route path="/recommendations" element={<Recommendations />} />
        <Route path="/login" element={<LoginForm setToken={setToken} />} />
      </Routes>
    </div>
  );
};

export default App;
