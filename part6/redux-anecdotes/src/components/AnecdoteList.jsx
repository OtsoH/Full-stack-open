import { useSelector, useDispatch } from 'react-redux'
import { updateAnecdoteVotes } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const AnecdoteList = () => {
  const anecdotes = useSelector(state => {
    const filteredAnecdotes = state.filter === ''
      ? state.anecdotes
      : state.anecdotes.filter(anecdote =>
          anecdote.content.toLowerCase().includes(state.filter.toLowerCase())
        )
    return [...filteredAnecdotes].sort((a, b) => b.votes - a.votes)
  })

  const dispatch = useDispatch()

  const vote = (id) => {
    console.log('vote', id)
    const anecdote = anecdotes.find(a => a.id === id)
    dispatch(updateAnecdoteVotes(id))
    dispatch(setNotification(`You voted '${anecdote.content}'`, 10))
  }

  return (
    <div>
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AnecdoteList