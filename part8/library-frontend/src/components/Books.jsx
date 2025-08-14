import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries'
import { useState } from 'react'

const Books = ({show}) => {
  const [selectedGenre, setSelectedGenre] = useState('')

  const result = useQuery(ALL_BOOKS, {
    variables: { genre: selectedGenre || null },
    skip: !show
  })

  if (!show) {
    return null
  }

  if (result.loading) {
    return <div>loading...</div>
  }

  const books = result.data.allBooks

  const allGenres = [...new Set(books.flatMap(book => book.genres))]

  const handleGenreChange = (genre) => {
    setSelectedGenre(genre)
  }

  return (
    <div>
      <h2>books</h2>
      <div style={{ marginBottom: '20px' }}>
        <h3>Filter by genre:</h3>
        <button onClick={() => handleGenreChange('')}>
          all genres
        </button>
        {allGenres.map(genre => (
          <button
            key={genre}
            onClick={() => handleGenreChange(genre)}
          >
          {genre}
          </button>
        ))}
      </div>

      <p>
        {selectedGenre
          ? `Showing books in genre: ${selectedGenre}`
          : 'Showing all books'
        }
      </p>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Books
