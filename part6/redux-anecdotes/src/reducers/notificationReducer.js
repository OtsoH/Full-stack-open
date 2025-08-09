import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: 'Here are some amazing anecdotes!',
  reducers: {
    showNotification: (state, action) => {
      return action.payload
    },
    clearNotification: () => {
      return ''
    }
  }
})

export const setNotification = (message, timeInSeconds) => {
  return dispatch => {
    dispatch(showNotification(message))
    setTimeout(() => {
      dispatch(clearNotification())
    }, timeInSeconds * 1000)
  }
}

export const { showNotification, clearNotification } = notificationSlice.actions
export default notificationSlice.reducer