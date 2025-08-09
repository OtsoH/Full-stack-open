import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    voteAnecdote: (state, action) => {
      const id = action.payload
      const anecdoteToVote = state.find(a => a.id === id)
      if (anecdoteToVote) {
        anecdoteToVote.votes += 1
      }
    },
    createAnecdote: (state, action) => {
      state.push(action.payload)
    },
    setAnecdotes(state, action) {
      return action.payload
    }
  }
})

export const initialAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }}

export const pushAnecdote = (content) => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.create(content)
    dispatch(createAnecdote(newAnecdote))
  }
}

export const updateAnecdoteVotes = (id) => {
  return async (dispatch, getState) => {
    const { anecdotes } = getState()
    const anecdoteToUpdate = anecdotes.find(a => a.id === id)

    const updatedAnecdote = {
      ...anecdoteToUpdate,
      votes: anecdoteToUpdate.votes + 1
    }

    await anecdoteService.update(id, updatedAnecdote)
    dispatch(voteAnecdote(id))
  }
}

export const { voteAnecdote, createAnecdote, setAnecdotes } = anecdoteSlice.actions
export default anecdoteSlice.reducer