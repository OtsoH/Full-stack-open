import { useQuery, useMutation } from '@apollo/client'
import {ALL_AUTHORS, EDIT_AUTHOR} from '../queries'
import { useState } from 'react'

const Authors = ({show, setPage}) => {
  const result = useQuery(ALL_AUTHORS)
  const [author, setAuthor] = useState('')
  const [born, setBorn] = useState('')
  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }]
  })

  const token = localStorage.getItem("user-token")

  if (!show) {
    return null
  }

  if (result.loading) {
    return <div>Loading...</div>
  }
  const authors = result.data.allAuthors

  const submit = async (event) => {
    event.preventDefault()

    if (!token) {
      setPage("login")
      return
    }

    if (!author) {
      alert("Please select an author")
      return
    }

    if (!born) {
      alert("Please enter birth year")
      return
    }

    const selectedAuthor = authors.find(a => a.id === author)
    await editAuthor({
      variables: {
        name: selectedAuthor.name,
        setBornTo: parseInt(born)
      }
    })

    setAuthor('')
    setBorn('')
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>Set birth year</h2>
      <form onSubmit={submit}>
        <div>
          name
          <select value={author} onChange={({ target }) => setAuthor(target.value)}>
            <option value="">Choose author...</option>
            {authors.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          born
          <input
            type="number"
            value={born}
            onChange={({ target }) => setBorn(target.value)}
          />
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  )
}

export default Authors
