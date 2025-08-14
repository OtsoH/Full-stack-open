import { useState } from "react"
import Authors from "./components/Authors"
import Books from "./components/Books"
import NewBook from "./components/NewBook"
import LoginForm from "./components/LoginForm"
import Recommendations from "./components/Recommendations"
import { useApolloClient } from "@apollo/client"
import { useEffect } from "react"

const App = () => {
  const [page, setPage] = useState("authors");
  const [token, setToken] = useState(null);
  const client = useApolloClient()

  useEffect(() => {
    const savedToken = localStorage.getItem("user-token")
    if (savedToken) {
      setToken(savedToken)
    }
  }, [])

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
    setPage("authors")
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        {!token && <button onClick={() => setPage("login")}>login</button>}
        {token && <button onClick={() => setPage("add")}>add book</button>}
        {token && <button onClick={() => setPage("recommendations")}>recommendations</button>}
        {token && <button onClick={logout}>logout</button>}
      </div>

    <Authors show={page === "authors"} setPage={setPage} />

    <Books show={page === "books"} />

    <LoginForm
      show={page === "login"}
      setToken={setToken}
      setPage={setPage}
    />

    {token && (
      <NewBook show={page === "add"}
      setPage={setPage} />
    )}

    {token && (
        <Recommendations
          show={page === "recommendations"}
        />
      )}
    </div>
  )
}



export default App;
