import { useState, useEffect, useRef } from "react";
import Note from "./components/Note";
import Notification from "./components/Notification";
import Footer from "./components/Footer";
import LoginForm from "./components/LoginForm";
import Togglable from "./components/Togglable";
import noteService from "./services/notes";
import loginService from "./services/login";
import NoteForm from "./components/NoteForm";

const App = () => {
  const [notes, setNotes] = useState([]);
  const [showAll, setShowAll] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const noteFormRef = useRef();

  // const hook = () => {
  //   console.log("effect");
  //   axios.get("http://localhost:3001/notes").then((response) => {
  //     console.log("promise fulfilled");
  //     setNotes(response.data);
  //   });
  // };
  // useEffect(hook, []);
  // console.log("render", notes.length, "notes");

  useEffect(() => {
    // console.log("effect");
    noteService.getAll().then((initialNotes) => {
      // console.log("promise fulfilled");
      setNotes(initialNotes);
    });
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedNoteappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      noteService.setToken(user.token);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({ username, password });

      window.localStorage.setItem("loggedNoteappUser", JSON.stringify(user));
      noteService.setToken(user.token);
      setUser(user); //user now consists of token, username and name
      setUsername("");
      setPassword("");
    } catch (exception) {
      setErrorMessage("Wrong credentials");
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const addNote = (newNoteObj) => {
    noteFormRef.current.toggleVisibility();
    noteService.create(newNoteObj).then((returnedNote) => {
      // console.log(returnedNote);
      setNotes(notes.concat(returnedNote));
    });
  };

  const noteForm = () => {
    return (
      <Togglable buttonLabel="new note" ref={noteFormRef}>
        <NoteForm createNote={addNote} />
      </Togglable>
    );
  };

  const notesToShow = showAll ? notes : notes.filter((note) => note.important);

  const toggleImportanceOf = (id) => {
    const note = notes.find((note) => note.id === id);
    const changedNote = { ...note, important: !note.important };

    noteService
      .update(id, changedNote)
      .then((returnedNote) =>
        setNotes(notes.map((note) => (note.id !== id ? note : returnedNote)))
      )
      .catch((error) => {
        setErrorMessage(
          `Note ${note.content} was already removed from server!`
        );
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
        setNotes(notes.filter((note) => note.id !== id));
      });
  };

  return (
    <div>
      <h1>Notes app</h1>

      <Notification message={errorMessage} />

      {!user && (
        <Togglable buttonLabel="log in">
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleLogin={handleLogin}
          />
        </Togglable>
      )}

      {user && (
        <div>
          <p>{user.name} logged in</p>
          {noteForm()}
        </div>
      )}
      {user && (
        <>
          <div>
            <button onClick={() => setShowAll(!showAll)}>
              Show {showAll ? "Important" : "All"}
            </button>
          </div>
          <ul>
            <ul>
              {notesToShow.map((note) => (
                <Note
                  key={note.id}
                  note={note}
                  toggleImportance={() => toggleImportanceOf(note.id)}
                />
              ))}
            </ul>
          </ul>
        </>
      )}
      <Footer />
    </div>
  );
};

export default App;
