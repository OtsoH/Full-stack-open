import { useDispatch } from 'react-redux'
import { setNotification } from '../reducers/notificationReducer'
import { pushAnecdote } from '../reducers/anecdoteReducer'

const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const addAnecdote = async (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    dispatch(pushAnecdote(content))
    dispatch(setNotification(`You created a new anecdote: '${content}'`))
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addAnecdote}>
      <div><input name="anecdote" /></div>
      <button>create</button>
    </form>
  </div>
  )
}

export default AnecdoteForm