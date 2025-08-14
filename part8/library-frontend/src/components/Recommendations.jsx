import { useQuery } from '@apollo/client'
import { ALL_BOOKS, ME } from '../queries'

const Recommendations = ({ show }) => {
  const userResult = useQuery(ME, {
    skip: !show
  })

  const booksResult = useQuery(ALL_BOOKS, {
    variables: {
      genre: userResult.data?.me?.favoriteGenre || null
    },
    skip: !show || !userResult.data?.me?.favoriteGenre
  })

  if (!show) {
    return null
  }

  if (userResult.loading) {
    return <div>Loading user data...</div>
  }

  if (userResult.error) {
    console.error('User query error:', userResult.error)
    return <div>Error loading user data: {userResult.error.message}</div>
  }

  if (!userResult.data || !userResult.data.me) {
    return <div>You must be logged in to see recommendations</div>
  }

  const user = userResult.data.me

  if (booksResult.loading) {
    return (
      <div>
        <h2>recommendations</h2>
        <p>books in your favorite genre <strong>{user.favoriteGenre}</strong></p>
        <div>Loading books...</div>
      </div>
    )
  }

  if (booksResult.error) {
    console.error('Books query error:', booksResult.error)
    return (
      <div>
        <h2>recommendations</h2>
        <p>books in your favorite genre <strong>{user.favoriteGenre}</strong></p>
        <div>Error loading books: {booksResult.error.message}</div>
      </div>
    )
  }

  const books = booksResult.data?.allBooks || []

  return (
    <div>
      <h2>recommendations</h2>
      <p>books in your favorite genre <strong>{user.favoriteGenre}</strong></p>

      {books.length > 0 ? (
        <table>
          <tbody>
            <tr>
              <th></th>
              <th>author</th>
              <th>published</th>
            </tr>
            {books.map((book) => (
              <tr key={book.id || book.title}>
                <td>{book.title}</td>
                <td>{book.author?.name || 'Unknown'}</td>
                <td>{book.published}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No books found in your favorite genre <strong>{user.favoriteGenre}</strong>.</p>
      )}

      <p>Found {books.length} book{books.length !== 1 ? 's' : ''} in genre {user.favoriteGenre}</p>
    </div>
  )
}

export default Recommendations