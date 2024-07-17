import { useMutation } from "@apollo/client";
import { useState } from "react";
import { ALL_AUTHORS, SET_BIRTH_YEAR } from "../queries";

const AuthorForm = ({ authors }) => {
  const [name, setName] = useState("");
  const [born, setBorn] = useState("");

  const [setBirthYear] = useMutation(SET_BIRTH_YEAR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  });
  const submit = (event) => {
    event.preventDefault();

    setBirthYear({ variables: { name, born } });
    setName("");
    setBorn("");
  };
  return (
    <div>
      <h2>Set birthyear</h2>
      <form>
        {/* name{" "}
        <input
          type="text"
          name="name"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />{" "}
        <br /> */}
        <select name="name" id="name" onChange={(e) => setName(e.target.value)}>
          <option disabled selected>
            Select a name
          </option>
          {authors.map((a) => (
            <option key={a.id} value={a.name}>
              {a.name}
            </option>
          ))}
        </select>
        <br />
        born{" "}
        <input
          type="number"
          name="born"
          id="born"
          value={born}
          onChange={(e) => setBorn(Number(e.target.value))}
        />{" "}
        <br />
        <button type="button" onClick={submit}>
          update author
        </button>
      </form>
    </div>
  );
};

export default AuthorForm;
